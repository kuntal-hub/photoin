import { Schema, model, models } from "mongoose";

const TempSchema = new Schema({
    clerkId:{
        type: String,
        required: true,
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    tempType:{
        type:String,
        enum:['product','review'],
        default: "product"
    },
    images:{ // in case of review field name is always reviewImage 
        type: Object,
        required: true,
    },
},{timestamps: true});

const Temp = models?.Temp || model("Temp", TempSchema);

export { Temp }