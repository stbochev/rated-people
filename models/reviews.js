const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema ({
    text: String,
    reliability: { type: Number, min: 0, max: 5 },
    courtesy: { type: Number, min: 0, max: 5 },
    tidiness: { type: Number, min: 0, max: 5 },
    workmanship: { type: Number, min: 0, max: 5 },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model("Review", reviewSchema)