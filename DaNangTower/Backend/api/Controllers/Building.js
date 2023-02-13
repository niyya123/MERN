import Building from "../Models/Building";
import Body from "../Models/Body";
import mongoose from "mongoose";

export const importBuilding = async (req, res) => {
    try {
        const bodyIDArr = [];
        const nameOfFaces = [
            'novotel_bot_build', 'novotel_build', 'novotel_evea', 'novotel_wall-midd', 'novotel_floor_1-5_ver', 'novotel_floor_5-34_ver',
            'novotel_floor_5_34'
        ]
        const data = await Body.find().where('name').in(nameOfFaces).exec();
        const dataJson = JSON.parse(JSON.stringify(data));
        dataJson.forEach(element => {
            bodyIDArr.push(element._id);
        });

        const buildings = {
            buidingName: 'Novotel_Building',
            bodies: bodyIDArr.map(x => mongoose.Types.ObjectId(x))
        }
        await Building.create(buildings);
        res.status(201).json('Inserted to database');
    } catch (e) {
        console.error(`Can't insert. Error: ${e}`);
        return { error: e };
    }
}

export const getBuildings = (req, res) => {
    try {
        const buildingsName = req.params.id;
        Building.find({ buidingName: buildingsName })
            .populate({
                path: 'bodies'
            })
            .exec(function (err, data) {
                res.status(200).json(data);
            })
    } catch (e) {
        console.error(`Can't get data. Error: ${e}`);
        res.status(400);
    }
}

export const getAllBuilding = (req, res) => {
    try {

        Building.find({})
            .populate({
                path: 'bodies'
            })
            .exec(function (err, data) {
                res.status(200).json(data);
            })
    } catch (e) {
        console.error(`Can't get data. Error: ${e}`);
        res.status(400);
    }
}

export const updateBuilding = async (req, res) => {
    const buildingData = await Building.findOne({ _id: req.params.id });
    await Building.updateOne(
        {
            _id: req.params.id,
        },
        {
            isDeleted: !buildingData.isDeleted,
        }
    );

    Building.find({})
        .populate({
            path: 'bodies'
        })
        .exec(function (err, data) {
            res.status(200).json(data);
        })

};

export const getDeletedBuilding = (req, res) => {
    try {
        const buildingsName = req.params.id;
        Building.find({ buidingName: buildingsName }).select('isDeleted -_id').exec(function (err, data) {
            res.status(200).json(data);
        })
    } catch (e) {
        console.error(`Can't get data. Error: ${e}`);
        res.status(400);
    }
}