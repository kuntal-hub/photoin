'use server';
import dbConnect from "../database/connectDB"
import { deleteAsset, deleteAssets } from "./helper.action";
import { getPublicId } from "../helper";
import { Temp } from "../database/models/temp.model";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";

export async function addTemp(data:AddTempParams) {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const tempType = data.type ? data.type : "product"
        const tempExist = await Temp.findOne({clerkId:userId,product:new mongoose.Types.ObjectId(data.productId),tempType:tempType});
        if (tempExist) {
            if (tempExist.images[data.fieldName] && !Array.isArray(tempExist.images[data.fieldName])) {
                await deleteAsset(getPublicId({url:tempExist.images[data.fieldName]}));
            }
            const temp = await Temp.findByIdAndUpdate(tempExist._id,{
                images:{
                    ...tempExist.images,
                    [data.fieldName]:Array.isArray(tempExist.images[data.fieldName]) ? [...tempExist.images[data.fieldName],...data.value] : data.value
                }
            },{new:true});
            if (!temp) {
                throw new Error('Error Occurred on Updating Temp');
            }
            return JSON.parse(JSON.stringify(temp));
        } else {
            const temp = await Temp.create({
                clerkId:userId,
                product:data.productId,
                tempType:tempType,
                images:{
                    [data.fieldName]:data.value
                }
            });
            if (!temp) {
                throw new Error('Error Occurred on Adding to Temp');
            }
            return JSON.parse(JSON.stringify(temp));
        }
    } catch (error) {
        console.log("Error Occurred on Adding to Temp ", error);
        return null;
    }
}

export async function removeImgFromTemp(data:AddTempParams) {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const tempType = data.type ? data.type : "product"
        const tempExist = await Temp.findOne({clerkId:userId,product:new mongoose.Types.ObjectId(data.productId),tempType:tempType});
        if (tempExist) {
            const temp = await Temp.findByIdAndUpdate(tempExist._id,{
                images:{
                    ...tempExist.images,
                    [data.fieldName]: Array.isArray(tempExist.images[data.fieldName]) ? tempExist.images[data.fieldName].filter((img:string) => img !== data.value) : ""
                }
            },{new:true});
            if (!temp) {
                throw new Error('Error Occurred on Removing Image from Temp');
            }
            return JSON.parse(JSON.stringify(temp));
        }
        return null;
    } catch (error) {
        console.log("Error Occurred on Removing Image from Temp ", error);
        return null;
    }
}

export async function getTemp(productId:string,type?:"product"|"review") {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const tempType = type ? type : "product"
        const temp = await Temp.findOne({clerkId:userId,product:new mongoose.Types.ObjectId(productId),tempType:tempType});
        if (!temp) {
            return null;
        }
        return JSON.parse(JSON.stringify(temp));
    } catch (error) {
        console.log("Error Occurred on Getting Temp ", error);
        return null;
    }
}


export async function deleteTemp(productId:string,type?:"product"|"review") {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const tempType = type ? type : "product"
        const temp = await Temp.findOne({clerkId:userId,product:new mongoose.Types.ObjectId(productId),tempType:tempType});
        if (!temp) {
            return true;
        }
        if (temp.images) {
            const publicIds = [];
            for (const i in temp.images) {
                if (Array.isArray(temp.images[i])) {
                    temp.images[i].forEach((img: string) => {
                        publicIds.push(getPublicId({ url: img }));
                    });
                } else {
                    publicIds.push(getPublicId({ url: temp.images[i] }));
                }
            }
            await deleteAssets(publicIds);
        }
        await Temp.findByIdAndDelete(temp._id);
        return true;
    } catch (error) {
        console.log("Error Occurred on Deleting Temp ", error);
        return null;
    }
}


export async function deleteTempItem(tempId:string) {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const temp = await Temp.findById(tempId);
        if (!temp) {
            throw new Error("Temp Not Found");
        }
        if (temp.images) {
            const publicIds = [];
            for (const i in temp.images) {
                if (Array.isArray(temp.images[i])) {
                    temp.images[i].forEach((img: string) => {
                        publicIds.push(getPublicId({ url: img }));
                    });
                } else {
                    publicIds.push(getPublicId({ url: temp.images[i] }));
                }
            }
            await deleteAssets(publicIds);
        }
        await Temp.findByIdAndDelete(temp._id);
        return true;
    } catch (error) {
        console.log("Error Occurred on Deleting Temp item ", error);
        return null;
    }
}


export async function deleteALLTempCarts(tempIds:string[],publicIds:string[]) {
    try {
        await dbConnect();
        const {userId} = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        await deleteAssets(publicIds);
        const mongodbCartIds:any[] = [];
        tempIds.map((item,i)=>{
            mongodbCartIds.push(new mongoose.Types.ObjectId(item))
        })
        const result = await Temp.deleteMany({
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


export async function updateTempProductId(savedPID:string,newPID:string) {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const temp = await Temp.findOne({clerkId:userId,product:new mongoose.Types.ObjectId(savedPID),tempType:'product'});
        if (!temp) {
            throw new Error("Temp Not Found");
        }
        const updated = await Temp.findByIdAndUpdate(temp._id,{product:new mongoose.Types.ObjectId(newPID)});
        if (!updated) {
            throw new Error("Error Occurred on Updating Temp Product");
        }
        return true;
    } catch (error) {
        console.log("Error Occurred on Updating Temp Product ", error);
        return null;
    }
}


export async function getTempItems(days: number, page: number, limit: number) {
    try {
        await dbConnect();
        const today = new Date();
        const daysAgo = new Date(today);
        daysAgo.setDate(today.getDate() - days);

        const carts = await Temp.aggregate([
            {
                $match: {
                    updatedAt: {
                        $lte: daysAgo
                    },
                    tempType:'product'
                }
            },
            {
                $lookup:{
                    from:'users',
                    localField:'clerkId',
                    foreignField:'clerkId',
                    as:'buyer',
                    pipeline:[
                        {
                            $project:{
                                email:1,
                                firstName:1,
                                lastName:1,
                                clerkId:1,
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


export async function getTempReviews(days: number, page: number, limit: number) {
    try {
        await dbConnect();
        const today = new Date();
        const daysAgo = new Date(today);
        daysAgo.setDate(today.getDate() - days);

        const carts = await Temp.aggregate([
            {
                $match: {
                    updatedAt: {
                        $lte: daysAgo
                    },
                    tempType:'review'
                }
            },
            {
                $lookup:{
                    from:'users',
                    localField:'clerkId',
                    foreignField:'clerkId',
                    as:'user',
                    pipeline:[
                        {
                            $project:{
                                email:1,
                                firstName:1,
                                lastName:1,
                                clerkId:1,
                                photo:1
                            }
                        }
                    ]
                }
            },
            {
                $addFields:{
                    buyer:{
                        $arrayElemAt:['$user',0]
                    },
                    image:'$images.reviewImage'
                }
            },
            {
                $project:{
                    buyer:1,
                    image:1
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


export async function deleteTempReview(id:string,image:string) {
    try {
        await dbConnect();
        await deleteAsset(getPublicId({url:image}));
        const result = await Temp.findByIdAndDelete(id);
        if (!result) {
            throw new Error('Error Occurred on Deleting Temp Review');
        }
        return true;
    } catch (error) {
        console.log("Error Occurred on Deleting Temp Review ", error);
        return null;
    }
}