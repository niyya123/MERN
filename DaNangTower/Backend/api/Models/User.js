import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: { type: String, default: "" },
    password: { type: String, default: "" },
    phone: { type: String, default: "" },
    gender: { type: String, default: "Male" },
    birthday: { type: String, default: "2001-01-01" },
    name: { type: String, default: "User Default" },
    image: { type: String, default: "https://firebasestorage.googleapis.com/v0/b/dgis-33b4f.appspot.com/o/images%2FArcGIS_logo.png?alt=media&token=685b8002-4adf-46ea-ace8-cb4602e77bb4" },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    address: {
      type: Object,
      default: {
        province: "Thành phố Hà Nội",
        district: "Quận Ba Đình",
        ward: "Phường Phúc Xá",
        addressdetail: "27/B5",
      },
    },
  },
  { timestamps: true },
  { collection: "users" }
);
export default mongoose.model("user", userSchema);
