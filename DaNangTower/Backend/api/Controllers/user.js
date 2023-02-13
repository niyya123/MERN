import User from "../Models/User";
import Address from "../Models/Address";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import axios from "axios";
dotenv.config();

var verifyCode = 111111;
var confirmCode = 111111;
var verifiedEmail = "fullreviews24h@gmail.com";

const getRandom = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const sendMail = (mail) => {
  let code = getRandom(100000, 1000000);
  transporter.sendMail(
    {
      from: `${process.env.NODEMAILER_SENDER}`,
      to: `${mail}`,
      subject: "3D GIS System Verification Code",
      html:
        "<p>You have received a new verified code:</b><ul><li>Email: " +
        mail +
        "</li><li>Verified code: " +
        code +
        "</li></ul>",
    },
    function (err, info) {
      if (err) {
        return 0;
      } else {
        return code;
      }
    }
  );
  return code;
};

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: `${process.env.NODEMAILER_SENDER}`,
    pass: `${process.env.NODEMAILER_PASSWORD}`,
  },
});

export const signUp = async (req, res) => {
  try {
    const { tokenCaptcha, email, password, name, phone } = req.body;
    console.log(req.body)
    // Validate Human
    let isHuman = await axios({
      method: "post",
      url: "https://www.google.com/recaptcha/api/siteverify",
      params: {
        secret: `${process.env.SECRET_KEY_API}`,
        response: tokenCaptcha,
      },
    });
    if (!(tokenCaptcha && isHuman.status === 200)) {
      return res.status(202).json({ message: `You are not a human.` });
    } else {
      if (!(email && password && name && phone)) {
        return res.status(202).json({ message: "All inputs are required" });
      }
      const userLogin = await User.findOne({ 'email' : email });
      if (userLogin)
        return res.status(202).json({
          message: "This email has been registered, try another email!",
        });
      else {
        confirmCode = sendMail(req.body.email);
        return res
          .status(200)
          .json({ message: "Check your email to get verified code!" });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: `Error server: ${err}` });
  }
};

export const signupVerifyCode = async (req, res) => {
  try {
    if (req.body.code == confirmCode) {
      var hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await User.create({
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone,
        name: req.body.name,
      });
      if (newUser) return res.json({ ...newUser, status: "true" });
    } else
      return res
        .status(202)
        .json({ status: "false", message: "Incorrect verify code" });
  } catch (e) {
    return res
      .status(500)
      .json({ status: false, message: `Error occurred: ${e}` });
  }
};

export const signIn = async (req, res) => {
  try {
    const { tokenCaptcha } = req.body;
    // Validate Human
    let isHuman = await axios({
      method: "post",
      url: "https://www.google.com/recaptcha/api/siteverify",
      params: {
        secret: `${process.env.SECRET_KEY_API}`,
        response: tokenCaptcha,
      },
    });
    if (!(tokenCaptcha && isHuman.status === 200)) {
      return res.status(202).json({ message: `You are not a human.` });
    } else {
      const { email, password } = req.body;
      if (!(email && password)) {
        return res.status(202).json({ message: "All inputs are required" });
      }
      const userLogin = await User.findOne({ email });

      if (!userLogin)
        return res.status(202).json({
          message: "Invalid credentials, no account linked with this email!",
        });
      else if (!(await bcrypt.compare(password, userLogin.password)))
        return res
          .status(202)
          .json({ message: "Invalid credentials, password's not correct!" });
      else {
        const token = jwt.sign(
          {
            user_id: userLogin._id,
            isAdmin: userLogin.isAdmin,
            email: email,
          },
          process.env.TOKEN_KEY,
          {
            expiresIn: "1h",
          }
        );
        const { password, ...userData } = userLogin._doc;
        return res.status(200).json({
          ...userData,
          token,
          message: "Login successfully",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: `Error server: ${err}` });
  }
};

export const getUserSession = (req, res) => {
  if (typeof req.session.user == "undefined") {
    return res.json({
      status: "false",
    });
  } else {
    return res.json({ name: `${req.session.user.name}`, status: "true" });
  }
};

export const getAll = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    if (users.length != 0) {
      return res.status(200).json(users);
    } else return res.status(404).json("Users not found");
  } catch (e) {
    return res.status(500).json(e);
  }
};

export const insertUser = async (req, res) => {
  try {
    const { addressDetail, birthday, district, email, gender, image, phone, province, username, ward, isAdmin} = req.body;
    if (!(addressDetail && birthday && district && email && gender && image && phone && province && username && ward)) {
      return res.status(404).json("All inputs are required");
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).json("Thông tin người dùng đã được đăng ký, vui lòng chọn email khác");
    }
    const verCode = sendMail(email);
    var hashedPassword = await bcrypt.hash(verCode.toString(), 10);
    const newUser = await User.create({
      email: email,
      name: username,
      password: hashedPassword,
      birthday: birthday,
      gender: gender,
      phone: phone,
      image: image,
      isAdmin: isAdmin ? false: true,
      address: {
        province: province,
        district: district,
        ward: ward,
        addressdetail: addressDetail,
      }
    });
    if (newUser) return res.status(200).json({message: "Thêm người dùng thành công!", data: newUser});
    else return res.status(404).json({message: "Thêm người dùng không thành công!"});
  } catch (e) {
    return res.status(500).json({message: `Thêm người dùng không thành công: ${e}`});
  }
};

