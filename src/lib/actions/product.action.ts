'use server'
import { Product } from "../database/models/product.model"
import { Search } from "../database/models/search.model";
import dbConnect from "../database/connectDB"
import mongoose from "mongoose";
import { deleteAsset, deleteAssets } from "./helper.action";
import { getPublicId } from "../helper";
import { User } from "../database/models/user.model";
import { Wishlist } from "../database/models/wishlist.model";
import { auth } from "@clerk/nextjs/server";

export async function createProduct(data: createProductParams) {
    try {
        await dbConnect();
        const existedQuiry = await Search.findOne({ query: data.name.trim().toLowerCase() }).select('_id');
        if (!existedQuiry) {
            await Search.create({ query: data.name.trim().toLowerCase() });
        }
        const result = await Product.create({
            ...data,
            catagory: new mongoose.Types.ObjectId(data.catagory)
        });
        if (!result) {
            throw new Error("Error on creating product")
        }
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.log("error on create product", error)
        return null;
    }
}

export async function updateProduct(id: string, data: createProductParams) {
    try {
        await dbConnect();
        const existedQuiry = await Search.findOne({ query: data.name.trim().toLowerCase() }).select('_id');
        if (!existedQuiry) {
            await Search.create({ query: data.name.trim().toLowerCase() });
        }
        const result = await Product.findByIdAndUpdate(id, {
            ...data,
            catagory: new mongoose.Types.ObjectId(data.catagory)
        }, { new: true });
        if (!result) {
            throw new Error("Error on updating product")
        }
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.log("error on update product", error)
        return null;
    }
}

export async function deleteProduct(id: string) {
    try {
        await dbConnect();
        const result = await Product.findById(id);
        if (!result) {
            throw new Error("Product not found")
        }
        const AllPublicIds: string[] = [];
        if (result.photos && Array.isArray(result.photos)) {
            for (let photo of result.photos) {
                AllPublicIds.push(getPublicId({ url: photo }));
            }
        }
        if (result.mainPhoto) {
            AllPublicIds.push(getPublicId({ url: result.mainPhoto }));
        }
        const deletedImages = await deleteAssets(AllPublicIds);
        if (!deletedImages) {
            throw new Error("Error on deleting images")
        }
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            throw new Error("Error on deleting product")
        }
        await Search.findOneAndDelete({ query: result.name.trim().toLowerCase() });
        return JSON.parse(JSON.stringify(deletedProduct));
    } catch (error) {
        console.log("error on delete product", error)
        return null;
    }
}

export async function getProduct(id: string, userId?: string | null) {
    try {
        await dbConnect();
        const result = await Product.findById(id);
        if (!result) {
            throw new Error("Product not found")
        }
        result.isAddedToWishlist = false;
        if (userId) {
            const user = await User.findOne({ clerkId: userId });
            if (!user) {
                result.isAddedToWishlist = false;
            } else {
                const wishlist = await Wishlist.findOne({
                    user: user._id,
                    product: new mongoose.Types.ObjectId(id),
                });
                if (wishlist) {
                    result.isAddedToWishlist = true;
                }
            }
        }
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.log("error on get product", error)
        return null;
    }
}

export async function chengeMainPhoto(id: string, photo: string) {
    try {
        await dbConnect();
        const product = await Product.findById(id);
        if (!product) {
            throw new Error("Product not found")
        }
        if (product.mainPhoto) {
            await deleteAsset(getPublicId({ url: product.mainPhoto }));
        }
        const result = await Product.findByIdAndUpdate(id, { mainPhoto: photo }, { new: true });
        if (!result) {
            throw new Error("Error on chenge main photo")
        }
        return JSON.parse(JSON.stringify(result));
    }
    catch (error) {
        console.log("error on chenge main photo", error)
        return null;
    }
}

export async function updatePhotos(id: string, photos: string[]) {
    try {
        await dbConnect();
        const product = await Product.findById(id).select('photos');
        if (!product) {
            throw new Error("Product not found")
        }
        const result = await Product.findByIdAndUpdate(id, {
            photos: [...product.photos, ...photos]
        }, { new: true });
        if (!result) {
            throw new Error("Error on update photos")
        }
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.log("error on update photos", error)
        return null;
    }
}

