import { ObjectId } from "mongodb";
import mongoose from "mongoose";


// const faceSchema = new mongoose.Schema({
//     faceId: {
//         type: ObjectId,
//         ref: 'Face',
//         require: true
//     }
// })

const bodySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    faces: [
        {
            type: ObjectId,
            ref: 'Face',
            require: true
        }
    ]
}, { collection: "bodies", versionKey: false })

export default mongoose.model('Body', bodySchema)