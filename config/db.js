import mongoose from "mongoose";

const connectDb = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected!!")
};

export default connectDb;