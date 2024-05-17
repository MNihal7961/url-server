import mongoose from "mongoose";

mongoose.set('strictQuery', false)

const dbConnect = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL;

        if (!mongoUrl) {
            throw new Error("MONGO_URL is not getting from env.");
        }

        await mongoose.connect(mongoUrl);
        console.log("MongoDB connected");

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default dbConnect;