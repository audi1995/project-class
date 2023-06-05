const mongoose = require("mongoose")
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
    sku_product_no: {type: String, required: true},
    model_name: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true},
    photos: { type: []}

}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});


const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
