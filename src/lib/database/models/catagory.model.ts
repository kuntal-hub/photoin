import { Schema, model, models } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CatagorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: "text",
  },
  description: {
    type: String,
  },
  logo: {
    type: String,
  },
  banner: {
    type: String,
  },
  rank:{
    type: Number,
    default: 0,
  }
},{timestamps: true});

CatagorySchema.plugin(mongooseAggregatePaginate);

const Catagory = models?.Catagory || model("Catagory", CatagorySchema);

export { Catagory }