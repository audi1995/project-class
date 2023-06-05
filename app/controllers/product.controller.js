const {Product}= require("../models/product.model")

exports.create = async(req,res)=>{
    try {
        if (result.userdata.role !== "admin") {
            res.status(401).json(result);
        } else {
                await Product(req.body)
                    .save()
                    .then((docs) => {
                        res.status(201).json({
                            message: "product created successfully",
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



exports.index = async(req,res)=>{
    try {
        await product.find().then((docs) => {
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



exports.show = async(req,res)=>{

}

exports.update = async(req,res)=>{
    if(req.userdata.role =="admin"){

    }
}

exports.destroy = async(req,res)=>{
    
}

