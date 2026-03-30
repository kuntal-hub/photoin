import { Schema, model, models } from "mongoose";

const WishlistSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
},{timestamps:true});

const Wishlist = models?.Wishlist || model("Wishlist", WishlistSchema);

export { Wishlist };