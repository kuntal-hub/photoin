"use server";

import { User } from "@/lib/database/models/user.model";
import { Admin } from "@/lib/database/models/admin.model";
import dbConnect from "../database/connectDB";
import { revalidatePath } from "next/cache";
import { adminEmails } from "@/constants/index";
import mongoose from "mongoose";
import { Order } from "../database/models/order.model";
import { Temp } from "../database/models/temp.model";
import { Review } from "../database/models/review.model";
import { Cart } from "../database/models/cart.model";
import { deleteAsset, deleteAssets } from "./helper.action";
import { getPublicId } from "../helper";
import { Address } from "../database/models/address.model";
import { Wishlist } from "../database/models/wishlist.model";

// createUser function
export const createUser = async (userData: CreateUserParams) => {
    try {
      await dbConnect();
        let isAdmin = false;
        if (adminEmails.includes(userData.email)) {
            isAdmin = true;
        }
        const user = await User.create(userData);
        if (isAdmin) {
            await Admin.create(userData);
        }
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.log("Error Occurred on Creating DB User ", error);
        return null;
    }
};

// updateUser function
export const updateUser = async (userData: UpdateUserParams, clerkId: string) => {
    try {
        await dbConnect();
        const updatedUser = await User.findOneAndUpdate({ clerkId }, userData, { new: true });
        const updatedAdmin = await Admin.findOneAndUpdate({ clerkId }, userData, { new: true })
        if (!updatedUser) {
            throw new Error("User not found");
        }
        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        console.log("Error Occurred on Updating DB User ", error);
        return null;
    }
};

// deleteUser function
export const deleteUser = async (clerkId: string) => {
    try {
        await dbConnect();
        let isAdmin = false;
        const user = await User.findOne({ clerkId });
        if (!user) {
            throw new Error("User not found");
        }
        if (adminEmails.includes(user.email)) {
            isAdmin = true;
        }


        const orders = await Order.find({buyer:user._id}).select("products");
        const temps = await Temp.find({clerkId:clerkId}).select("images");
        const reviews = await Review.find({user:user._id}).select("image");
        const carts = await Cart.find({buyer:user._id}).select("processedImage formData");

        const publicIds:string[] = [];

        orders.forEach((order) => {
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
        })

        carts.forEach((cart)=> {
            if (cart.processedImage) {
                publicIds.push(getPublicId({ url: cart.processedImage }));
            } else if (cart.formData && cart.formData.images) {
                for (const i in cart.formData.images) {
                    if (Array.isArray(cart.formData.images[i])) {
                        cart.formData.images[i].forEach((img: string) => {
                            publicIds.push(getPublicId({ url: img }));
                        });
                    } else {
                        publicIds.push(getPublicId({ url: cart.formData.images[i] }));
                    }
                }
            }
        })

        temps.forEach((temp)=> {
            if (temp.images) {
                for (const i in temp.images) {
                    if (Array.isArray(temp.images[i])) {
                        temp.images[i].forEach((img: string) => {
                            publicIds.push(getPublicId({ url: img }));
                        });
                    } else {
                        publicIds.push(getPublicId({ url: temp.images[i] }));
                    }
                }
            }
        })

        reviews.forEach((review)=>{
            if (review.image) {
                publicIds.push(getPublicId({url:review.image}));
            }
        })

        await deleteAssets(publicIds);

        await Order.deleteMany({buyer:user._id})
        await Cart.deleteMany({buyer:user._id})
        await Review.deleteMany({user:user._id})
        await Temp.deleteMany({clerkId:clerkId})
        await Address.deleteMany({user:user._id})
        await Wishlist.deleteMany({user:user._id})

        const deletedUser = await User.findOneAndDelete({ clerkId });
        if (isAdmin) {
            await Admin.findOneAndDelete({ clerkId });
        }
        revalidatePath("/");
        return JSON.parse(JSON.stringify(deletedUser));
    } catch (error) {
        console.log("Error Occurred on Deleting DB User ", error);
        return null;
    }
}

// getUser function
export const getUser = async (clerkId: string) => {
    try {
        await dbConnect();
        const user = await User.findOne({clerkId});
        if (!user) {
            throw new Error("User not found");
        }
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.log("Error Occurred on Getting DB User ", error);
        return null;
    }
}

// getAdmin function
export const getAdmin = async (clerkId: string) => {
    try {
        await dbConnect();
        const admin = await Admin.findOne({ clerkId });
        if (!admin) {
            throw new Error("Admin not found");
        }
        return JSON.parse(JSON.stringify(admin));
    } catch (error) {
        console.log("Error Occurred on Getting DB Admin ", error);
        return null;
    }
}

