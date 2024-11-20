'use server'
import { Product } from "../database/models/product.model"
import { Search } from "../database/models/search.model";
import { Catagory } from "../database/models/catagory.model";
import dbConnect from "../database/connectDB"

export async function getSearchSuggestions(query:string) {
    try {
        await dbConnect();
        const search = await Search.aggregate([
            {
                $match: {
                    $text: {
                        $search: query,
                    },
                },
            },
            {
                $addFields: {
                    "score": { "$meta": "textScore" }
                }
            },
            {
                $sort: { score: -1 },
            },
            {
                $project: {
                    query: 1
                },
            },
            {
                $limit: 10,
            },
        ])
    
        if (!search) {
            throw new Error("An error occurred while fetching search suggestions");
        }
        return JSON.parse(JSON.stringify(search));
    } catch (error) {
        console.log("error on get search suggestions", error)
        return null;
    }
}

export async function searchProducts(query:string) {
    try {
        await dbConnect();
        const result1 = await Catagory.aggregate([
            {
                $match: {
                    $text: {
                        $search: query,
                    },
                },
            },
            {
                $addFields: {
                    "score": { "$meta": "textScore" }
                }
            },
            {
                $sort: { score: -1 },
            },
            {
                $lookup:{
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
                    ]
                }
            },
            {
                $unwind: "$products"
            },
            {
                $replaceRoot: { newRoot: "$products" }
            },
            {
                $project: {
                    name: 1,
                    mainPhoto: 1,
                    maxPrice: 1,
                    discountedPrice: 1,
                    badge: 1,
                },
            },
            {
                $limit: 30,
            }
        ]);

        if (result1.length > 15) {
            return JSON.parse(JSON.stringify(result1));
        }

        const result2 = await Product.aggregate([
            {
                $match: {
                    mainPhoto: { $exists: true},
                    $text: {
                        $search: query,
                    },
                },
            },
            {
                $addFields: {
                    "score": { "$meta": "textScore" }
                }
            },
            {
                $sort: { score: -1 },
            },
            {
                $project: {
                    name: 1,
                    mainPhoto: 1,
                    maxPrice: 1,
                    discountedPrice: 1,
                    badge: 1,
                },
            },
            {
                $limit: 20,
            },
        ]);
        return JSON.parse(JSON.stringify([...result1, ...result2]));
    } catch (error) {
        console.log("error on search products", error)
        return null;
    }
}