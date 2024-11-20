'use server'
import dbConnect from "../database/connectDB"
import { deleteAsset, deleteAssets } from "./helper.action";
import { getPublicId } from "../helper";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";
import { User } from "../database/models/user.model";
import { Cart } from "../database/models/cart.model";
import { Temp } from "../database/models/temp.model";
import { Admin } from "../database/models/admin.model";


export async function addToCart(data: AddToCartParams) {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const user = await User.findOne({ clerkId: userId }).select('_id');
        if (!user) {
            throw new Error("User not found");
        }
        const isAlreadyInCart = await Cart.findOne({ buyer: user._id, product: data.productId });
        if (isAlreadyInCart) {
            return JSON.parse(JSON.stringify(isAlreadyInCart));
        }
        const cart = await Cart.create({
            buyer: user._id,
            product: data.productId,
            formData: data.formData,
            processedImage: data.processedImage,
            quantity: data.quantity
        });
        if (!cart) {
            throw new Error('Error Occurred on Adding to Cart');
        }
        await Temp.deleteOne({ clerkId: userId, product: new mongoose.Types.ObjectId(data.productId),tempType:'product' });
        return JSON.parse(JSON.stringify(cart));
    } catch (error) {
        console.log("Error Occurred on Adding to Cart ", error);
        return null;
    }
}

export async function updateCart(data: AddToCartParams) {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const user = await User.findOne({ clerkId: userId }).select('_id');
        if (!user) {
            throw new Error("User not found");
        }
        const cart = await Cart.findOneAndUpdate({ buyer: user._id, product: new mongoose.Types.ObjectId(data.productId) },
            { quantity: data.quantity, formData: data.formData, processedImage: data.processedImage }, { new: true });
        if (!cart) {
            throw new Error('Error Occurred on Updating Cart');
        }
        await Temp.deleteOne({ clerkId: userId, product: new mongoose.Types.ObjectId(data.productId),tempType:'product' });
        return JSON.parse(JSON.stringify(cart));
    } catch (error) {
        console.log("Error Occurred on Updating Cart ", error);
        return null;
    }
}

export async function updateCartImages({ cartId, image, images, imgTodelete, fieldName }: { cartId: string, image?: string, images?: string[], imgTodelete?: string, fieldName: string }) {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const user = await User.findOne({ clerkId: userId }).select('_id');
        if (!user) {
            throw new Error("User not found");
        }
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error("Cart not found");
        }
        if (image && cart.formData) {
            if (cart.formData.images && cart.formData.images[fieldName]) {
                const publicId = getPublicId({ url: cart.formData.images[fieldName] });
                await deleteAsset(publicId);
            }
            let updatedCart;
            if (cart.formData.images) {
                const formData = {
                    data: cart.formData.data || {},
                    images: {
                        ...cart.formData.images,
                        [fieldName]: image
                    }
                }
                updatedCart = await Cart.findByIdAndUpdate(cartId, {
                    formData
                }, { new: true });
            } else {
                console.log(cartId)
                const formData = {
                    data: cart.formData.data || {},
                    images: {
                        [fieldName]: image
                    }
                }
                updatedCart = await Cart.findByIdAndUpdate(cartId, {
                    formData
                }, { new: true });
            }
            if (!updatedCart) {
                throw new Error('Error Occurred on Updating Cart Images');
            }
            return JSON.parse(JSON.stringify(updatedCart));
        } else if (images && cart.formData) {
            let updatedCart;
            if (cart.formData.images) {
                const formData = {
                    data: cart.formData.data || {},
                    images: {
                        ...cart.formData.images,
                        [fieldName]: cart.formData.images[fieldName] ? [...cart.formData.images[fieldName], ...images] : images
                    }
                }
                updatedCart = await Cart.findByIdAndUpdate(cartId, {
                    formData
                }, { new: true });
            } else {
                const formData = {
                    data: cart.formData.data || {},
                    images: {
                        [fieldName]: images
                    }
                }
                updatedCart = await Cart.findByIdAndUpdate(cartId, {
                    formData
                }, { new: true });
            }
            if (!updatedCart) {
                throw new Error('Error Occurred on Updating Cart Images');
            }
            return JSON.parse(JSON.stringify(updatedCart));
        } else if (imgTodelete && cart.formData) {
            if (cart.formData.images) {
                const formData = {
                    data: cart.formData.data || {},
                    images: {
                        ...cart.formData.images,
                        [fieldName]: cart.formData.images[fieldName].filter((img: string) => img !== imgTodelete)
                    }
                }
                const updatedCart = await Cart.findByIdAndUpdate(cartId, {
                    formData
                }, { new: true });
                if (!updatedCart) {
                    throw new Error('Error Occurred on Updating Cart Images');
                }
                return JSON.parse(JSON.stringify(updatedCart));
            }
        }
    } catch (error) {
        console.log("Error Occurred on Updating Cart Images ", error);
        return null;
    }
}


export async function getMyCart() {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const user = await User.findOne({ clerkId: userId }).select('_id');
        if (!user) {
            throw new Error("User not found");
        }
        const cart = await Cart.aggregate([
            {
                $match: {
                    buyer: user._id
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'product',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                description: 1,
                                maxPrice: 1,
                                discountedPrice: 1,
                                badge: 1,
                                mainPhoto: 1,
                                minDeliveryDays: 1,
                                maxDeliveryDays: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    product: {
                        $arrayElemAt: ['$product', 0]
                    }
                }
            },
            {
                $project: {
                    product: 1,
                    formData: 1,
                    quantity: 1,
                    processedImage: 1
                }
            }
        ]);
        return JSON.parse(JSON.stringify(cart));
    } catch (error) {
        console.log("Error Occurred on Getting My Cart ", error);
        return null;
    }
}


