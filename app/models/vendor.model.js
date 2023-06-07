const mongoose = require("mongoose")
const Schema = mongoose.Schema;

let VendorSchema = new Schema({
    company_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true},
    gstNo: { type: String, required: true},
    role: { type: String, required: true, enum: ["vendor", "dealer" ] },
    isApproved: {type: String, required: true, enum : ["pending", "approved", "rejected"], default: "pending"}

}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});


const Vendor = mongoose.model("vendor", VendorSchema);
module.exports = Vendor;
