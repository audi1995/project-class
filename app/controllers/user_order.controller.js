const { User_order } = require('../models/index.model')
const{createInvoice}= require("../helpers/invoice")
const emailSender = require('../helpers/nodemailer');


exports.create = async (req, res) => {
    try {
        if (req.userdata.id !== req.body.user) {
            res.status(100).json({
                message: "invalid user",
                status: false
            })
        } else {
            let invoice = await createInvoice();
            emailSender.sendEmail(req.userdata.email, `Greetings from our company`, `Hello, ${req.userdata.name} order has been submitted successfully.`,)
            await User_order(req.body)
                .save()
                .then((docs) => {
                    res.status(201).json({
                        message: "order created successfully",
                        status: true,
                        data: docs,
                    });
                })
                .catch((err) => {
                    res.status(401).json({
                        message: err.message,
                        status: false,
                    });
                });
        }
    } catch (err) {
        res.status(422).json(err);
    }
};
 


exports.show = async (req, res) => {
    try {
        if (req.userdata.id !== req.body.user) {
            res.status(100).json({
                message: "invalid user",
                status: false
            })
        } else {

        const bill = await User_order.findById(req.params.id);
        if (!bill) {
            res.status(404).json({
                message: "order not found",
                status: false,
            });
        } else {
            res.status(200).json({
                message: "order retrieved successfully",
                status: true,
                data: bill,
            });
        }
    } }catch (err) {
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

            const updatedCart = await User_order.findByIdAndUpdate(
                req.params.id,
                { $set: object },
                { new: true }
            );

            if (updatedCart) {
                res.status(200).json({
                    message: "order updated successfully",
                    status: true,
                    data: updatedCart,
                });
            } else {
                res.status(404).json({
                    message: "order not found",
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
                message: "You are not allowed to delete order",
                status: false
            });
        } else {
            await User_order.deleteOne({ _id: req.params.id })
                .then(() => {
                    res.status(200).json({
                        message: "order deleted successfully",
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