export async function removeFromCart(cartId: string) {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const user = await User.findOne({ clerkId: userId }).select('_id');
        if (!user) {
            throw new Error("User not found");
        }
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error("Cart not found");
        }
        if (cart.buyer.toString() !== user._id.toString()) {
            throw new Error("Unauthorized");
        }
        if (cart.processedImage) {
            const publicId = getPublicId({ url: cart.processedImage });
            await deleteAsset(publicId);
        } else if (cart.formData && cart.formData.images) {
            const publicIds = [];
            for (const i in cart.formData.images) {
                if (Array.isArray(cart.formData.images[i])) {
                    cart.formData.images[i].forEach((img: string) => {
                        publicIds.push(getPublicId({ url: img }));
                    });
                } else {
                    publicIds.push(getPublicId({ url: cart.formData.images[i] }));
                }
            }
            await deleteAssets(publicIds);
        }
        await Cart.findByIdAndDelete(cartId);
        return true;
    } catch (error) {
        console.log("Error Occurred on Removing from Cart ", error);
        return null;
    }
}

export async function deleteUnplacedCartItem(cartId: string) {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error("Cart not found");
        }
        if (cart.processedImage) {
            const publicId = getPublicId({ url: cart.processedImage });
            await deleteAsset(publicId);
        } else if (cart.formData && cart.formData.images) {
            const publicIds = [];
            for (const i in cart.formData.images) {
                if (Array.isArray(cart.formData.images[i])) {
                    cart.formData.images[i].forEach((img: string) => {
                        publicIds.push(getPublicId({ url: img }));
                    });
                } else {
                    publicIds.push(getPublicId({ url: cart.formData.images[i] }));
                }
            }
            await deleteAssets(publicIds);
        }
        await Cart.findByIdAndDelete(cartId);
        return true;
    } catch (error) {
        console.log("Error Occurred on Removing from Cart ", error);
        return null;
    }
}

export async function deleteALlUnplacedCarts(cartIds:string[],publicIds:string[]) {
    try {
        await dbConnect();
        const {userId} = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        await deleteAssets(publicIds);
        const mongodbCartIds:any[] = [];
        cartIds.map((item,i)=>{
            mongodbCartIds.push(new mongoose.Types.ObjectId(item))
        })
        const result = await Cart.deleteMany({
            _id:{
                $in:mongodbCartIds,
            }
        })
        if (!result) {
            throw new Error('error on delete items')
        }
        return true;
    } catch (error) {
        console.log("Error Occurred on Delete All Carts ", error);
        return null;
    }
}

export async function updateItemQuantity({ cartId, quantity }: { cartId: string, quantity: number }) {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const user = await User.findOne({ clerkId: userId }).select('_id');
        if (!user) {
            throw new Error("User not found");
        }
        const updatedCart = await Cart.findOneAndUpdate({
            _id: new mongoose.Types.ObjectId(cartId),
            buyer: user._id
        }, { quantity }, { new: true });
        if (!updatedCart) {
            throw new Error('Error Occurred on Updating Item Quantity');
        }
        return JSON.parse(JSON.stringify(updatedCart));
    } catch (error) {
        console.log("Error Occurred on Updating Item Quantity ", error);
        return null;
    }
}


export async function getUnusedCartitems(days: number, page: number, limit: number) {
    try {
        await dbConnect();
        const today = new Date();
        const daysAgo = new Date(today);
        daysAgo.setDate(today.getDate() - days);

        const carts = await Cart.aggregate([
            {
                $match: {
                    updatedAt: {
                        $lte: daysAgo
                    }
                }
            },
            {
                $lookup:{
                    from:'users',
                    localField:'buyer',
                    foreignField:'_id',
                    as:'buyer',
                    pipeline:[
                        {
                            $project:{
                                email:1,
                                firstName:1,
                                lastName:1
                            }
                        }
                    ]
                }
            },
            {
                $lookup:{
                    from:'products',
                    localField:'product',
                    foreignField:'_id',
                    as:'product',
                    pipeline:[
                        {
                            $project:{
                                name:1,
                                discountedPrice:1,
                                maxPrice:1,
                                mainPhoto:1
                            }
                        }
                    ]
                }
            },
            {
                $addFields:{
                    buyer:{
                        $arrayElemAt:['$buyer',0]
                    },
                    product:{
                        $arrayElemAt:['$product',0]
                    }
                }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            }
        ])
        if (!carts) {
            throw new Error('Error Occurred on Getting Unused Cart Items');
        }
        return JSON.parse(JSON.stringify(carts));
    } catch (error) {
        console.log("Error Occurred on Getting Unused Cart Items ", error);
        return null;
    }
}


export async function deletecartItemByAdmin(cartId: string) {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error("Cart not found");
        }
        if (cart.processedImage) {
            const publicId = getPublicId({ url: cart.processedImage });
            await deleteAsset(publicId);
        } else if (cart.formData && cart.formData.images) {
            const publicIds = [];
            for (const i in cart.formData.images) {
                if (Array.isArray(cart.formData.images[i])) {
                    cart.formData.images[i].forEach((img: string) => {
                        publicIds.push(getPublicId({ url: img }));
                    });
                } else {
                    publicIds.push(getPublicId({ url: cart.formData.images[i] }));
                }
            }
            await deleteAssets(publicIds);
        }
        await Cart.findByIdAndDelete(cartId);
        return true;
    } catch (error) {
        console.log("Error Occurred on Deleting Cart Item ", error);
        return null;
    }
}