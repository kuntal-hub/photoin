import { Schema, model, models } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const ProductSchema = new Schema({
  product:{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  formData: {
    type: Object
  },
  processedImage: {
    type: String
  },
});

const OrderSchema = new Schema({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [ProductSchema],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  deliveryAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ['ordered', 'shipped','outOfDelivery', 'delivered'],
    default: 'ordered',
  },
}, { timestamps: true });

OrderSchema.plugin(mongooseAggregatePaginate);

const Order = models?.Order || model("Order", OrderSchema);

export { Order }