export async function deletePhoto(id: string, photo: string) {
    try {
        await dbConnect();
        const deletedImage = await deleteAsset(getPublicId({ url: photo }));
        if (!deletedImage) {
            throw new Error("Error on delete image")
        }
        const result = await Product.findByIdAndUpdate(id, { $pull: { photos: photo } }, { new: true });
        if (!result) {
            throw new Error("Error on delete photo")
        }
        return JSON.parse(JSON.stringify(result));
    }
    catch (error) {
        console.log("error on delete photo", error)
        return null;
    }
}

export async function updateFeatures(id: string, features: string[]) {
    try {
        await dbConnect();
        const result = await Product.findByIdAndUpdate(id, {
            features: features
        }, { new: true });
        if (!result) {
            throw new Error("Error on update features")
        }
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.log("error on update features", error)
        return null;
    }
}

export async function updateForms(id: string, forms: Form[]) {
    try {
        await dbConnect();
        const result = await Product.findByIdAndUpdate(id, {
            forms: forms
        }, { new: true });
        if (!result) {
            throw new Error("Error on update forms")
        }
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.log("error on update forms", error)
        return null;
    }
}

export async function getProducts(page: number, limit: number, mainPhotoExist: boolean = true) {
    try {
        await dbConnect();
        const result = await Product.aggregate([
            {
                $match: {
                    mainPhoto: { $exists: mainPhotoExist }
                }
            },
            {
                $project: {
                    name: 1,
                    mainPhoto: 1,
                    maxPrice: 1,
                    discountedPrice: 1,
                    badge: 1,
                    rank: 1,
                }
            },
            {
                $sort: { rank: 1 }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            }
        ])
        if (!result) {
            throw new Error("Error on getting products")
        }
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.log("error on get products", error)
        return null;
    }
}

export async function getProductsPageData(id: string) {
    try {
        await dbConnect();
        const product = await Product.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                    mainPhoto: { $exists: true }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'catagory',
                    foreignField: 'catagory',
                    as: 'similarProducts',
                    pipeline: [
                        {
                            $match: {
                                mainPhoto: { $exists: true }
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                mainPhoto: 1,
                                maxPrice: 1,
                                discountedPrice: 1,
                                badge: 1,
                                rank: 1,
                            }
                        },
                        {
                            $sort: { rank: 1 }
                        },
                        {
                            $limit: 20
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'product',
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    rating: { $avg: '$reviews.rating' },
                    reviewCount: { $size: '$reviews' },
                    "star5": { $size: { $filter: { input: '$reviews', as: 'review', cond: { $eq: ['$$review.rating', 5] } } } },
                    "star4": { $size: { $filter: { input: '$reviews', as: 'review', cond: { $eq: ['$$review.rating', 4] } } } },
                    "star3": { $size: { $filter: { input: '$reviews', as: 'review', cond: { $eq: ['$$review.rating', 3] } } } },
                    "star2": { $size: { $filter: { input: '$reviews', as: 'review', cond: { $eq: ['$$review.rating', 2] } } } },
                    "star1": { $size: { $filter: { input: '$reviews', as: 'review', cond: { $eq: ['$$review.rating', 1] } } } },
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    mainPhoto: 1,
                    photos: 1,
                    maxPrice: 1,
                    discountedPrice: 1,
                    badge: 1,
                    minDeliveryDays: 1,
                    maxDeliveryDays: 1,
                    features: 1,
                    rating: 1,
                    "star5": 1,
                    "star4": 1,
                    "star3": 1,
                    "star2": 1,
                    "star1": 1,
                    reviewCount: 1,
                    similarProducts: 1
                }
            }
        ])
        if (!product || product.length === 0) {
            throw new Error("Error on getting products page data")
        }
        return JSON.parse(JSON.stringify(product[0]));
    } catch (error) {
        console.log("error on get products page data", error)
        return null;
    }
}

