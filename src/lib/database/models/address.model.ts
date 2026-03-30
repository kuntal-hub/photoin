import { Schema, model, models } from "mongoose";

const AddressSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    pinCode: {
        type: String,
        required: true,
    },
    locality: { // village, town, city
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    landmark: {
        type: String,
    },
    district:{
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
});

const Address = models?.Address || model("Address", AddressSchema);

export { Address }