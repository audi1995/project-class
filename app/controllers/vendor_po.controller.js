const { Vendor_Po, Vendor } = require('../models/index.model')
const emailSender = require('../helpers/nodemailer');

exports.create = async (req, res) => {
    try {
        if (req.userdata.role !== "vendor") {
            res.status(401).json(result);
        } else {
            await Vendor_Po(req.body)
                .save()
                .then((docs) => {
                    res.status(201).json({
                        message: "vendor_po created successfully",
                        status: true,
                        data: docs
                    })
                })
                .catch((err) => {
                    res.status(422).json({
                        mesaage: err.message,
                        status: false
                    })
                });
        }
    }
    catch (err) {
        res.status(500).json(err)
    }


}

exports.index = async (req, res) => {
    try {
        if (req.userdata.role == "admin" || req.userdata.role == "vendor") {
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit) : 5;
            let skip = page > 1 ? (page - 1) * limit : 0;

            await Vendor_Po.find().skip(skip).limit(limit).then((docs) => {
                res.status(200).json({
                    message: "Vendor_Po retrieved successfully",
                    data: docs,
                    status: true
                })
            }).catch((err) => {
                res.status(422).json({
                    message: err.message,
                    status: false
                })
            })
        } else {
            res.status(401).json({
                message: err.message,
                status: false
            })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.show = async (req, res) => {
    try {
        if (req.userdata.role == "vendor") {

            await Vendor_Po.findById({ _id: req.params.id }).then((docs) => {
                res.status(200).json({
                    message: "po retrieved successfully",
                    data: docs,
                    status: true
                })
            }).catch((err) => {
                res.status(422).json({
                    message: err.message,
                    status: false
                })
            })
        } else {
            res.status(422).json({
                message: "err.message",
                status: false
            })

        }
    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: false
        })
    }
}

exports.update = async (req, res) => {
    try {
        let vendor_po = await Vendor_Po.findOne({ _id: req.params.id });
        console.log(vendor_po.vendor);
        let vendor = await Vendor.findOne({_id: vendor_po.vendor})
        console.log(vendor);
        if (req.userdata.role === "vendor" && req.userdata.id === vendor_po.vendor.id) {
            let object = {};
            if (req.body.product && req.body.product !== "") {
                object.product = req.body.product;
            }
            if (req.body.quantity && req.body.quantity !== "") {
                object.quantity = req.body.quantity;
            }
            if (req.body.description && req.body.description !== "") {
                object.description = req.body.description;
            }
            if (req.body.price && req.body.price !== "") {
                object.price = req.body.price;
            }
            if (req.body.will_deliver_within && req.body.will_deliver_within !== "") {
                object.will_deliver_within = req.body.will_deliver_within;
            }
            const updatedProduct = await Vendor_Po.findByIdAndUpdate(
                req.params.id,
                { $set: object },
                { new: true }
            );

            if (updatedProduct) {
                res.status(200).json({
                    message: "PO updated successfully",
                    status: true,
                    data: updatedProduct
                });
            } else {
                res.status(404).json({
                    message: "PO not found",
                    status: false
                });
            }
        } else if (req.userdata.role === "admin") {
            let object = {};
            if (req.body.isApproved && req.body.isApproved !== "") {
                object.isApproved = req.body.isApproved;
            }
            const updatedProduct = await Vendor_Po.findByIdAndUpdate(
                req.params.id,
                { $set: object },
                { new: true }
            );

            if (updatedProduct) {
                emailSender.sendEmail(vendor.email, `Approved your po`, `Hello, ${vendor.company_name} your po has been approved`)
                res.status(200).json({
                    message: "PO updated successfully",
                    status: true,
                    data: updatedProduct
                });
            } else {
                res.status(404).json({
                    message: "PO not found",
                    status: false
                });
            }
        } else {
            res.status(401).json({
                message: "Only admin or vendor can update PO",
                status: false
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            status: false
        });
    }
};


exports.destroy = async (req, res) => {
    try {
        let vendor_po = await Vendor_Po.findOne({ _id: req.params.id });
        if (req.userdata.role === "vendor" && req.userdata.id === vendor_po.vendor.id) {
            await Vendor_Po.deleteOne({ _id: req.params.id })
                .then((docs) => {
                    res.status(200).json({
                        message: "PO deleted successfully",
                        status: true,
                        data: {}
                    });
                })
                .catch((err) => {
                    res.status(422).json({
                        message: err.message,
                        status: false
                    });
                });
        } else {
            res.status(422).json({
                message: "Unauthorized access: Only the vendor who created the PO can delete it",
                status: false
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            status: false
        });
    }
};




