const { Cart } = require('../models/index.model')

exports.create = async (req, res) => {
    try {
        let products = req.body.products;
        let total_price = 0;
        for (let i = 0; i < products.length; i++) {
            let price = products[i].product.price * products[i].quantity;
            total_price += price;
        }
        let amount = req.body;
        amount.total_price = total_price;
        await Cart(amount)
            .save()
            .then((docs) => {
                res.status(201).json({
                    message: "Cart created successfully",
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
    } catch (err) {
        res.status(422).json(err);
    }
};



exports.show = async (req, res) => {
    try {
        {
            await Cart.findById({ _id: req.params.id }).then((docs) => {
                res.status(200).json({
                    message: "cart retrieved successfully",
                    data: docs,
                    status: true
                })
            }).catch((err) => {
                res.status(422).json({
                    message: err.message,
                    status: false
                })
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
        if (req.userdata.role == "user") {
            let object = {};

            if (req.body.products && req.body.products !== "") {
                object.products = req.body.products;
            }

            const updatedcart = await Cart.findByIdAndUpdate(
                req.params.id,
                { $set: object },
                { new: true }
            );

            if (updatedcart) {
                res.status(200).json({
                    message: "cart updated successfully",
                    status: true,
                    data: updatedcart
                });
            } else {
                res.status(422).json({
                    message: "cart not found",
                    status: false
                });
            }
        } else {
            res.status(401).json({
                message: "unauthorised user",
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
        if (req.userdata.role !== "admin") {
            res.status(401).json({
                message: "You are not allowed to delete cart",
                status: false
            });
        } else {
            await Cart.deleteOne({ _id: req.params.id })
                .then(() => {
                    res.status(200).json({
                        message: "cart deleted successfully",
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
