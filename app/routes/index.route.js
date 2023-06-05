module.exports = function (app){
    app.use('/users', require('./user.route'))
    app.use('/vendors', require('./vendor.route'))
    }