"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const jackpotSchema = new mongoose_1.Schema({
    silver: {
        type: Object,
        default: {}
    },
    gold: {
        type: Object,
        default: {}
    },
    platinum: {
        type: Object,
        default: {}
    },
    fee: {
        type: Number,
        default: 0
    },
    silverValue: {
        type: Number,
        default: 0
    },
    goldValue: {
        type: Number,
        default: 0
    },
    platinumValue: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
const Provider = (0, mongoose_1.model)('Jackpot', jackpotSchema);
exports.default = Provider;
//# sourceMappingURL=jackpot.model.js.map