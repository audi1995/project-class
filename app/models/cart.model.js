const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true}
      },
    ],
    total_price: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
