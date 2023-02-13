import mongoose from "mongoose"

const nodeSchema = new mongoose.Schema({
    x: {
        type: Number,
        required: true,
        select: true
    },
    y: {
        type: Number,
        required: true,
        select: true
    },
    z: {
        type: Number,
        required: true,
        select: true
    }
}, {collection: "nodes", versionKey: false})

export default mongoose.model('Node', nodeSchema)