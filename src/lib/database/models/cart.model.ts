import { Schema, model, models } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const FormDataSchema = new Schema({
    data:{
        type:Object
    },
    images:{
        type:Object
    }
})

const CartSchema = new Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    formData: FormDataSchema,
    processedImage:{
        type:String
    },
    quantity: {
        type: Number,
        default: 1,
    },
}, { timestamps: true });

CartSchema.plugin(mongooseAggregatePaginate);

const Cart = models?.Cart || model("Cart", CartSchema);

export { Cart }