const mongoose = require("mongoose")
const Schema = mongoose.Schema;

let req_dealer_Schema = new Schema({
    product: {type: String, required: true},
    model_name: { type: String, required: true },
    quantity: { type: Number, required: true },
    color: { type: String, required: true },
    description: { type: String, required: true},
    status: { type: String, enum: ["approved", "rejected","pending", "onHold"], required: true, default: "pending"},
    dealer: { type: Schema.Types.ObjectId, ref: 'Vendor'}
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Req_Dealer = mongoose.model("Req_Dealer", req_dealer_Schema);
module.exports = Req_Dealer;