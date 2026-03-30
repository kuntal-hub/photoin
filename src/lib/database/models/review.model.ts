import { Schema, model, models } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const reviewSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fakeName:{
            type: String,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        }

    }, { timestamps: true });

reviewSchema.plugin(mongooseAggregatePaginate);

const Review = models?.Review || model("Review", reviewSchema);

export { Review };

