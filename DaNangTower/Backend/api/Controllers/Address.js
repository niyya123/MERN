import Address from "../Models/Address.js";

export const District = async (req, res, next) => {
  req.query.province &&
  Address
      .find({ name: req.query.province })
      .then((data) => {
        data = data.map((item) => item.toObject());
        res.json(data[0].districts);
      })
      .catch(next);
};

export const Ward = async (req, res, next) => {
  Address
    .find({
      name: req.query.province,
    })
    .then((data) => {
      data = data.map((item) => item.toObject());
      let districts = data[0].districts;

      let districtSelected = districts.filter(
        (district) => district.name == req.query.district
      );

      let ward = districtSelected[0].wards;
      res.json(ward);
    })
    .catch((err) => {});
};

export const GetAllAddress = async (req, res, next) => {
  Address
    .find({})
    .then((address) => res.json({ address: address }))
    .catch(next);
};

export const GetDistrict = (req, res, next) => {
  Address
    .findOne({ name: req.params.name })
    .then((address) => res.json({ address: address }))
    .catch(next);
};

export const GetWard = async (req, res, next) => {
  Address
    .findOne({ name: req.params.name1 })
    .then((address) => {
      address.districts.forEach((element) => {
        if (element.name == req.params.name2) {
          res.json({ address: element });
        }
      });
    })
    .catch(next);
};
