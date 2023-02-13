import mongoose from "mongoose";
import colors from 'colors';

export default class DB {
  static async connect() {
    try {
      await mongoose.connect(process.env.DaNangTower_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("🔥 Database connected successfully 🔥".cyan.underline);
    } catch (error) {
      console.log("💀 Failed to connect to database 💀".red.bold);
    }
  }
}
