const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let user_order_Schema = new Schema(
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
    delivery_address: { type: String, required: true},
    payment_status: { type: Boolean, required: true},
    payment_method: { type: String}
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const User_order = mongoose.model("User_order", user_order_Schema);
module.exports = User_order;
