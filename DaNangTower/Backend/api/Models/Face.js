import { ObjectId } from "mongodb";
import mongoose from "mongoose";

// const colorsSchema = new mongoose.Schema({
//     type: Number,
//     default: 0
// })

// const ringsSchema = new mongoose.Schema({
//     nodeId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Node',
//         require: true,
//     }
// })

const faceSchema = new mongoose.Schema({
    type: {
        type: String,
        require: true
    },
    symbol: {
        type: {
            type: String,
            default: "simple-fill"
        },
        colors: [Number]
    },
    rings: [
        {
            type: ObjectId,
            ref: 'Node'
        }
    ]
}, { collection: "faces", versionKey: false })

export default mongoose.model('Face', faceSchema)