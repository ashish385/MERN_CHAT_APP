const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
     mongoose
       .connect(process.env.MONGO_URI, {
         //  useNewUrlParser: true,
         //  useUnifiedTopology: true,
       })
       .then(() => console.log(`DB connected successfully`.cyan.underline))
       .catch((err) => {
         console.log("DB connection faild!");
         console.error(err);
         process.exit(1);
       });
}

module.exports = connectDB;