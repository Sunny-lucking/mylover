import mongoose from 'mongoose'
const Schema = mongoose.Schema
const PosterSchema=new Schema({
    url:{
        type:String,
        require:true
    },
    title:{
        type:String,
        require: false,
        default:''
    },
    event_title: {
        type: String,
        default: '',
    },
    url:{
        type:String,
        require: true,
        default:''
    },
    time: {
        type: String,
        default: '',
    },
    owner_id: {
        type: String,
        default: '',
    }
})

export default mongoose.model('Poster',PosterSchema)
