const mongoose = require('../../../lib/mongoose');

const messageSchema = new mongoose.Schema({
    message: { type: String, minlength: 1, maxlength: 5000 },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    versionKey: false,
    id: false,
    toJSON: { virtuals: false }
});


const Message = mongoose.model('Message', messageSchema); // создаст коллекцию с именем `messages`

module.exports = Message;