// getAllUsers function
export const getAllUsers = async (page:number,limit:number) => {
    try {
        await dbConnect();
        const users = await User.find().skip((page-1)*limit).limit(limit);
        if (!users) {
            throw new Error("Users not found");
        }
        const totalUsers = await User.countDocuments();
        return {users:JSON.parse(JSON.stringify(users)),totalUsers:totalUsers};
    } catch (error) {
        console.log("Error Occurred on Getting All DB Users ", error);
        return null;
    }
}

// getuserdetails function
export const getUserDetails = async (id: string) => {
    try {
        await dbConnect();
        const user = await User.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup:{
                    from: "carts",
                    localField: "_id",
                    foreignField: "buyer",
                    as: "cartItems",
                    pipeline:[
                        {
                            $lookup:{
                                from: "products",
                                localField: "product",
                                foreignField: "_id",
                                as: "product",
                                pipeline:[
                                    {
                                        $project:{
                                            _id:1,
                                            name:1,
                                            mainPhoto:1,
                                            maxPrice:1,
                                            discountedPrice:1,
                                            description:1,
                                            badge:1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields:{
                                product:{$arrayElemAt:["$product",0]}
                            }
                        },
                        {
                            $project:{
                                _id:1,
                                product:1,
                                quantity:1,
                                formData:1,
                                processedImage:1,
                            }
                        }
                    ]
                }
            },
            {
                $lookup:{
                    from: "orders",
                    localField: "_id",
                    foreignField: "buyer",
                    as: "orders",
                    pipeline:[
                        {
                            $project:{
                                _id:1,
                                status:1,
                                total:1,
                                createdAt:1,
                                deliveryStatus:1
                            }
                        }
                    ]
                }
            },
            {
                $lookup:{
                    from: 'wishlists',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'wishlists',
                    pipeline:[
                        {
                            $lookup:{
                                from: 'products',
                                localField: 'product',
                                foreignField: '_id',
                                as: 'product',
                                pipeline:[
                                    {
                                        $project:{
                                            _id:1,
                                            name:1,
                                            mainPhoto:1,
                                            maxPrice:1,
                                            discountedPrice:1,
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields:{
                                product:{$arrayElemAt:["$product",0]}
                            }
                        },
                        {
                            $replaceRoot:{
                                newRoot:"$product"
                            }
                        }
                    ]
                }
            },
            {
                $lookup:{
                    from:'reviews',
                    localField:'_id',
                    foreignField:'user',
                    as:'reviews',
                    pipeline:[
                        {
                            $project:{
                                _id:1,
                                product:1,
                                rating:1,
                                comment:1,
                                image:1,
                                createdAt:1
                            }
                        }
                    ]
                }
            },
            {
                $lookup:{
                    from: "addresses",
                    localField: "_id",
                    foreignField: "user",
                    as: "addresses",
                }
            },
            {
                $lookup:{
                    from:"temps",
                    localField:"clerkId",
                    foreignField:"clerkId",
                    as:"tempCarts",
                    pipeline:[
                        {
                            $match:{
                                tempType:"product"
                            }
                        },
                        {
                            $lookup:{
                                from:"products",
                                localField:"product",
                                foreignField:"_id",
                                as:"product",
                                pipeline:[
                                    {
                                        $project:{
                                            _id:1,
                                            name:1,
                                            mainPhoto:1,
                                            maxPrice:1,
                                            discountedPrice:1,
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields:{
                                product:{$arrayElemAt:["$product",0]}
                            }
                        },
                        {
                            $project:{
                                _id:1,
                                product:1,
                                images:1,
                                createdAt:1,
                                updatedAt:1
                            }
                        }
                    ]
                }
            },
            {
                $lookup:{
                    from:"temps",
                    localField:"clerkId",
                    foreignField:"clerkId",
                    as:"tempReviews",
                    pipeline:[
                        {
                            $match:{
                                tempType:"review"
                            }
                        },
                        {
                            $addFields:{
                                reviewImage:"$images.reviewImage"
                            }
                        },
                        {
                            $project:{
                                _id:1,
                                product:1,
                                reviewImage:1
                            }
                        }
                    ]
                }
            },
        ]);
        if (!user || user.length === 0) {
            throw new Error("User not found");
        }
        return JSON.parse(JSON.stringify(user[0]));
    } catch (error) {
        console.log("Error Occurred on Getting DB User ", error);
        return null;
    }
}