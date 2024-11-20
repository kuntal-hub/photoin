'use server'
import { Catagory } from "../database/models/catagory.model"
import { Product } from "../database/models/product.model";
import dbConnect from "../database/connectDB"
import { deleteAsset } from "./helper.action";
import { getPublicId } from "../helper";
import mongoose from "mongoose";
import { Search } from "../database/models/search.model";

export async function createCategory(data: createCategoryParams) {
    try {
        await dbConnect();
        const existedQuiry = await Search.findOne({ query: data.name.trim().toLowerCase() }).select('_id');
        if (!existedQuiry){
            await Search.create({ query: data.name.trim().toLowerCase() });
        }
        const result = await Catagory.create({
            name: data.name.trim(),
            description: data.description,
        });
        if (!result) {
            throw new Error("Error on creating category")
        }
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.log("error on create catagory", error)
        return null;
    }
}

export async function updateCategory(id: string, data: updateCategoryParams) {
    try {
        await dbConnect();
        if (data.logo || data.banner) {
            const catagory = await Catagory.findById(id).select('logo banner');
            if (!catagory) {
                throw new Error("Category not found");
            }
            if (data.logo && catagory.logo) {
                await deleteAsset(getPublicId({url:catagory.logo}));
            }
            if (data.banner && catagory.banner) {
                await deleteAsset(getPublicId({url:catagory.banner})); 
            }
        }
        const result = await Catagory.findByIdAndUpdate(id, data,{new:true});
        if (!result) {
            throw new Error("Error on updating category")
        }
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.log("error on update catagory", error)
        return null;
    }
}

export async function deleteCategory(id: string) {
    try {
        await dbConnect();
        const products = await Product.find({catagory:new mongoose.Types.ObjectId(id)}).select('_id');
        if (products.length > 0) {
            throw new Error("Category has products");
        }
        const category = await Catagory.findById(id).select('logo banner');
        if (!category) {
            throw new Error("Category not found");
        }
        if (category.logo) {
            await deleteAsset(getPublicId({url:category.logo}));
        }
        if (category.banner) {
            await deleteAsset(getPublicId({url:category.banner}));
        }
        const result = await Catagory.findByIdAndDelete(id);
        if (!result) {
            throw new Error("Error on deleting category")
        }
        await Search.findOneAndDelete({query:category.name.trim().toLowerCase()});
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.log("error on delete catagory", error)
        return null;
    }
}

export async function getCategory(id: string) {
    try {
        await dbConnect();
        const result = await Catagory.findById(id);
        if (!result) {
            throw new Error("Error on getting category")
        }
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.log("error on get catagory", error)
        return null;
    }
}

export async function getCategoriesName() {
    try {
        await dbConnect();
        const result = await Catagory.find({}).select('name _id');
        if (!result) {
            throw new Error("Error on getting categories name")
        }
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.log("error on get categories name", error)
        return null;
    }
}

export async function getCategoriesWithProducts() {
    try {
        await dbConnect();
        const result = await Catagory.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "catagory",
                    as: "products",
                    pipeline:[
                        {
                            $match:{
                                mainPhoto:{$exists:true}
                            }
                        },
                        {
                            $project:{
                                name:1,
                                mainPhoto:1,
                                maxPrice:1,
                                discountedPrice:1,
                                badge:1,
                                rank:1,
                            }
                        },
                        {
                            $sort:{
                                rank:1
                            }
                        },
                        {
                            $limit:30
                        }
                    ]
                }
            },
            {
                $project:{
                    name:1,
                    logo:1,
                    banner:1,
                    rank:1,
                    products:1,
                }
            },
            {
                $sort:{
                    rank:1
                }
            },
            {
                $limit:30
            }
        ]);
        if (!result) {
            throw new Error("Error on getting categories with products")
        }
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.log("error on get categories with products", error)
        return null;
    }
}

export async function getCategories() {
    try {
        await dbConnect();
        const result = await Catagory.find({});
        if (!result) {
            throw new Error("Error on getting categories")
        }
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.log("error on get categories", error)
        return null;
    }
}