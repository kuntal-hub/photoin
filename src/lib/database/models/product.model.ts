import { Schema, model, models } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const FormSchema = new Schema({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'number', 'email', 'date', 'time', 'select', 'radio', 'checkbox', 'url', 'textarea', 'image', 'images'],
    required: true,
  },
  isRequired: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
  },
  selectValues: [
    {
      type: String,
    }
  ],
  radioOptions: [
    {
      type: String,
    }
  ],
  maxLength :{
    type: Number,
  },
  minLength:{
    type: Number,
  },
});

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: "text",
  },
  description: {
    type: String,
  },
  maxPrice: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
  },
  mainPhoto: {
    type: String
  },
  photos: [
    {
      type: String,
    }
  ],
  badge: {
    type: String,
  },
  rank:{
    type: Number,
    default: 0,
  },
  catagory: {
    type: Schema.Types.ObjectId,
    ref: 'Catagory',
  },
  features: [
    {
      type: String,
    }
  ],
  minDeliveryDays: {
    type: Number,
    default: 7,
  },
  maxDeliveryDays: {
    type: Number,
    default: 14,
  },
  designId: {
    type: String,
  },
  forms: [FormSchema],

}, { timestamps: true });

ProductSchema.plugin(mongooseAggregatePaginate);

const Product = models?.Product || model("Product", ProductSchema);

export { Product }