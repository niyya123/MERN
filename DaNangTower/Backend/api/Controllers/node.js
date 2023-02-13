const Node = require("../Models/Node");

exports.getAll = async (req, res) => {
    try {
        const nodes = await Node.find();
        res.status(200).json(nodes)
    } catch (error) {
        res.status(500).json(err)
    }
}