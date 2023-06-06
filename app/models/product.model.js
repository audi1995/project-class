const mongoose = require("mongoose")
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
    sku_product_id: {type: String, required: true},
    model_name: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true},
    photos: { type: []}
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
