const mongoose = require("mongoose")
const Schema = mongoose.Schema;

let vendor_po_Schema = new Schema({
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    will_deliver_within: { type: String, required: true },
    po_copy: { type: [] },
    isApproved: { type: Boolean, required: true, default: false },
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor' },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Vendor_Po = mongoose.model("Vendor_Po", vendor_po_Schema);
module.exports = Vendor_Po;
