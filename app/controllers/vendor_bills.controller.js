const { vendor_bills, Vendor_Po } = require('../models/index.model')
const{createInvoice}= require("../helpers/invoice")

exports.create = async (req, res) => {
    try {
        if (req.userdata.role !== "admin") {
            res.status(401).json({
                message: "only admin can create vendors bill",
                status: false
            })
        } else {
            let invoice = await createInvoice();
            await vendor_bills(req.body)
                .save()
                .then((docs) => {
                    res.status(201).json({
                        message: "bill created successfully",
                        status: true,
                        data: docs,
                    });
                })
                .catch((err) => {
                    res.status(422).json({
                        message: err.message,
                        status: false,
                    });
                });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.index = async (req, res) => {
    try {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit) : 5;
        let skip = page > 1 ? (page - 1) * limit : 0;
        const bills = await vendor_bills.find().skip(skip).limit(limit);
        if (!bills || bills.length === 0) {
            res.status(404).json({
                message: "No bills found",
                status: false,
            });
            return;
        }

        let vendor_po_ids = bills.map((bill) => bill.vendor_po);
        let pos = await Vendor_Po.find({ _id: { $in: vendor_po_ids } });

        if (req.userdata.role !== "admin" || req.userdata.id !== pos[0].vendor) {
            res.status(401).json({
                message: "Invalid vendor",
                status: false,
            });
            return;
        }

        res.status(200).json({
            message: "Bills retrieved successfully",
            status: true,
            data: bills,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: false,
        });
    }
};


exports.show = async (req, res) => {
    try {
        if (req.userdata.role !== "vendor") {
            res.status(401).json({
                message: "invalid vendor",
                status: false
            })
        } else {

            const bill = await vendor_bills.findById(req.params.id);
            console.log(bill);
            if (!bill) {
                res.status(404).json({
                    message: "bill not found",
                    status: false,
                });
            } else {
                res.status(200).json({
                    message: "bill retrieved successfully",
                    status: true,
                    data: bill,
                });
            }
        }
    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: false,
        });
    }
};


exports.update = async (req, res) => {
    try {
        if (req.userdata.role === "admin") {
            let object = {};

            if (req.body.products && req.body.products !== "") {
                object.products = req.body.products;
            }
            if (req.body.total_price && req.body.total_price !== "") {
                object.total_price = req.body.total_price;
            }
            if (req.body.delivery_date && req.body.delivery_date !== "") {
                object.delivery_date = req.body.delivery_date;
            }
            if (req.body.payment_status && req.body.payment_status !== "") {
                object.payment_status = req.body.payment_status;
            }
            if (req.body.delivery_status && req.body.delivery_status !== "") {
                object.delivery_status = req.body.delivery_status;
            }
            const updatedCart = await vendor_bills.findByIdAndUpdate(
                req.params.id,
                { $set: object },
                { new: true }
            );

            if (updatedCart) {
                res.status(200).json({
                    message: "bill updated successfully",
                    status: true,
                    data: updatedCart,
                });
            } else {
                res.status(404).json({
                    message: "bill not found",
                    status: false,
                });
            }
        } else {
            res.status(401).json({
                message: "Unauthorized user",
                status: false,
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            status: false,
        });
    }
};


exports.destroy = async (req, res) => {
    try {
        if (req.userdata.role !== "admin") {
            res.status(401).json({
                message: "You are not allowed to delete bill",
                status: false
            });
        } else {
            await vendor_bills.deleteOne({ _id: req.params.id })
                .then(() => {
                    res.status(200).json({
                        message: "bill deleted successfully",
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
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            status: false
        });
    }
};
