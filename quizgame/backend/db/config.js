import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      "connected successfully with instance ",
      connection.connection.host,
    );
  } catch (error) {
    console.log("MongoDB Connection Error: ", error.message);
  }
};

export default connectDB;
