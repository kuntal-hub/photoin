import { Schema, model, models } from "mongoose";

const SearchSchema = new Schema({
    query:{
        type: String,
        required: true,
        index:"text",
        trim: true,
    },
    searchTimes:{
        type: Number,
        default: 1,
    },
});

const Search = models?.Search || model("Search", SearchSchema);

export { Search }