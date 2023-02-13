import mongoose from 'mongoose';
const Schema = mongoose.Schema

const eventSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type: String
    },
    imageurl:{
        type : String
    },
    datebegin:{
        type : String
    },
    dateend:{
        type : String
    },
    status:{
        type: String,
        enum: ['Đang diễn ra','Kết thúc','Mở đăng ký'],
        default : 'Mở đăng ký'
    },
},{ collection: "events" }
);

export default mongoose.model('event',eventSchema)

