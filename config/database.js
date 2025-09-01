const mongoose = require('mongoose');

module.exports.conn = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connect Success!");


    }
    catch (error) {
        console.log("Connect Error!");


    }
}
