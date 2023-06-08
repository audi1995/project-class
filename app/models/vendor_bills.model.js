const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let vendor_bills_Schema = new Schema(
  {
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true},
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

const vendor_bills = mongoose.model("vendor_bills", vendor_bills_Schema);
module.exports = vendor_bills;