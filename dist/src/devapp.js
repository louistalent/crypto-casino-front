"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const error_1 = require("./middlewares/error");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.options('*', (0, cors_1.default)());
app.use(express_1.default.json({ limit: '500mb' }));
app.use(express_1.default.urlencoded({ limit: '500mb', extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public/avatar')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public/tasks')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public/files')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public/build')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public/images')));
app.use('/api', routes_1.default);
// app.use('*', pageRoute);
app.use(error_1.errorConverter);
app.use(error_1.errorHandler);
exports.default = app;
//# sourceMappingURL=devapp.js.map