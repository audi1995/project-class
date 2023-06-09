const { Req_Dealer, Vendor } = require('../models/index.model')
const emailSender = require('../helpers/nodemailer');

exports.create = async (req, res) => {
    try {
        if (req.userdata.role !== "dealer") {
            res.status(401).json(result);
        } else {
            await Req_Dealer(req.body)
                .save()
                .then((docs) => {
                    res.status(201).json({
                        message: "dealer requirment created successfully",
                        status: true,
                        data: docs
                    })
                })
                .catch((err) => {
                    res.status(401).json({
                        mesaage: err.message,
                        status: false
                    })
                });
        }
    }
    catch (err) {
        res.status(422).json(err)
    }
}

exports.index = async (req, res) => {
    try {
        if (req.userdata.role == "admin") {
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit) : 5;
            let skip = page > 1 ? (page - 1) * limit : 0;
            await Req_Dealer.find().skip(skip).limit(limit).then((docs) => {
                res.status(200).json({
                    message: "dealer requirment retrieved successfully",
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
            res.status(500).json({
                message: err.message,
                status: false
            })
        }
    } catch (err) {
        res.status(422).json(err)
    }
}


exports.show = async (req, res) => {
    try {
        if (req.userdata.role == "dealer") {
            let requir = await Req_Dealer.findById({ _id: req.params.id })
            console.log(requir.dealer);
            console.log(req.userdata.id, "req.userdata.id");
            if (req.userdata.id == requir.dealer) {
                res.status(200).json({
                    message: "requirement retrievevd successfully",
                    status: true,
                    data: requir
                })
            } else {
                res.status(401).json({
                    message: "unauthorised dealer",
                    status: false
                })
            }
        }
        else {
            res.status(500).json({
                message: err.message,
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
        let rex = await Req_Dealer.findOne({_id: req.params.id})
        let dealer = await Vendor.findOne({_id: rex.dealer})
        if (req.userdata.role == "dealer" && req.userdata.id == rex.dealer) {
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
            if (req.body.model_name && req.body.model_name !== "") {
                object.model_name = req.body.model_name;
            }
            if (req.body.color && req.body.color !== "") {
                object.color = req.body.color;
            }
            const updatedrequest = await Req_Dealer.findByIdAndUpdate(
                req.params.id,
                { $set: object },
                { new: true }
            );

            if (updatedrequest) {
                res.status(200).json({
                    message: "dealer requirment updated successfully",
                    status: true,
                    data: updatedrequest
                });
            } else {
                res.status(404).json({
                    message: "dealer requirment not found",
                    status: false
                });
            }
        } else if (req.userdata.role === "admin") {
            let object = {};
            if (req.body.status && req.body.status !== "") {
                object.status = req.body.status;
            }

            const updatedrequest = await Req_Dealer.findByIdAndUpdate(
                req.params.id,
                { $set: object },
                { new: true }
            );

            if (updatedrequest) {
                emailSender.sendEmail(dealer.email, `Approved your required`, `Hello, ${dealer.company_name} your po has been approved`)
                res.status(200).json({
                    message: "dealer requirment updated successfully",
                    status: true,
                    data: updatedrequest
                });
            } else {
                res.status(404).json({
                    message: "dealer requirment not found",
                    status: false
                });
            }
        } else {
            res.status(401).json({
                message: "Only admin or dealer can update dealer requirment",
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
        let rex = await Req_Dealer.findOne({ _id: req.params.id });

        if (req.userdata.role !== "dealer" || req.userdata.id !== rex.dealer) {
            res.status(401).json({
                message: "You are not allowed to delete dealer requirement",
                status: false
            });
            return;
        }

        await Req_Dealer.deleteOne({ _id: req.params.id }).then((docs) => {
            res.status(200).json({
                message: "Dealer requirement deleted successfully",
                status: true,
                data: {}
            });
        }).catch((err) => {
            res.status(422).json({
                message: err.message,
                status: false
            });
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            status: false
        });
    }
};
