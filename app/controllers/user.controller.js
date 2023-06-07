const { User } = require('../models/index.model')
const validator = require("../helpers/validation")
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
saltRounds = 10;
var { generateWebToken } = require("../middlewares/jwt");
const emailSender = require('../helpers/nodemailer');


exports.create = async (req, res) => {
    try {
        let result = validator.both(req.body)
        if (result.status === false) {
            res.status(401).json(result);
        } else {
            let count = await User.countDocuments({
                $or: [{ email: req.body.email }, { phone: req.body.phone }],
            });
            if (count > 0) {
                res.status(401).json({
                    mesaage: "user already exists.",
                    status: false
                })
            } else {
                req.body.password = await bcrypt.hash(req.body.password, saltRounds);
                let user = await User(req.body).save()
                if (!user){
                    res.status(401).json({
                        message: "user not created",
                        status: false
                    })
                }else{
                    console.log(user.email);
                    emailSender.sendEmail(user.email)
                    res.status(200).json({
                        message: "user created successfully.",
                        data: user
                    })
                }
                    // .then((docs) => {
                    //     emailSender.sendEmail(docs.email)
                    //     res.status(201).json({
                    //         message: "User created successfully",
                    //         status: true,
                    //         data: docs
                    //     })
                    // })
                    // .catch((err) => {
                    //     res.status(401).json({
                    //         mesaage: "user already exists.",
                    //         status: false
                    //     })
                    // });
            }
        }
    } catch (err) {
        res.status(422).json(err)
    }
}


exports.index = async (req, res) => {
    try {
        if (req.userdata.role == "admin") {
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit) : 3;
            let skip = page > 1 ? (page - 1) * limit : 0;

            await User.find().skip(skip).limit(limit).then((docs) => {
                res.status(200).json({
                    message: "User retrieved",
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
        }
        else {
            res.status(422).json(err)
        }
    }
    catch (err) {
        res.status(422).json(err)
    }
}


exports.show = async (req, res) => {
    try {
        await User.findOne({ _id: req.params.id }).then((docs) => {
            res.status(200).json({
                message: "user retrieved successfully",
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


exports.update = async (req, res) => {
    try {
        let result = validator.both(req.body);
        if (result.status === false) {
            res.status(401).json(result);
        } else {
            let object = {};
            if (req.body.email && req.body.email != "") {
                object.email = req.body.email;
                if (req.body.phone && req.body.phone != "") {
                    object.phone = req.body.phone;
                }
                if (req.body.name && req.body.name != "") {
                    object.name = req.body.name;
                    if (req.body.gender && req.body.gender != "")
                        object.gender = req.body.gender;
                    if (req.body.name && req.body.name != "")
                        object.name = req.body.name;
                    if (req.body.address && req.body.address != "")
                        object.address = req.body.address;
                    {
                        console.log("req.params", req.params);
                        console.log("req.userdata.id", req.userdata.id);

                        if (req.userdata.id === req.params.id) {
                            console.log("object", object);

                            await User
                                .updateOne({ _id: req.params.id }, { $set: object })
                                .then((docs) => {
                                    res.status(200).json({
                                        message: "email updated successfully",
                                        status: true,
                                        data: docs
                                    })
                                })
                                .catch((err) => {
                                    res.status(401).json({
                                        message: err.message, status: false
                                    })
                                });
                        } else {
                            res.status(422).json({
                                message: err.message, status: false
                            })
                        }
                    }
                }
            }

        }
    } catch (err) {
        res.status(422).json(err)
    }
}


exports.destroy = async (req, res) => {
    try {
        let authUser = req.userdata;
        docId = req.params.id;
        console.log("authUser", authUser,docId);

        if (authUser.role == "admin") {
            await User
                .deleteOne({ _id: docId })
                .then((docs) => {
                    res.status(200).json({
                        message: "user account has been removed successfully",
                        status: true,
                        data: {}
                    })

                })
                .catch((err) => {
                    res.status(422).json({
                        message: err.message,
                        status: false
                    })
                });
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
};


exports.login = async (req, res) => {
    let { email, password } = req.body;
    let result = validator.email(req.body);
    if (result.status === false) {
        res.status(422).json(result);
    } else {
        await User.findOne({ email: req.body.email }).then((docs) => {
            if (!docs) {
                res.status(422).json({
                    message: "User not found",
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