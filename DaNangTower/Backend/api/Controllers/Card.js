import Card from "../Models/Card";
import Event from "../Models/Event";

export const addEvent = async (req, res) => {
  try {
    const { idCard, idEvent } = req.body;
    const findCard = await Card.findOne({ _id: idCard, list_event: idEvent });
    if (findCard) {
      res.status(400).json({
        message: "Sự kiện này đã có trong vé",
        card: findCard,
      });
    } else {
      const card = await Card.findOne({ _id: idCard });
      await Card.findByIdAndUpdate(idCard, {
        list_event: [...card.list_event, idEvent],
      });
      const newCards = await Card.find({})
        .populate("user")
        .populate({ path: "list_event", options: { perDocumentLimit: 5 } });
      res.status(200).json({
        message: "Cập nhập vé thành công",
        card: newCards,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCard = async (req, res) => {
  try {
    const { idUser, idEvent } = req.body;
    const card = await Card.findOne({ user: idUser });
    if (card) {
      res.status(400).json({ message: "Người dùng này đã được tạo vé" });
    } else {
      const newCard = await new Card({
        user: idUser,
        list_event: [idEvent],
      }).save();
      const allCard = await Card.find({})
        .populate("user")
        .populate({ path: "list_event", options: { perDocumentLimit: 5 } });
      res.status(200).json({
        message: "Tạo vé cho người dùng thành công",
        card: allCard,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const findCard = async (req, res) => {
  try {
    const { idUser } = req.body;
    const card = await Card.findOne({ user: idUser })
      .populate("user")
      .populate({ path: "list_event", options: { perDocumentLimit: 5 } });
    if (card) {
      res.status(200).json({
        card,
      });
    } else {
      res.status(400).json({
        message: "Người dùng này chưa có vé",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteCard = async (req, res) => {
  try {
    const { idCard } = req.body;
    await Card.findByIdAndDelete(idCard);
    const newCards = await Card.find({})
      .populate("user")
      .populate({ path: "list_event", options: { perDocumentLimit: 5 } });
    res.status(200).json({
      message: "Xóa vé thành công",
      card: newCards,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const cards = await Card.find({})
      .populate("user")
      .populate({ path: "list_event", options: { perDocumentLimit: 5 } });
    if (cards.length != 0) {
      return res.status(200).json({
        card: cards,
      });
    } else return res.status(500).json("card not found");
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

export const deleteManyCards = async (req, res) => {
  try {
    if (req.body.ids.length === 0) {
      return res.status(402).json({
        message: "Không có vé nào được chọn",
      });
    } else {
      const cardDeleted = await Card.deleteMany({ _id: { $in: req.body.ids } });

      if (cardDeleted.deletedCount === 0) {
        return res.status(402).json({
          message: "Xóa không thành công, thử lại!",
        });
      } else {
        const newCards = await Card.find({})
          .populate("user")
          .populate({ path: "list_event", options: { perDocumentLimit: 5 } });
        res.status(200).json({
          message: "Xóa vé thành công",
          card: newCards,
        });
      }
    }
  } catch (e) {
    return res.status(500).json(`Không thể xóa: ${e}`);
  }
};