export const getUser = async (req, res) => {
  
  console.log(req.params.id);

  try {
    const userData = await User.findOne({ _id: req.params.id });
    const { password, ...others } = userData._doc;
    Address.find()
      .select("name")
      .then(async (data) => {
        let district = [];
        let ward = [];
        let userProvince = others.address.province;
        let userDistrict = others.address.district;
        data = data.map((item) => item.toObject());
        if (userProvince != "") {
          let districtInfo = await Address.find({ name: userProvince });
          if (districtInfo) {
            districtInfo = districtInfo.map((item) => item.toObject());
            district = districtInfo[0].districts;
            let districtSelected = district.filter(
              (districtInfo) => districtInfo.name == userDistrict
            );
            ward = districtSelected[0].wards;
            return res.status(200).json({
              user: others,
              province: data,
              district: district,
              ward: ward,
            });
          } else {
            return res.status(200).json({
              user: others,
              province: data,
              district: district,
              ward: ward,
            });
          }
        }
      });
  } catch (e) {
    return res.status(500).json(e);
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const userReset = await User.findOne({
      email: req.body.email,
    });
    if (!userReset) {
      return res.status(202).json({
        message: "No account linked with this email, try again!",
      });
    } else {
      verifyCode = sendMail(req.body.email);
      return res.status(200).json({
        message: "Check your email to get the verified code!",
      });
    }
  } catch (e) {
    return res
      .status(500)
      .json(`Cannot reset password because of ${e}, try again`);
  }
};

export const confirmVerifyCode = (req, res) => {
  try {
    if (req.body.code == verifyCode) {
      verifiedEmail = req.body.email;
      return res.status(200).json({
        message: "Confirmed successfully",
      });
    } else {
      return res.status(202).json({
        message: "Incorrect verify code",
      });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ status: false, message: `Error occurred: ${e}` });
  }
};

export const changePassword = async (req, res) => {
  try {
    var hashedPassword = await bcrypt.hash(req.body.password, 10);
    var result = await User.updateOne(
      {
        email: `${req.body.email}`,
      },
      {
        password: `${hashedPassword}`,
      }
    );
    if (result.modifiedCount == 1) {
      return res.status(200).json({
        updateCount: result.modifiedCount,
        token: token,
      });
    } else {
      return res.status(202).json({
        message: "Try again, system error!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
};

export const changePass = async (req, res) => {
  try {

    const {currentPassword, newPassword, verifyPassword} = req.body;
    if (!currentPassword) return res.status(202).json({message: 'Mật khẩu hiện tại không hợp lệ!'});
    else if (!newPassword) return res.status(202).json({message: 'Mật khẩu mới không hợp lệ!'});
    else if (!verifyPassword) return res.status(202).json({message: 'Mật khẩu xác nhận không hợp lệ!'});
    else if (newPassword !== verifyPassword) return res.status(202).json({message: 'Mật khẩu mới không khớp!'});
    
    const userChange = await User.findOne({
      email: req.body.email,
    });
    
    if (!await bcrypt.compare(currentPassword, userChange.password)) return res.status(202).json({message: 'Mật khẩu hiện tại chưa đúng!'});
    var hashedPassword = await bcrypt.hash(req.body.verifyPassword, 10);
    var result = await User.updateOne(
      {
        email: req.body.email,
      },
      {
        password: hashedPassword,
      }
    );

    if (result.modifiedCount == 1) {
      const token = jwt.sign(
        {
          user_id: userChange._id,
          isAdmin: userChange.isAdmin,
          email: userChange.email,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({
        ...userChange,
        token
      });
    } else {
      return res.status(202).json({
        message: "System error, try again",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
};


export const editUser = async (req, res) => {
  try {
    const userData = await User.findById(req.params.id);
    if (!userData) {
      return res.status(404).json("User not found!");
    } else {
      return res.status(200).json({ user: userData });
    }
  } catch (e) {
    return res.status(500).json("System error, try again!");
  }
};

export const updateUser = async (req, res) => {
  try {
    // const hashed = await bcrypt.hash(req.body.password, 10);
    const userUpdated = await User.updateOne(
      {
        _id: req.params.id,
      },
      {
        name: req.body.username,
        // password: hashed,
        gender: req.body.gender,
        email: req.body.email,
        phone: req.body.phone,
        birthday: req.body.birthday,
        image: req.body.image,
        address: {
          province: req.body.province,
          district: req.body.district,
          ward: req.body.ward,
          addressdetail: req.body.addressDetail,
        },
      }
    );
    if (!userUpdated.modifiedCount) {
      return res.status(402).json("Update failed, try again!");
    } else {
      const userData = await User.findOne({ _id: req.params.id });
      const { password, ...others } = userData._doc;
      if (others) return res.status(200).json(others);
    }
  } catch (e) {
    return res.status(500).json(`Cannot update this user: ${e}`);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.params.id });
    if (!userData) {
      return res.status(404).json("User not found!");
    } else {
      const userDeleted = await User.deleteOne(userData);
      if (!userDeleted.modifiedCount) {
        return res.status(402).json("Delete failed, try again!");
      } else
        return res.status(200).json({
          isSuccess: true,
          deleteCount: userDeleted.modifiedCount,
          data: userDeleted,
        });
    }
  } catch (e) {
    return res.status(500).json(`Cannot delete this user: ${e}`);
  }
};

export const deleteManyUsers = async (req, res) => {
  try {
    if (!req.body.ids) {
      return res.status(404).json("No users sent!");
    } else {
      const userDeleted = await User.deleteMany({ _id: { $in: req.body.ids } });
      if (!userDeleted.modifiedCount) {
        return res.status(402).json("Delete failed, try again!");
      } else
        return res.status(200).json({
          isSuccess: true,
          deleteCount: userDeleted.modifiedCount,
          data: userDeleted,
        });
    }
  } catch (e) {
    return res.status(500).json(`Cannot delete this user: ${e}`);
  }
};

export const signOut = (req, res) => {
  if (req.session) {
    req.session.destroy();
    return res.status(200).json({ message: "Signed out" });
  } else {
    return res.status(404).json({ message: "No user session found!" });
  }
};
