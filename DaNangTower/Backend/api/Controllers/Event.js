import Event from '../Models/Event';

export const getAllEvent = async (req,res) =>{
    try {
        const events = await Event.find({},{});
        if (events.length != 0) {
          return res.status(200).json(events);
        } else return res.status(500).json("Không tìm thấy event");
      } catch (e) {
        return res.status(500).json(e);
    }
}

export const getEventById = async (req,res)=>{
    try{
        const event = await Event.findById(req.params.id)
        if (event) {
            return res.json({success:true,event})
          } else return res.status(500).json("Không tìm thấy event");
        } catch (e) {
        return res.status(500).json(e);
    }
}

export const addEvent = async (req,res)=>{
    try {
        var name = req.body.name;
        var description = req.body.description;
        var imageurl = req.body.imageurl;
        var status = req.body.status;
        var datebegin = req.body.datebegin
        var dateend = req.body.dateend
    if (!(description || imageurl || status||datebegin||dateend||name)){
        res.status(400).json("Cần điền đủ thông tin");
    }
    const checkEvent = await Event.findOne({name});
    if (checkEvent){
        return res.status(409).json("Sự kiện đã tồn tại");
    }

    const newEvent = await Event.create({
        name:`${name}`,
        description:`${description}`,
        imageurl:`${imageurl}`,
        datebegin:`${datebegin}`,
        dateend:`${dateend}`,
        status:`${status}` || 'Mở đăng ký'
    });

    return res.json({message:"sự kiện thêm thành công", newEvent});
    } catch (error) {
        return res.status(500).json(`Tạo sự kiện thất bại: ${error}`);
    }
}

export const deleteEvent = async(req,res)=>{
    try {
        const eventDeleteCondition = {_id:req.params.id}
        const deletedEvent = await Event.findOneAndDelete(eventDeleteCondition)

        if (!deletedEvent)
        return res.status(402).json('Event không thấy hoặc user không có quyền')

        if (!deletedEvent.modifiedCount){
            return res.status(402).json("Xóa thất bại");
        }else
        return res.status(200).json({
            isSuccess: true,
            deleteCount: deleteEvent.modifiedCount,
            deletedEvent: deletedEvent,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({sucess:false,message:"Lỗi Server, xin vui lòng thử lại sau"})
    }
}

export const deleteManyEvents = async (req,res) =>{
    try {
        if (!req.body.ids){
            return res.status(402).json("Bạn chưa chọn sự kiện nào để xóa!");
        }else{
            const deletedEvent = await Event.deleteMany({_id:{$in:req.body.ids}});
            if (!deletedEvent.modifiedCount){
                return res.status(402).json("Xóa lỗi, thử lại sau");
            }else
            return res.status(200).json({
                isSuccess: true,
                deleteCount: deletedEvent.modifiedCount,
                deletedEvents: deletedEvent,
              });
        }
    } catch (error) {
        return res.status(500).json(`Không thể xóa các sự kiện này: ${error}`);
    }
}
export const updateEvent = async(req,res)=>{

    const eventData = await Event.findById(req.params.id)
    
    try {
        var name = req.body.name;
        var description = req.body.description;
        var imageurl = req.body.imageurl;
        var status = req.body.status;
        var datebegin = req.body.datebegin
        var dateend = req.body.dateend
        if(!name) return res.status(400).json({success:false,message:'Thiếu tên sự kiện'})

        const updatedEvent = await Event.updateOne(
            {
                _id: req.params.id,
            },
            {
                name: name,
                description: description||'',
                imageurl: imageurl,
                datebegin: datebegin,
                dateend: dateend,
                status: status || 'Đang diễn ra',
            }
        );

        if (!updatedEvent.modifiedCount){
            return res.status(402).json("Sửa bị lỗi, thử lại sau");
        }else{
            eventData = await Event.findOne({_id:req.event.id});
            const {name, ...others} = eventData._doc;
            if (others)
            return res.status(200).json({
                isSuccess: "true",
                updateCount: updateEvent.modifiedCount,
                userUpdated: others,
            });
        }
    } catch (error) {
        return res.status(500).json(`Cannot update this event: ${error}`);
    }
}
