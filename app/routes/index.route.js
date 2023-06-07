module.exports = function (app){
    app.use('/users', require('./user.route'))
    app.use('/vendors', require('./vendor.route'))
    app.use('/products', require("./product.route"))
    app.use('/publish_requirments', require('./publish_requirment.route'))
    app.use('/vendor_po', require('../routes/vendor_po.route'))
    app.use("/req_dealer", require('../routes/req_dealer.route'))
    app.use('/cart', require('./cart.route'))
    }