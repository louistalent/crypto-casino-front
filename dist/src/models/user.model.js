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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const plugins_1 = require("./plugins");
const library_1 = require("../utils/library");
const config_1 = require("../config");
const playerSchema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        private: true // used by the toJSON plugin
    },
    phonenumber: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: config_1.statusoptions,
        default: config_1.statusoptions[0]
    },
    avatar: {
        type: String,
        default: ''
    },
    balance: {
        type: Number,
        default: 0
    },
    bonusbalnace: {
        type: Number,
        default: 0
    },
    bonus: {
        type: String,
        default: '5%'
    },
    country: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    currency: {
        type: String,
        required: true
    },
    timezone: {
        type: String,
        default: ''
    },
    birthday: {
        type: String,
        default: ''
    },
    parent_id: {
        type: String,
        default: ''
    },
    roleId: {
        type: String,
        default: ''
    },
    fido_amount: {
        type: Number,
        default: 0
    },
    ip: {
        type: String,
        default: ''
    },
    spinbonus: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
// add plugin that converts mongoose to json
playerSchema.plugin(plugins_1.toJSON);
playerSchema.plugin(plugins_1.paginate);
playerSchema.index({ username: 1, email: 1 });
playerSchema.statics.isEmailTaken = function (email, excludeUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email, _id: { $ne: excludeUserId } });
        return !!user;
    });
};
playerSchema.statics.isUsernameTaken = function (username, excludeUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ username, _id: { $ne: excludeUserId } });
        return !!user;
    });
};
playerSchema.methods.isPasswordMatch = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        return bcryptjs_1.default.compare(password, user.password);
    });
};
playerSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified('password')) {
            user.password = yield bcryptjs_1.default.hash(user.password, 8);
        }
        user.id = (0, library_1.getRandomDigit)();
        next();
    });
});
const Player = mongoose_1.default.model('User', playerSchema);
exports.default = Player;
//# sourceMappingURL=user.model.js.map