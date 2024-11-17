"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const spinhistorySchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    value: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
const Spinhistory = (0, mongoose_1.model)('Spinshistory', spinhistorySchema);
exports.default = Spinhistory;
//# sourceMappingURL=spinhistory.model.js.map