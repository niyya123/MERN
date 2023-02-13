import { ObjectID } from "bson";
import mongoose, { Schema } from "mongoose";

const buildingSchema = new Schema({
    buidingName: {
        type: String,
        require: true
    },
    isDeleted: {
        type: Boolean,
        require: true,
        default: false
    },
    bodies: [
        {
            type: ObjectID,
            ref: 'Body'
        }
    ]
}, { collection: 'buildings', versionKey: false})

export default mongoose.model('Building', buildingSchema);