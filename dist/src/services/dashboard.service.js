"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categorySetting_model_1 = __importDefault(require("../models/categorySetting.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const spinhistory_model_1 = __importDefault(require("../models/spinhistory.model"));
const selectCategory = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categorySetting_model_1.default.findOne({ user_id: user._id });
    return result;
});
const setFreeBonus = (user, value) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(value);
    const spinData = {
        user_id: user._id,
        value: value.value
    };
    yield spinhistory_model_1.default.create(spinData);
    yield user_model_1.default.updateOne({ _id: user._id }, { spinbonus: (user === null || user === void 0 ? void 0 : user.spinbonus) + value.value, balance: (user === null || user === void 0 ? void 0 : user.balance) + value.value });
    return value;
});
const getFreeBonus = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield spinhistory_model_1.default.findOne({ user_id: user._id }).sort({ createdAt: -1 });
    let diffTime = { hour: 24, minute: 0, second: 0 };
    if (transactions) {
        const t1 = new Date(transactions.createdAt);
        const t2 = new Date();
        const diff = t2.getTime() - t1.getTime();
        diffTime = {
            hour: Math.floor(diff / 3600000),
            minute: Math.floor((diff % 3600000) / 60000),
            second: Math.floor((diff % 60000) / 1000)
        };
    }
    const result = yield spinhistory_model_1.default.find({ user_id: user._id }).sort({ createdAt: -1 });
    return { result, diffTime };
});
exports.default = {
    selectCategory,
    setFreeBonus,
    getFreeBonus
};
//# sourceMappingURL=dashboard.service.js.map