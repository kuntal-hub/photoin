'use server'
import dbConnect from "../database/connectDB"
import { deleteAsset, deleteAssets } from "./helper.action";
import { getPublicId } from "../helper";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";
import { User } from "../database/models/user.model";
import { Cart } from "../database/models/cart.model";
import { Temp } from "../database/models/temp.model";
import { Order } from "../database/models/order.model";
import { revalidatePath } from 'next/cache'
import { Admin } from "../database/models/admin.model";

export async function placeOrder(data:PlaceOrderParams) {
    try {
        await dbConnect()
        const { userId } = auth();
        if (!userId) {
            throw new Error("User not found")
        }
        const user = await User.findOne({ clerkId: userId }).select('_id firstName lastName email');
        if (!user) {
            throw new Error('User not exists');
        }
        let order:any = null;
        if (data.paymentMethod === 'cod') {
            order = await Order.create({
                products: data.products,
                paymentMethod: data.paymentMethod,
                buyer: user._id,
                total:data.total,
                deliveryAddress: new mongoose.Types.ObjectId(data.deliveryAddress),
            })
            if (data.type === 'single') {
                await Temp.deleteOne({ clerkId: userId, product: new mongoose.Types.ObjectId(data.products[0].product), tempType:'product' });
                await Cart.deleteOne({ buyer: user._id, product: new mongoose.Types.ObjectId(data.products[0].product) });
            } else{
                await Cart.deleteMany({buyer:user._id})
            }
        } else if(data.paymentMethod === 'online') {
            // not implemented
            //
            //
            //
        } else {
            throw new Error('invalid payment method');
        }
        if (!order) {
            throw new Error('Something Went wront while placeing the order');
        }
        // const minutesAgo = new Date(Date.now() - 12 * 60 * 1000);
        // await Order.deleteMany({ createdAt: { $lt: minutesAgo },paymentMethod: 'online',paymentStatus:{$ne:'completed'} });
        order.buyer = user;
        return JSON.parse(JSON.stringify(order));
    } catch (error) {
        console.log("error on place order", error)
        return  null;
    }
}


