const mongoose = require("mongoose")
const Schema = mongoose.Schema;

let publish_Requirment_Schema = new Schema({
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true},
    closedOn: { type: Date, required: true},
    status: { type: String, enum: ["open", "closed"],  required: true, default: "open"}
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Publish_Requirment = mongoose.model("Publish_Requirment", publish_Requirment_Schema);
module.exports = Publish_Requirment;
