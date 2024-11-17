"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = exports.toJSON = void 0;
//ES6 conversion
const toJSON_plugin_1 = __importDefault(require("./toJSON.plugin"));
exports.toJSON = toJSON_plugin_1.default;
const paginate_plugin_1 = __importDefault(require("./paginate.plugin"));
exports.paginate = paginate_plugin_1.default;
//# sourceMappingURL=index.js.map