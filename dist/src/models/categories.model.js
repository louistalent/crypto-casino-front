"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});
const Category = (0, mongoose_1.model)('Category', categorySchema);
exports.default = Category;
//# sourceMappingURL=categories.model.js.map