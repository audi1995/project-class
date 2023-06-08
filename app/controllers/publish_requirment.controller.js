const { Publish_Requirment } = require('../models/index.model')

exports.create = async (req, res) => {
    try {
        let result = req.userdata;
        if (req.userdata.role !== "admin") {
            res.status(401).json(result);
        } else {
            await Publish_Requirment(req.body)
                .save()
                .then((docs) => {
                    res.status(201).json({
                        message: "requirment created successfully",
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
        console.log("bhfv", result);
        if (result.role == "admin" || result.role == "vendor") {
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit) : 5;
            let skip = page > 1 ? (page - 1) * limit : 0;

            await Publish_Requirment.find().skip(skip).limit(limit).then((docs) => {
                res.status(200).json({
                    message: "requirment retrieved successfully",
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
        if (req.userdata.role == "admin" || req.userdata.role == "vendor") {
            await Publish_Requirment.findById({ _id: req.params.id }).then((docs) => {
                res.status(200).json({
                    message: "requirment retrieved successfully",
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
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
            status: false
        })
    }
}


exports.update = async (req, res) => {
    try {
        let result = req.userdata;

        if (result.role === "admin") {
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
            if (req.body.closedOn && req.body.closedOn !== "") {
                object.closedOn = req.body.closedOn;
            }
            if (req.body.status && req.body.status !== "") {
                object.status = req.body.status;
            }

            const updatedRequirment = await Publish_Requirment.findByIdAndUpdate(
                req.params.id,
                { $set: object },
                { new: true }
            );

            if (updatedRequirment) {
                res.status(200).json({
                    message: "Requirement updated successfully",
                    status: true,
                    data: updatedRequirment
                });
            } else {
                res.status(422).json({
                    message: "Requirement not found",
                    status: false
                });
            }
        } else {
            res.status(401).json({
                message: "Only admin can update requirement",
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
        let result = req.userdata;
        let docId = req.params.id;

        if (result.role !== "admin") {
            res.status(401).json({
                message: "You are not allowed to delete requirement",
                status: false
            });
        } else {
            await Publish_Requirment.deleteOne({ _id: docId })
                .then(() => {
                    res.status(200).json({
                        message: "Requirement deleted successfully",
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
