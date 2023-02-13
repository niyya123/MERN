const Face = require("../models/face");
const mongoose = require("mongoose");

exports.getAll = async (req, res) => {
    try {
        const faces = await Face.find();
        res.status(200).json(faces)
    } catch (error) {
        res.status(500).json(err)
    }
}

exports.insertOne = async (req, res) => {
    try {
        const ringsArr = req.body.nodeArr.map(x => mongoose.Types.ObjectId(x));
        const face = {
            type: "polygon",
            symbol: {
                type: "simple-fill",
                color: [0, 0, 128, 1]
            },
            rings: ringsArr
        }
        const result = await Face.create(face);
        res.status(201).json(result);
    } catch (e) {
        console.error(`can insert face: ${e}`);
        return {error: e};
    }
}