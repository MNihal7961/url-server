import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    urls: [{
        urlCode: {
            type: String,
            required: true,
            unique: true,
        },
        originalLink: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: false
        }
    }],
    customUrl: [
        [
            {
                url: String,
                code: String
            }
        ]
    ]
});


export default mongoose.model("Url", urlSchema);