export async function getAllOrders(data:GetAllOrederParams) {
    try {
        await dbConnect()
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - data.days);
        const match:any = {
            createdAt: { $gte: daysAgo }
        };
        if (data.status !== 'all') {
            match.status = data.status;
        }
        if (data.paymentMethod !== 'all') {
            match.paymentMethod = data.paymentMethod;
        }
        if (data.paymentStatus !== 'all') {
            match.paymentStatus = data.paymentStatus;
        }
        if (data.deliveryStatus !== 'all') {
            match.deliveryStatus = data.deliveryStatus;
        }
        const orders = await Order.aggregate([
            {
                $match: match
            },
            {
                $lookup:{
                    from: 'users',
                    localField: 'buyer',
                    foreignField: '_id',
                    as: 'buyer',
                    pipeline:[
                        {
                            $project:{
                                firstName:1,
                                lastName:1,
                                email:1
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
                    totalProducts:{$size:'$products'},
                    totalProductsQuantity:{$sum:'$products.quantity'}
                }
            },
            {
                $project:{
                    buyer:1,
                    totalProducts:1,
                    totalProductsQuantity:1,
                    total:1,
                    status:1,
                    paymentMethod:1,
                    paymentStatus:1,
                    deliveryStatus:1,
                    createdAt:1,
                    updatedAt:1
                }
            },
            {
                $sort:{
                    createdAt:-1
                }
            },
            {
                $skip: (data.page - 1) * data.limit
            },
            {
                $limit: data.limit
            }
        ])

        if (!orders) {
            throw new Error('Something Went wront while fetching the orders');
        }

        return JSON.parse(JSON.stringify(orders));
    } catch (error) {
        console.log("error on get all orders", error)
        return null;
    }
}


export async function searchProductsByEmail(email:string) {
    try {
        await dbConnect()
        const user = await User.findOne({ email }).select('_id');
        if (!user) {
            throw new Error('User not exists');
        }
        const orders = await Order.aggregate([
            {
                $match: {
                    buyer: user._id
                }
            },
            {
                $lookup:{
                    from: 'users',
                    localField: 'buyer',
                    foreignField: '_id',
                    as: 'buyer',
                    pipeline:[
                        {
                            $project:{
                                firstName:1,
                                lastName:1,
                                email:1
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
                    totalProducts:{$size:'$products'},
                    totalProductsQuantity:{$sum:'$products.quantity'}
                }
            },
            {
                $project:{
                    buyer:1,
                    totalProducts:1,
                    totalProductsQuantity:1,
                    total:1,
                    status:1,
                    paymentMethod:1,
                    paymentStatus:1,
                    deliveryStatus:1,
                    createdAt:1,
                    updatedAt:1
                }
            },
            {
                $sort:{
                    createdAt:-1
                }
            },
            {
                $limit:30
            }
        ])

        if (!orders) {
            throw new Error('Something Went wront while fetching the orders');
        }

        return JSON.parse(JSON.stringify(orders));
    } catch (error) {
        console.log("error on search products by email", error)
        return null;
    }
}


export async function getAdminOrder(orderId:string) {
    try {
        await dbConnect();
        const order = await Order.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(orderId)
                }
            },
            {
                $lookup:{
                    from: 'users',
                    localField: 'buyer',
                    foreignField: '_id',
                    as: 'buyer',
                    pipeline:[
                        {
                            $project:{
                                firstName:1,
                                lastName:1,
                                email:1
                            }
                        }
                    ]
                }
            },
            {
                $lookup:{
                    from: 'addresses',
                    localField: 'deliveryAddress',
                    foreignField: '_id',
                    as: 'deliveryAddress',
                    pipeline:[
                        {
                            $project:{
                                user:0,
                                __v:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: '$products'
            },
            {
                $lookup:{
                    from: 'products',
                    localField: 'products.product',
                    foreignField: '_id',
                    as: 'products.product',
                    pipeline:[
                        {
                            $project:{
                                name:1,
                                description:1,
                                mainPhoto:1,
                                photos:1,
                                maxPrice:1,
                                discountedPrice:1
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
                    deliveryAddress:{
                        $arrayElemAt:['$deliveryAddress',0]
                    },
                    'products.product':{
                        $arrayElemAt:['$products.product',0]
                    }
                }
            },
            {
                $group:{
                    _id:'$_id',
                    buyer:{$first:'$buyer'},
                    total:{$first:'$total'},
                    status:{$first:'$status'},
                    paymentMethod:{$first:'$paymentMethod'},
                    paymentStatus:{$first:'$paymentStatus'},
                    deliveryStatus:{$first:'$deliveryStatus'},
                    createdAt:{$first:'$createdAt'},
                    updatedAt:{$first:'$updatedAt'},
                    products:{$push:'$products'},
                    deliveryAddress:{$first:'$deliveryAddress'}
                }
            }
        ])

        if (!order || order.length === 0) {
            throw new Error("Order not found");
        }

        return JSON.parse(JSON.stringify(order[0]));
    } catch (error) {
        console.log("error on get admin order", error)
        return null;
    }
}


export async function updateOrderStatus(orderId:string,status:"pending" | "processing" | "completed" | "cancelled") {
    try {
        await dbConnect();
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            throw new Error('Order not found');
        }
        revalidatePath(`/admin/order/${orderId}`)
        return JSON.parse(JSON.stringify(order));
    } catch (error) {
        console.log("error on update order status", error)
        return null;
    }
}

export async function updateOrderPaymentStatus(orderId:string,paymentStatus:"pending" | "completed" | "failed") {
    try {
        await dbConnect();
        const order = await Order.findByIdAndUpdate(orderId, { paymentStatus }, { new: true });
        if (!order) {
            throw new Error('Order not found');
        }
        revalidatePath(`/admin/order/${orderId}`)
        return JSON.parse(JSON.stringify(order));
    } catch (error) {
        console.log("error on update order payment status", error)
        return null;
    }   
}


export async function updateOrderDeliveryStatus(orderId:string,deliveryStatus:"ordered" | "shipped" | "outOfDelivery" | "delivered") {
    try {
        await dbConnect();
        const order = await Order.findByIdAndUpdate(orderId, { deliveryStatus }, { new: true });
        if (!order) {
            throw new Error('Order not found');
        }
        revalidatePath(`/admin/order/${orderId}`)
        return JSON.parse(JSON.stringify(order));
    } catch (error) {
        console.log("error on update order delivery status", error)
        return null;
    }   
}


export async function getMyOrders() {
    try {
        await dbConnect()
        const {userId} = auth()
        if (!userId) {
            throw new Error("User not found")
        }
        const user = await User.findOne({clerkId:userId}).select('_id');
        if (!user) {
            throw new Error('User not exists');
        }
        const orders = await Order.aggregate([
            {
                $match:{
                    buyer:user._id
                }
            },
            {
                $unwind: '$products'
            },
            {
                $lookup:{
                    from: 'products',
                    localField: 'products.product',
                    foreignField: '_id',
                    as: 'product',
                    pipeline:[
                        {
                            $project:{
                                name:1,
                                description:1,
                                mainPhoto:1,
                                photos:1
                            }
                        }
                    ]
                }
            },
            {
                $lookup:{
                    from: 'reviews',
                    localField: 'products.product',
                    foreignField: 'product',
                    as:'review',
                    pipeline:[
                        {
                            $match:{
                                user:user._id
                            }
                        },
                        {
                            $project:{
                                rating:1,
                                comment:1
                            }
                        }
                    ]
                }
            },
            {
                $addFields:{
                    product:{
                        $arrayElemAt:['$product',0]
                    },
                    review:{
                        $arrayElemAt:['$review',0]
                    }
                }
            },
            {
                $project:{
                    product:1,
                    review:1,
                    deliveryStatus:1,
                    status:1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $limit: 30
            }
        ])
        if (!orders) {
            throw new Error('Something Went wront while fetching the orders');
        }
        return JSON.parse(JSON.stringify(orders));
    } catch (error) {
        console.log('error on get my orders', error)
        return null;
    }
}


export async function getMyOrderDetails(orderId:string) {
    try {
        await dbConnect();
        const {userId} = auth();
        if (!userId) {
            throw new Error("User not found")
        }
        const user = await User.findOne({clerkId:userId}).select('_id');
        if (!user) {
            throw new Error('User not exists');
        }
        const order = await Order.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(orderId),
                    buyer: user._id
                }
            },
            {
                $lookup:{
                    from: 'addresses',
                    localField: 'deliveryAddress',
                    foreignField: '_id',
                    as: 'deliveryAddress',
                    pipeline:[
                        {
                            $project:{
                                user:0,
                                __v:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: '$products'
            },
            {
                $lookup:{
                    from: 'products',
                    localField: 'products.product',
                    foreignField: '_id',
                    as: 'product',
                    pipeline:[
                        {
                            $lookup:{
                                from:'reviews',
                                localField:'_id',
                                foreignField:'product',
                                as:'review',
                                pipeline:[
                                    {
                                        $match:{
                                            user:user._id
                                        }
                                    },
                                    {
                                        $project:{
                                            rating:1,
                                            comment:1,
                                            image:1,
                                            product:1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields:{
                                review:{
                                    $arrayElemAt:['$review',0]
                                }
                            }
                        },
                        {
                            $project:{
                                name:1,
                                description:1,
                                mainPhoto:1,
                                photos:1,
                                maxPrice:1,
                                discountedPrice:1,
                                review:1
                            }
                        }
                    ]
                }
            },
            {
                $addFields:{
                    deliveryAddress:{
                        $arrayElemAt:['$deliveryAddress',0]
                    },
                    'product.quantity':'$products.quantity',
                }
            },
            {
                $addFields:{
                    products:{
                        $arrayElemAt:['$product',0]
                    }
                }
            },
            {
                $group:{
                    _id:'$_id',
                    total:{$first:'$total'},
                    status:{$first:'$status'},
                    paymentMethod:{$first:'$paymentMethod'},
                    paymentStatus:{$first:'$paymentStatus'},
                    deliveryStatus:{$first:'$deliveryStatus'},
                    createdAt:{$first:'$createdAt'},
                    updatedAt:{$first:'$updatedAt'},
                    products:{$push:'$products'},
                    deliveryAddress:{$first:'$deliveryAddress'}
                }
            }
        ])

        if (!order || order.length === 0) {
            throw new Error("Order not found");
        }

        return JSON.parse(JSON.stringify(order[0]));
    } catch (error) {
        console.log("error on get my order details", error)
        return null;
    }
}


export async function deleteOrder(orderId:string) {
    try {
        await dbConnect();
        const {userId} = auth();
        if (!userId) {
            throw new Error("User not found")
        }
        const admin = await Admin.findOne({clerkId:userId}).select('_id');
        if (!admin) {
            throw new Error('Admin not exists');
        }
        const order = await Order.findById(orderId).select('products');
        if (!order) {
            throw new Error('Order not found');
        }
        const publicIds:string[] = [];
        for (let i = 0; i < order.products.length; i++) {
            if (order.products[i].processedImage) {
                publicIds.push(getPublicId({url:order.products[i].processedImage}));
            } else if (order.products[i].formData && order.products[i].formData.images) {

                for (const j in order.products[i].formData.images) {
                    if (Array.isArray(order.products[i].formData.images[j])) {
                        order.products[i].formData.images[j].forEach((img: string) => {
                            publicIds.push(getPublicId({ url: img }));
                        });
                    } else {
                        publicIds.push(getPublicId({ url: order.products[i].formData.images[j] }));
                    }
                }
            }
        }
        // console.log(publicIds)
        await deleteAssets(publicIds);
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            throw new Error('Something Went wront while deleting the order');
        }
        return true;
    } catch (error) {
        console.log("error on delete all images", error)
        return null;
    }
}


export async function cancleOrder(orderId:string) {
    try {
        await dbConnect();
        const {userId} = auth();
        if (!userId) {
            throw new Error("User not found")
        }
        const user = await User.findOne({clerkId:userId}).select('_id firstName lastName email');
        if (!user) {
            throw new Error('User not exists');
        }
        const order = await Order.findOneAndUpdate({
            _id:new mongoose.Types.ObjectId(orderId),
            buyer:user._id,
            status:'pending'
        },
        {
            $set:{
                status:'cancelled'
            }
        },
        {new:true});
        if (!order) {
            throw new Error('Order not found');
        }
        revalidatePath('/my-orders')
        order.buyer = user;
        return JSON.parse(JSON.stringify(order));
    } catch (error) {
        console.log("error on cancle order", error)
        return null;
    }
}