'use server';
import dbConnect from "../database/connectDB"
import mongoose from "mongoose";
import { Wishlist } from "../database/models/wishlist.model";
import { User } from "../database/models/user.model";
import { auth } from "@clerk/nextjs/server";

export async function toggleWishProduct(productId:string, clerkId:string) {
    try {
        await dbConnect();
        const user = await User.findOne({clerkId});
        if (!user) {
            throw new Error("User not found");
        }
        const wishlist = await Wishlist.findOne({
            user: user._id,
            product: new mongoose.Types.ObjectId(productId),
        });
        if (wishlist) {
            await Wishlist.findByIdAndDelete(wishlist._id);
            return true;
        } else {
            await Wishlist.create({
                user: user._id,
                product: new mongoose.Types.ObjectId(productId),
            });
            return true;
        }
    } catch (error) {
        console.log("error on toggle wish product", error);
        return null;
    } 
}

export async function getWishlist(page:number,limit:number) {
    try {
        await dbConnect();
        const {userId} = auth();
        if (!userId) {
            throw new Error("User not found");
        }
        const user = await User.findOne({clerkId:userId});
        if (!user) {
            throw new Error("User not found");
        }
        const products = await Wishlist.aggregate([
            {
                $match:{
                    user: user._id,
                }
            },
            {
                $lookup:{
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "product",
                    pipeline:[
                        {
                            $match: {
                                mainPhoto: { $exists: true }
                            }
                        },
                        {
                            $project:{
                                name: 1,
                                mainPhoto: 1,
                                maxPrice: 1,
                                discountedPrice: 1,
                                badge: 1,
                            }
                        }
                    ]
                }
            },
            {
                $sort: {createdAt: -1}
            },
            {
                $addFields:{
                    product: { $arrayElemAt: ["$product", 0] }
                }
            },
            {
                $replaceRoot: { newRoot: "$product" }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            }
        ]);
        if (!products) {
            throw new Error("Error on getting wishlist");
        }
        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.log("error on get wishlist", error);
        return null;
    }
};


export async function isAddedToWishlist(productId:string, clerkId:string) {
    try {
        await dbConnect();
        const user = await User.findOne({clerkId:clerkId});
        if (!user) {
            throw new Error("User not found");
        }
        const result = await Wishlist.findOne({
            product: new mongoose.Types.ObjectId(productId),
            user: user._id
        });
        return result ? true : false;
    } catch (error) {
        console.log("error on is added to wishlist", error);
        return null;
    }
}
