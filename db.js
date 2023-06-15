const { default: mongoose } = require('mongoose');

const DB ="mongodb+srv://gaudi3490:wPx6ig7vJp89Gao1@cluster0.mjdctpx.mongodb.net/?retryWrites=true&w=majority"
// "mongodb+srv://gaudi3490:wPx6ig7vJp89Gao1@cluster0.mjdctpx.mongodb.net/"
mongoose.set("strictQuery", false);
mongoose.connect(DB, {useNewUrlParser:true,useUnifiedTopology:true});
const con = mongoose.connection;

module.exports = con;