"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const plugins_1 = require("./plugins");
const providerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    service: {
        type: String,
        default: ''
    },
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, {
    timestamps: true
});
// add plugin that converts mongoose to json
providerSchema.plugin(plugins_1.toJSON);
const Provider = (0, mongoose_1.model)('Provider', providerSchema);
exports.default = Provider;
//# sourceMappingURL=provider.model.js.map