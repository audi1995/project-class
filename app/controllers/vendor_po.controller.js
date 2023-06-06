const { Vendor_Po } = require('../models/index.model')

exports.create = async (req, res) => {
    try {
        let result = req.userdata;
        if (result.role !== "vendor") {
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
        if (result.role == "admin" || result.role == "vendor") {
            await Vendor_Po.find().then((docs) => {
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
        if (req.userdata.role !== "vendor") {

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
    let result = req.userdata;
    if (req.userdata.role === "admin") {
        try {
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
            const updatedproduct = await Vendor_Po.findByIdAndUpdate(
                req.params.id,
                { $set: object },
                { new: true }
            );

            if (updatedproduct) {
                res.status(200).json({
                    message: "po updated successfully",
                    status: true,
                    data: updatedVendor
                });
            } else {
                res.status(404).json({
                    message: "po not found",
                    status: false
                });
            }
        }
        catch (err) {
            res.status(500).json({
                message: "Internal server error",
                status: false
            });
        }
    } else {
        res.status(401).json({
            message: "Only admin can update po",
            status: false
        });
    }
}

exports.destroy = async (req, res) => {
    let result = req.userdata;
    if (req.role != "vendor") {
        res.status(401).json({
            message: "You are not allowed to delete po",
            status: false
        })
    }
    else {
        await Vendor_Po.deleteOne({ _id: docId }).then((docs) => {
            res.status(200).json({
                message: "po deleted successfully",
                status: true,
                data: {}
            })
        }
        ).catch((err) => {
            res.status(422).json({
                message: err.message,
                status: false
            })
        })
    }
}





