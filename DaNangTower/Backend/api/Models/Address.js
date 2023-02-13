import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    code: Number,
    name: String,
    codename: String,
    division_type: String,
    districts: Array,
    phone_code: Number,
  },
  { collection: "addresses" }
);
export default mongoose.model("Address", addressSchema);
