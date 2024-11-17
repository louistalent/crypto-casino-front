"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const plugins_1 = require("./plugins");
const gametransactionSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    game_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Gamelist',
        required: true
    },
    provider_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    user_credit: {
        type: Number,
        default: 0
    },
    after_credit: {
        type: Number,
        default: 0
    },
    transactionId: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    detail: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
});
// add plugin that converts mongoose to json
gametransactionSchema.plugin(plugins_1.toJSON);
const Gamelist = (0, mongoose_1.model)('Gametransaction', gametransactionSchema);
exports.default = Gamelist;
//# sourceMappingURL=gametransaction.model.js.map