import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ Database Connected Successfully");
    });

    await mongoose.connect(process.env.MONGO_URI);

  } catch (error) {
    console.log("❌ Database Connection Error:", error.message);
    process.exit(1);
  }
};