export async function getProductForCustomization(productId: string) {
    try {
        await dbConnect()
        const { userId } = auth();
        if (!userId) {
            throw new Error("User not found")
        }
        const user = await User.findOne({ clerkId: userId }).select('_id')
        if (!user) {
            throw new Error("User not found")
        }
        const product = await Product.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(productId),
                    mainPhoto: { $exists: true }
                }
            },
            {
                $lookup: {
                    from: 'carts',
                    localField: '_id',
                    foreignField: 'product',
                    as: 'cart',
                    pipeline: [
                        {
                            $match: {
                                buyer: user._id
                            }
                        },
                        {
                            $project: {
                                product: 0,
                                buyer: 0,
                                createdAt: 0,
                                updatedAt: 0,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'wishlists',
                    localField: '_id',
                    foreignField: 'product',
                    as: 'wishlist',
                    pipeline: [
                        {
                            $match: {
                                user: user._id
                            }
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    isAddedToWishlist: { $gt: [{ $size: '$wishlist' }, 0] },
                    cart: { $arrayElemAt: ['$cart', 0] },
                }
            },
            {
                $addFields: {
                    quantity: '$cart.quantity',
                }
            },
            {
                $addFields: {
                    quantity: { $ifNull: ['$quantity', 1] }
                }
            },
            {
                $project: {
                    wishlist: 0
                }
            }
        ])
        if (!product || product.length === 0) {
            throw new Error("Error on getting product for customization")
        }
        return JSON.parse(JSON.stringify(product[0]));
    } catch (error) {
        console.log("error on get product for customization", error)
        return null;
    }
}


export async function deleteMainPhoto(productId: string) {
    try {
        await dbConnect();
        const product = await Product.findById(productId).select('mainPhoto');
        if (!product) {
            throw new Error("Product not found")
        }
        await deleteAsset(getPublicId({ url: product.mainPhoto }));
        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            $unset: {
                mainPhoto: ""
            }
        }, { new: true })
        if (!updatedProduct) {
            throw new Error("Error on delete main photo")
        }
        return true;
    } catch (error) {
        console.log("error on delete main photo", error)
        return null;
    }
}

export async function getHiddenProducts() {
    try {
        await dbConnect();
        const result = await Product.aggregate([
            {
                $match: {
                    mainPhoto: { $exists: false }
                }
            },
            {
                $addFields: {
                    photo: { $arrayElemAt: ['$photos', 0] }
                }
            },
            {
                $match: {
                    $or: [
                        {
                            photo: { $exists: true }
                        },
                        {
                            photo: { $ne: null }
                        },
                        {
                            photo: { $ne: "" }
                        },
                        {
                            photo: { $ne: undefined }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'product',
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    rating: { $avg: '$reviews.rating' },
                    reviewCount: { $size: '$reviews' },
                    "star5": { $size: { $filter: { input: '$reviews', as: 'review', cond: { $eq: ['$$review.rating', 5] } } } },
                    "star4": { $size: { $filter: { input: '$reviews', as: 'review', cond: { $eq: ['$$review.rating', 4] } } } },
                    "star3": { $size: { $filter: { input: '$reviews', as: 'review', cond: { $eq: ['$$review.rating', 3] } } } },
                    "star2": { $size: { $filter: { input: '$reviews', as: 'review', cond: { $eq: ['$$review.rating', 2] } } } },
                    "star1": { $size: { $filter: { input: '$reviews', as: 'review', cond: { $eq: ['$$review.rating', 1] } } } },
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    maxPrice: 1,
                    discountedPrice: 1,
                    badge: 1,
                    photo: 1,
                    minDeliveryDays: 1,
                    maxDeliveryDays: 1,
                    features: 1,
                    rating: 1,
                    "star5": 1,
                    "star4": 1,
                    "star3": 1,
                    "star2": 1,
                    "star1": 1,
                    reviewCount: 1,
                }
            }
        ]);
        if (!result || result.length === 0) {
            throw new Error("Error on getting hidden products")
        }
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.log("error on get hidden products", error)
        return null;
    }
}