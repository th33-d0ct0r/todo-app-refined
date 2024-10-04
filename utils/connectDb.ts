import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("MongoDB connected");
    } catch (error: unknown) {
        // @ts-expect-error
        console.error(error.message);
        process.exit(1);
    }
}

export default connectDb;