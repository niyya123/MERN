import Body from "../Models/Body";
import Face from "../Models/Face";
import Node from "../Models/Node";
import mongoose from "mongoose";
// import data from "../../data/line.json" assert { type: "json"};


export const importJsonFile = async (req, res) => {
    try {
        const nodeIdArr = [];
        const faceIdArr = [];
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].paths[0].length; j++) {
                var node = {
                    x: data[i].paths[0][j][0],
                    y: data[i].paths[0][j][1],
                    z: data[i].paths[0][j][2]
                }
                var result = await Node.create(node);
                nodeIdArr.push(result._id.toString());
            }

            var face = {
                type: data[i].type,
                symbol: {
                    type: data[i].symbol.type,
                    colors: data[i].symbol.color
                },
                rings: nodeIdArr.map(x => mongoose.Types.ObjectId(x))
            }
            var resultFace = await Face.create(face);
            faceIdArr.push(resultFace._id);
            while (nodeIdArr.length > 0) {
                nodeIdArr.pop();
            }
        }
        const body = {
            name: "line",
            faces: faceIdArr.map(x => mongoose.Types.ObjectId(x))
        }
        const resultBody = await Body.create(body);

        res.status(201).json(resultBody);
    } catch (e) {
        console.error(`can insert face: ${e}`);
        return { error: e };
    }
}

export const getBodies = async (req, res) => {
    const nameBodies = req.params.id;
    Body.findOne({ name: nameBodies }, { '_id': 0, 'name': 0 })
        .populate({
            path: 'faces',
            select: '-_id',
            populate: { path: 'rings', select: '-_id' }
        })
        .exec(function (err, bodies) {
            if (err) return { error: err };
            const data = JSON.parse(JSON.stringify(bodies));
            var ringsVer2 = [];
            for (let i of data.faces) {
                for (let j of i.rings) {
                    ringsVer2.push(Object.values(j));
                }
                i.rings = ringsVer2;
                ringsVer2 = [];
            }
            res.status(200).json(data);
        });
}

export const getLines = async (req, res) => {
    const nameBodies = req.params.id;
    Body.findOne({ name: nameBodies }, { '_id': 0, 'name': 0 })
        .populate({
            path: 'faces',
            select: '-_id',
            populate: { path: 'rings', select: '-_id' }
        })
        .exec(function (err, bodies) {
            if (err) return { error: err };
            const data = JSON.parse(JSON.stringify(bodies));
            var ringsVer2 = [];
            for (let i of data.faces) {
                for (let j of i.rings) {
                    ringsVer2.push(Object.values(j));
                }
                i.rings = ringsVer2;
                ringsVer2 = [];
            }
            data.faces.map(obj => {
                delete Object.assign(obj, { ['paths']: obj['rings'] })['rings'];
            })

            res.status(200).json(data);
        });
}

function hexToRgbA(hex, opacity) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return [(c >> 16) & 255, (c >> 8) & 255, c & 255, parseFloat(opacity)];
    }
    throw new Error('Bad Hex');
}


export const getBodiesWithColor = async (req, res) => {
    const nameBodies = req.params.id;
    const colorArr = hexToRgbA('#' + req.params.color, req.params.opacity);
    Body.findOne({ name: nameBodies }, { '_id': 0, 'name': 0 })
        .populate({
            path: 'faces',
            select: '-_id',
            populate: { path: 'rings', select: '-_id' }
        })
        .exec(function (err, bodies) {
            const data = JSON.parse(JSON.stringify(bodies));
            var ringsVer2 = [];
            for (let i of data.faces) {
                i.symbol.colors = colorArr;
                for (let j of i.rings) {
                    ringsVer2.push(Object.values(j));
                }
                i.rings = ringsVer2;
                ringsVer2 = [];
            }
            res.status(200).json(data);
        });
}

export const getLinesWithColor = async (req, res) => {
    const nameBodies = req.params.id;
    const colorArr = hexToRgbA('#' + req.params.color, req.params.opacity);
    Body.findOne({ name: nameBodies }, { '_id': 0, 'name': 0 })
        .populate({
            path: 'faces',
            select: '-_id',
            populate: { path: 'rings', select: '-_id' }
        })
        .exec(function (err, bodies) {
            if (err) return { error: err };
            const data = JSON.parse(JSON.stringify(bodies));
            var ringsVer2 = [];
            for (let i of data.faces) {
                i.symbol.colors = colorArr;
                for (let j of i.rings) {
                    ringsVer2.push(Object.values(j));
                }
                i.rings = ringsVer2;
                ringsVer2 = [];
            }
            data.faces.map(obj => {
                delete Object.assign(obj, { ['paths']: obj['rings'] })['rings'];
            })

            res.status(200).json(data);
        });
}

// export const insertOne = async (req, res) => {
//     try {
//         const faceIdArr = req.body.faceArr.map(x => mongoose.Types.ObjectId(x))
//         const bodies = {
//             name: "Test1",
//             faces: faceIdArr
//         }
//         const result = Body.create(bodies);
//         res.status(201).json(result);
//     } catch (e) {
//         console.error(`can insert face: ${e}`);
//         return {error: e};
//     }
// }
