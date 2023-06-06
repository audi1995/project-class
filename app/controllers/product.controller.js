const { Product } = require("../models/index.model")

exports.create = async (req, res) => {
    try {
        let result = req.userdata;
        console.log(typeof (result.role))
        if (req.userdata.role == "admin") {
            console.log("req.body", req.body);

            await Product(req.body)
                .save()
                .then((docs) => {
                    res.status(201).json({
                        message: "product created successfully",
                        status: true,
                        data: docs
                    });
                })
                .catch((err) => {
                    res.status(401).json({
                        message: err.message,
                        status: false
                    });
                });
        } else {
            console.log("else")
            res.status(401).json(result);
        }

    } catch (err) {
        res.status(422).json(err);
    }
};


exports.index = async (req, res) => {
    try {
        await Product.find().then((docs) => {
            res.status(200).json({
                message: "vendor retrieved successfully",
                data: docs,
                status: true
            })
        }).catch((err) => {
            res.status(422).json({
                message: err.message,
                status: false
            })
        })
    } catch (err) {
        res.status(422).json(err)
    }
}



exports.show = async (req, res) => {
    try {
        await Product.findById({ _id: req.params.id }).then((docs) => {
            res.status(200).json({
                message: "product retrieved successfully",
                data: docs,
                status: true
            })
        }).catch((err) => {
            res.status(422).json({
                message: err.message,
                status: false
            })
        })
    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: false
        })
    }
}

exports.update = async (req, res) => {
    try {
        if (req.userdata.role === "admin") {
            let object = {};
            if (req.body.sku_product_id && req.body.sku_product_id !== "") {
                object.sku_product_id = req.body.sku_product_id;
            }
            if (req.body.model_name && req.body.model_name !== "") {
                object.model_name = req.body.model_name;
            }
            if (req.body.color && req.body.color !== "") {
                object.color = req.body.color;
            }
            if (req.body.price && req.body.price !== "") {
                object.price = req.body.price;
            }
            if (req.body.quantity && req.body.quantity !== "") {
                object.quantity = req.body.quantity;
            }
            if (req.body.description && req.body.description !== "") {
                object.description = req.body.description;
            }
            if (req.body.photos && req.body.photos !== "") {
                object.photos = req.body.photos;
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                { $set: object },
                { new: true }
            );

            if (updatedProduct) {
                res.status(200).json({
                    message: "Product updated successfully",
                    status: true,
                    data: updatedProduct
                });
            } else {
                res.status(404).json({
                    message: "Product not found",
                    status: false
                });
            }
        } else {
            res.status(401).json({
                message: "Only admin can update Products",
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
    console.log("req.userdata");
    if (req.userdata.role != "admin") {
        res.status(401).json({
            message: "You are not allowed to delete product",
            status: false
        })
    }
    else {
        docId = req.params.id;
        await Product.deleteOne({ _id: docId }).then((docs) => {
            res.status(200).json({
                message: "product deleted successfully",
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


