import mongoose from 'mongoose'
const Schema = mongoose.Schema
const TaskSchema=new Schema({

    create_time:{
        type: String,
        require: true
    },
    credit:{
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true,
    },
    desc:{
        type: String,
        require: true
    },
    update_time:{
        type: String,
        require: true
    },
    target_id:{
        type: Schema.Types.ObjectId,
        require: true
    },
    owner_id: {
        type: Schema.Types.ObjectId,
        require: true
    },
    isDone: {
        type: Boolean,
        require: false,
        default: false
    }
    
})

export default mongoose.model('Task',TaskSchema)
