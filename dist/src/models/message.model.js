"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    from_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    detail: {
        type: Object,
        default: {}
    },
    isUnRead: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
const Message = (0, mongoose_1.model)('Message', messageSchema);
exports.default = Message;
//# sourceMappingURL=message.model.js.map