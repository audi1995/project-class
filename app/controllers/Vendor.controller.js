const { Vendor } = require('../models/index.model')
const validator = require("../helpers/validation")
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const saltRounds = 10;
var { generateWebToken } = require("../middlewares/jwt");
const emailSender = require('../helpers/nodemailer');

exports.create = async (req, res) => {
    try {
        let result = validator.both(req.body)
        if (result.status === false) {
            console.log("hbcfd");
            res.status(422).json(result);
        } else {
            let count = await Vendor.countDocuments({
                $or: [{ email: req.body.email }, { phone: req.body.phone }],
            });
            if (count > 0) {
                res.status(403).json({
                    mesaage: "vendor already exists.",
                    status: false
                })
            } else {
                req.body.password = await bcrypt.hash(req.body.password, saltRounds);
                let user = await Vendor(req.body).save()
                if (!user) {
                    res.status(422).json({
                        message: "Vendor not created",
                        status: false
                    })
                } else {
                    emailSender.sendEmail(user.email, `Greetings from our company`, `Hello, ${user.name} Welcom to our website`,)
                    res.status(201).json({
                        message: "Vendor created successfully.",
                        data: user
                    })
                }
            }
        }
    } catch (err) {
        res.status(500).json(err)
    }
}


exports.index = async (req, res) => {
    try {
        console.log("req.userdata", req.userdata);
        if (req.userdata.role == "admin") {
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit) : 5;
            let skip = page > 1 ? (page - 1) * limit : 0;

            await new Product.find().skip(skip).limit(limit).then((docs) => {
                res.status(200).json({
                    message: "vendor retrieved",
                    status: true,
                    data: docs
                })
            })
                .catch((err) => {
                    res.statu422s().json({
                        message: err.message,
                        status: false
                    })
                });
        } else {
            res.status(401).json({
                message: "unauthorised vendor",
                status: false
            })
        }
    }
    catch (err) {
        res.statu422s(500).json(err)
    }
}


exports.show = async (req, res) => {
    try {
        if (req.userdata.id !== req.params.id) {
            res.status(401).json({
                message: "User does not exist",
                status: false
            })
        } else {

            await Vendor.findOne({ _id: req.params.id }).then((docs) => {
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
        }
    } catch (err) {
        res.status(500).json(err)
    }
}


exports.update = async (req, res) => {
    try {
        if (req.userdata.role === "vendor" && req.userdata.id === req.params.id) {
            let result = validator.both(req.body);
            if (result.status === false) {
                res.status(422).json(result);
            } else {
                let object = {};
                if (req.body.email && req.body.email !== "")
                    object.email = req.body.email;
                if (req.body.phone && req.body.phone !== "")
                    object.phone = req.body.phone;
                if (req.body.name && req.body.name !== "")
                    object.name = req.body.name;
                if (req.body.gender && req.body.gender !== "")
                    object.gender = req.body.gender;
                if (req.body.name && req.body.name !== "")
                    object.name = req.body.name;
                if (req.body.address && req.body.address !== "")
                    object.address = req.body.address;
                if (req.body.gstNo && req.body.gstNo !== "")
                    object.gstNo = req.body.gstNo;

                await Vendor
                    .updateOne({ _id: req.params.id }, { $set: object })
                    .then((result) => {
                        res.status(200).json({
                            message: "Vendor updated successfully",
                            status: true,
                            data: result
                        });
                    })
                    .catch((err) => {
                        res.status(422).json({
                            message: err.message,
                            status: false
                        });
                    });
            }
        } else if (req.userdata.role === "admin") {
            let object = {};
            if (req.body.isApproved && req.body.isApproved !== "")
                object.isApproved = req.body.isApproved;
            await Vendor
                .updateOne({ _id: req.params.id }, { $set: object })
                .then((result) => {
                    res.status(200).json({
                        message: "Vendor updated successfully",
                        status: true,
                        data: result
                    }); ''
                })
                .catch((err) => {
                    res.status(422).json({
                        message: err.message,
                        status: false
                    });
                });

        }
    } catch (err) {
        res.status(500).json(err);
    }
};




exports.destroy = async (req, res) => {
    try {
        if (req.userdata.role === "admin") {
            const docId = req.params.id;
            await User
                .deleteOne({ _id: docId })
                .then(() => {
                    res.status(200).json({
                        message: "Vendor removed successfully",
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
            message: err.message,
            status: false
        });
    }
};




exports.login = async (req, res) => {
    let { email, password } = req.body;
    let result = validator.email(req.body);
    if (result.status === false) {
        res.status(422).json(result);
    } else {
        await Vendor.findOne({ email: req.body.email }).then((docs) => {
            if (!docs) {
                res.status(403).json({
                    message: "vendor not found",
                    status: false
                })
            } else {
                if (bcrypt.compareSync(password, docs["_doc"].password) === true) {
                    docs["_doc"].auth_token = generateWebToken(docs._id);
                    res.status(200).json({
                        message: "Login successfully",
                        status: true,
                        data: docs
                    })
                } else {
                    res.status(422).json({
                        message: "Password does not match",
                        status: false
                    })
                }
            }
        });
    }
}