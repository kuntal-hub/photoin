'use server';
import mongoose from "mongoose";
import dbConnect from "../database/connectDB"
import { Review } from "../database/models/review.model";
import { User } from "../database/models/user.model";
import { deleteAsset } from "./helper.action";
import { getPublicId } from "../helper";
import { Admin } from "../database/models/admin.model";
import { Temp } from "../database/models/temp.model";
import { auth } from "@clerk/nextjs/server";

export async function getReviews(productId:string,page:number,limit:number) {
    try {
        await dbConnect();
        const reviews = await Review.aggregate([
            {
                $match:{
                    product:new mongoose.Types.ObjectId(productId),
                }
            },
            {
                $lookup:{
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    pipeline:[
                        {
                            $project:{
                                firstName:1,
                                lastName:1,
                                photo:1,
                                clerkId:1
                            }
                        }
                    ]
                }
            },
            {
                $addFields:{
                    user:{
                        $arrayElemAt:['$user',0]
                    }
                }
            },
            {
                $project:{
                    user:1,
                    fakeName:1,
                    product:1,
                    rating:1,
                    comment:1,
                    image:1,
                    createdAt:1,
                }
            },
            {
                $sort:{
                    rating:-1
                }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            }
        ]);
        if (!reviews) {
            throw new Error("An error occurred while fetching reviews");
        }
        return JSON.parse(JSON.stringify(reviews));
    } catch (error) {
        console.log("error on get reviews", error)
        return null;
    }
}

export async function createReview(data:createReviewParams) {
    try {
        await dbConnect();
        
        if (data.fakeName) {
            const admin = await Admin.findOne({clerkId:data.clerkId}).select('_id');
            if (!admin) {
                throw new Error("unauthorized");
            }
        } 
        const user = await User.findOne({clerkId:data.clerkId}).select('clerkId _id photo firstName lastName');

        if (!user) {
            throw new Error("User not found");
        }
        const review = await Review.create({...data,user:user._id,product:new mongoose.Types.ObjectId(data.product)});
        if (!review) {
            throw new Error("An error occurred while creating review");
        }
        review.user = user;
        await Temp.findOneAndDelete({clerkId:data.clerkId,product:new mongoose.Types.ObjectId(data.product),tempType:'review'})
        return JSON.parse(JSON.stringify(review));
    } catch (error) {
        console.log("error on create review", error)
        return null;
    }
}

export async function changeReviewImage(id:string,image?:string) {
    try {
        await dbConnect();
        const { userId } = auth();
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const user = await User.findOne({clerkId:userId}).select('_id');
        if (!user) {
            throw new Error("User not found");
        }
        const review = await Review.findById(id);
        if (!review) {
            throw new Error("Review not found");
        }
        if (review.user.toString() !== user._id.toString()) {
            throw new Error("You are not authorized to change this review image");
        }
        if (review.image) {
            await deleteAsset(getPublicId({url:review.image}));
        }
        if (image) {
            review.image = image;
            await review.save();
        } else {
            await Review.findByIdAndUpdate(id,{
                $unset:{
                    image:""
                }
            });
        }
        return true;
    } catch (error) {
        console.log('error on change review image', error)
        return null;
    }
}


export async function updateReview(id:string,rating:number,comment:string,image?:string | null) {
    try {
        await dbConnect();
        const { userId } = auth();
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const user = await User.findOne({clerkId:userId}).select('_id');
        if (!user) {
            throw new Error("User not found");
        }
        const review = await Review.findById(id);
        if (!review) {
            throw new Error("Review not found");
        }
        if (review.user.toString() !== user._id.toString()) {
            throw new Error("You are not authorized to change this review image");
        }
        review.rating = rating;
        review.comment = comment;
        review.image = image || review.image;
        const updatedReview = await review.save();
        if (!updatedReview) {
            throw new Error("An error occurred while updating review");
        }
        return JSON.parse(JSON.stringify(updatedReview));
    } catch (error) {
        console.log("error on update review", error)
        return null;
    }
}

export async function deleteReview(reviewId:string,clerkId:string) {
    try {
        await dbConnect();
        const user = await User.findOne({clerkId});
        if (!user) {
            throw new Error("User not found");
        }
        const review = await Review.findById(reviewId);
        if (!review) {
            throw new Error("Review not found");
        }
        if (review.user.toString() !== user._id.toString()) {
            throw new Error("You are not authorized to delete this review");
        }
        if (review.image) {
            await deleteAsset(getPublicId({url:review.image}));
        }
        await Review.findByIdAndDelete(reviewId);
        return true;
    }
    catch (error) {
        console.log("error on delete review", error)
        return null;
    }
}

export async function deleteReviewByAdminId(reviewId:string,clerkId:string) {
    try {
        await dbConnect();
        const admin = await Admin.findOne({clerkId});
        if (!admin) {
            throw new Error("Admin not found");
        }
        const review = await Review.findById(reviewId);
        if (!review) {
            throw new Error("Review not found");
        }
        if (review.image) {
            await deleteAsset(getPublicId({url:review.image}));
        }
        await Review.findByIdAndDelete(reviewId);
        return true;
    } catch (error) {
        console.log("error on delete review by admin id", error)
        return null;
    }
}

export async function getAllReviews(page:number,limit:number) {
    try {
        await dbConnect();
        const reviews = await Review.aggregate([
            {
                $lookup:{
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    pipeline:[
                        {
                            $project:{
                                firstName:1,
                                lastName:1,
                                photo:1,
                                clerkId:1
                            }
                        }
                    ]
                }
            },
            {
                $addFields:{
                    user:{
                        $arrayElemAt:['$user',0]
                    }
                }
            },
            {
                $project:{
                    user:1,
                    fakeName:1,
                    rating:1,
                    comment:1,
                    product:1,
                    image:1,
                    createdAt:1,
                }
            },
            {
                $sort:{
                    createdAt:-1
                }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            }
        ]);
        if (!reviews) {
            throw new Error("An error occurred while fetching all reviews");
        }
        return JSON.parse(JSON.stringify(reviews));
    } catch (error) {
        console.log("error on get all reviews", error)
        return null;
    }
}

export async function isUserCreateReview(productId:string,clerkId:string) {
    try {
        await dbConnect();
        const user = await User.findOne({clerkId});
        if (!user) {
            throw new Error("User not found");
        }
        const review = await Review.findOne({user:user._id,product:new mongoose.Types.ObjectId(productId)});
        return review ? true : false;
    } catch (error) {
        console.log("error on is user create review", error)
        return true;
    }
}