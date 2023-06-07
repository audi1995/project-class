const { Req_Dealer } = require('../models/index.model')

exports.create = async (req, res) => {
    try {
        let result = req.userdata;
        if (result.role !== "dealer") {
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
        let result = req.userdata;
        if (result.role == "admin" || result.role == "dealer") {
            await Req_Dealer.find().then((docs) => {
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
            await Req_Dealer.findById({ _id: req.params.id }).then((docs) => {
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
        res.status(500).json({
            message: err.message,
            status: false
        })
    }
}


exports.update = async (req, res) => {
    try {
        if (req.userdata.role == "dealer" && req.userdata.id == req.body.dealer) {
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
    if (req.userdata.role != "dealer" && req.userdata.id == req.body.dealer) {
        res.status(401).json({
            message: "You are not allowed to delete dealer requirment",
            status: false
        })
    }
    else {
        await Req_Dealer.deleteOne({ _id: req.params.id }).then((docs) => {
            res.status(200).json({
                message: "dealer requirment deleted successfully",
                status: true,
                data: {}
            })
        }
        ).catch((err) => {
            res.status(422).json({
                message: err.message,
                status: false
            })
        }
        )
    }
}