const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let dealer_bills_Schema = new Schema(
  {
    dealer: { type: Schema.Types.ObjectId, ref: "Vendor", required: true},
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true}
      },
    ],
    total_price: { type: Number, required: true },
    delivery_date: { type: Date, required: true},
    payment_status: { type: Boolean, required: true, default: false},
    delivery_status: { type: Boolean, required: true, default: false},
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Dealer_bills = mongoose.model("dealer_bills", dealer_bills_Schema);
module.exports = Dealer_bills;