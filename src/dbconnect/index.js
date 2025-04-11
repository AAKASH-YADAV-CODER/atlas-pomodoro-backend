import mongoose from "mongoose";
import { DATABASE_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionPart = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DATABASE_NAME}`
    );
    const result = await mongoose.connection.db
      .collection("users")
      .updateMany({ phone: "" }, { $set: { phone: null } });
    // console.log(`Updated ${result.modifiedCount} documents`);
    console.log(
      `Successfully Connected DB 😁 DB HOST ${connectionPart.connection.host}`
    );
  } catch (error) {
    console.error("This Error Occur in DB Connection", error);
    process.exit(1);
  }
};
export default connectDB;
