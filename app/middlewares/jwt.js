var jwt = require('jsonwebtoken');
const secret = "abcde";
const { User, Vendor } = require("../models/index.model");

exports.generateWebToken = (docId) => {
  return jwt.sign({
    data: docId,
  }, secret, { expiresIn: 60 * 60 * 24 * 7 });
}

exports.verifyWebToken = async (req, res, next) => {
  if (req.headers.authorization) {
    let token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, secret, async function (err, decoded) {
      if (err) {
        res.status(401).json({
          message: "Authentication failed",
          status: false
        })
      } else {
        await User.findOne({ _id: decoded.data }).then(async (docs) => {
          if (docs) {
            req.userdata = docs;
            next();
          } else {
            await Vendor.findOne({ _id: decoded.data }).then((vendor) => {
              req.userdata = vendor;
              next();
            }).catch((err) => {
              console.log('auth token error', err);
            })
          }
        }).catch((err) => { console.log('auth token error', err); })
      }
    })
  } else {
    res.status(401).json({
      message: "Authentication failed",
      status: false
    })
  }
}