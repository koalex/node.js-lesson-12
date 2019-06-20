const Message   = require('../models/message');


exports.getAll = async ctx => {
    ctx.type = 'json';
    if (ctx.query.withUser) {
        ctx.body = await Message.find().populate('user_id');
    } else {
        ctx.body = await Message.find().lean().exec();
    }
};


exports.getOne = async ctx => {
    ctx.type = 'json';
    ctx.body = await Message.findOne({_id: String(ctx.params.messageId)}).lean().exec();
};

exports.create = async ctx => {
    const message = new Message({
        message: ctx.request.body.message,
        user_id: user._id
    });

    await message.save();

    ctx.redirect('/');
};