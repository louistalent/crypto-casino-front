"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sessionSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ip: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    os: {
        type: String,
        default: ''
    },
    browser: {
        type: String,
        default: ''
    },
    device: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});
const Session = (0, mongoose_1.model)('Session', sessionSchema);
exports.default = Session;
//# sourceMappingURL=session.model.js.map