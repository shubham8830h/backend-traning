const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: author,
        required: true
    },
    tags: [{
        type: String
    }],
    category: {
        type: String,
        required: true
    },
    subcategory: [{
        type: String
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },
    publishedAt: {
        type: Date
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timeStamps: true })

module.exports = mongoose.model('blog', blogSchema)