"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySelectSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sport: {
        type: Boolean,
        default: true
    },
    casino: {
        type: Boolean,
        default: true
    },
    livecasino: {
        type: Boolean,
        default: true
    },
    virtual: {
        type: Boolean,
        default: true
    },
    esport: {
        type: Boolean,
        default: true
    },
    casinovip: {
        type: Boolean,
        default: true
    },
    chicken: {
        type: Boolean,
        default: true
    },
    aviator: {
        type: Boolean,
        default: true
    },
    turbogames: {
        type: Boolean,
        default: true
    },
    italianlottery: {
        type: Boolean,
        default: true
    },
    tournaments: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
const CategorySelect = (0, mongoose_1.model)('CategorySelect', categorySelectSchema);
exports.default = CategorySelect;
//# sourceMappingURL=categorySetting.model.js.map