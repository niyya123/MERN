import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const cardSchema = new mongoose.Schema({
  list_event: [
    {
      type: ObjectId,
      ref: "event"
    },
  ],
  user: {
    type: ObjectId,
    ref: "user",
  },
});
export default mongoose.model("Card", cardSchema);
