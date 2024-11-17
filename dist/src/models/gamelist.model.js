"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const plugins_1 = require("./plugins");
const gamelistSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        required: true
    },
    device: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: ''
    },
    gameid: {
        type: String,
        required: true
    },
    provider: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
    },
    sevice: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
// add plugin that converts mongoose to json
gamelistSchema.plugin(plugins_1.toJSON);
const Gamelist = (0, mongoose_1.model)('Gamelist', gamelistSchema);
exports.default = Gamelist;
//# sourceMappingURL=gamelist.model.js.map