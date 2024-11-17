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
const provider_model_1 = __importDefault(require("../models/provider.model"));
const gamelist_model_1 = __importDefault(require("../models/gamelist.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const gametransaction_model_1 = __importDefault(require("../models/gametransaction.model"));
const categories_model_1 = __importDefault(require("../models/categories.model"));
const jackpot_model_1 = __importDefault(require("../models/jackpot.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
// const Gamelist = require("../models/")
const axios = require('axios');
const https = require('https');
const TOKEN = 'gamblix';
const KEY = '7H8Fih3h5NU11xHa';
const GROUPID = 6883;
const ENDPOINT = `https://zeus.vdcgaming.net/api`;
const initGames = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios.get(`${ENDPOINT}/game_list?token=${TOKEN}&key=${KEY}`, {
        params: {
            token: TOKEN,
            key: KEY
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    let items = response.data.software;
    for (let i in items) {
        let games = [];
        let proitem = yield provider_model_1.default.findOneAndUpdate({ name: i }, { name: i }, { upsert: true, new: true });
        for (let j in items[i]) {
            let gameitem = items[i][j];
            games.push({
                name: gameitem.name,
                status: true,
                device: gameitem.platform,
                image: gameitem.icon,
                category: gameitem.type,
                gameid: gameitem.gid,
                provider: proitem._id
            });
        }
        // games.push({
        //     name: 'Sports',
        //     status: true,
        //     device: 'All',
        //     image: '',
        //     category: 'SportsBook',
        //     gameid: '',
        //     provider: 'BETSY'
        // });
        yield gamelist_model_1.default.deleteMany({ provider: proitem._id });
        yield gamelist_model_1.default.insertMany(games);
    }
    return false;
    // } catch (error) {
    //     console.error(error);
    // }
});
const sportsinitGames = () => __awaiter(void 0, void 0, void 0, function* () {
    const res_category = yield categories_model_1.default.findOne({ name: 'SPORT' });
    let games = [];
    const proitem = yield provider_model_1.default.findOneAndUpdate({ name: 'Sports' }, { name: 'Sports', categoryId: res_category._id, service: 'betsy', status: true }, { upsert: true, new: true });
    games.push({
        name: 'Sports',
        status: true,
        device: 'all',
        image: '',
        category: 'SportsBook',
        gameid: 'sports_15325',
        provider: proitem._id,
        sevice: 'betsy'
    });
    yield gamelist_model_1.default.deleteMany({ provider: proitem._id });
    yield gamelist_model_1.default.insertMany(games);
    console.log('sports game insert success');
    return true;
});
const provider = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield categories_model_1.default.findOne({ key: data.name });
    let pids = [];
    if (category) {
        const providerse = yield provider_model_1.default.find({ categoryId: category._id, status: true });
        pids = providerse.map((item) => item._id);
    }
    let array = yield gamelist_model_1.default.aggregate([
        {
            $match: {
                status: true,
                provider: { $in: pids },
                // sevice: 'multigames',
                device: { $in: ['desktop', 'all'] }
            }
        },
        {
            $group: {
                _id: '$provider',
                count: {
                    $sum: 1
                }
            }
        },
        {
            $lookup: {
                from: 'providers',
                localField: '_id',
                foreignField: '_id',
                as: 'provider'
            }
        },
        {
            $unwind: '$provider'
        },
        {
            $project: {
                title: '$provider.name',
                gameCount: '$count'
            }
        },
        {
            $sort: {
                title: 1
            }
        }
    ]);
    return array;
});
const gamelist = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield categories_model_1.default.findOne({ key: data.title });
    let pids = [];
    if (category) {
        const providerse = yield provider_model_1.default.find({ categoryId: category._id, status: true });
        pids = providerse.map((item) => item._id);
    }
    if (pids[0]) {
        let array = yield gamelist_model_1.default.find({
            device: { $in: ['desktop', 'all'] },
            // sevice: 'multigames',
            provider: { $in: pids[0] },
            status: true
        }).populate('provider');
        return array;
    }
    else {
        return [];
    }
});
const eachgameget = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const providerse = yield provider_model_1.default.findOne({ name: data.id, status: true });
    if (providerse) {
        let array = yield gamelist_model_1.default.find({
            device: { $in: ['desktop', 'all'] },
            // sevice: 'multigames',
            provider: { $in: providerse._id },
            status: true
        }).populate('provider');
        return array;
    }
    else {
        return [];
    }
});
const allgameget = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield categories_model_1.default.findOne({ key: data.title });
    let pids = [];
    if (category) {
        const providerse = yield provider_model_1.default.find({ categoryId: category._id, status: true });
        pids = providerse.map((item) => item._id);
    }
    let array = yield gamelist_model_1.default.find({
        device: { $in: ['desktop', 'all'] },
        // sevice: 'multigames',
        provider: { $in: pids },
        status: true
    }).populate('provider');
    return array;
});
const openGame = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const reqParams = {
        token: TOKEN,
        key: KEY,
        group_id: GROUPID,
        user_id: user.username,
        game_id: data.gameId,
        software: data.title.toLowerCase()
    };
    const response = yield axios.get(`${ENDPOINT}/open_session`, {
        params: reqParams,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    const res = response.data;
    if (res.err === 'ok') {
        return res.game_link;
    }
});
const callbackget = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        username: data.userId
    });
    return '' + user.balance + '';
});
const callbackpost = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        username: data.userId
    });
    const game_link = yield gamelist_model_1.default.findOne({
        gameid: data.gameId
    });
    const betData = {
        amount: data.bet,
        user_id: user._id,
        detail: {
            resultType: data.gameAct
        },
        game_id: game_link._id,
        provider_id: game_link.provider,
        user_credit: user.balance,
        transactionId: data.transId,
        currency: 'TND'
    };
    const updateBal = parseFloat(user.balance.toString()) + parseFloat(data.win) - parseFloat(data.bet);
    betData.after_credit = updateBal;
    yield gametransaction_model_1.default.create(betData);
    yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: parseFloat(updateBal.toFixed(2)) }, { upsert: true, new: true });
    return 'ok';
});
const gamehistory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let array = yield gametransaction_model_1.default.find({ user_id: data._id })
        .populate('game_id', 'name')
        .populate('provider_id', 'name')
        .sort({ createdAt: -1 });
    return array;
});
const getJackpot = () => __awaiter(void 0, void 0, void 0, function* () {
    const jackpot = yield jackpot_model_1.default.findOne({});
    return jackpot;
});
const getmessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield message_model_1.default.find({ $or: [{ from_id: data._id }, { to_id: data._id }] })
        .populate('from_id', 'username')
        .populate('to_id', 'username')
        .sort({
        createdAt: -1
    });
    return message;
});
const isReadMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield message_model_1.default.updateMany({ $or: [{ from_id: data._id }, { to_id: data._id }] }, { isUnRead: false });
    return 'success';
});
const categoryProviderChange = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categories_model_1.default.findOne({ name: 'Casino' });
    if (result) {
        yield provider_model_1.default.updateMany({}, { $set: { categoryId: result._id } });
        return 'success';
    }
    else {
        return 'fail';
    }
});
const searchGame = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield categories_model_1.default.findOne({ key: data.category });
    let pids = [];
    if (category) {
        const providerse = yield provider_model_1.default.find({ categoryId: category._id, status: true });
        pids = providerse.map((item) => item._id);
    }
    // if (pids[0]) {
    console.log(data);
    let array = yield gamelist_model_1.default.find({
        device: { $in: ['desktop', 'all'] },
        // sevice: 'multigames',
        provider: { $in: pids },
        status: true,
        name: {
            $regex: data.name,
            $options: 'i'
        }
    }).populate('provider');
    return array;
    // } else {
    //     return [];
    // }
});
const opengame = (user) => __awaiter(void 0, void 0, void 0, function* () {
    function generateToken() {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let token = user === null || user === void 0 ? void 0 : user.id;
        // Generate 10 random English characters
        for (let i = 0; i < 4; i += 1) {
            const randomChar = characters[Math.floor(Math.random() * characters.length)];
            token += randomChar;
        }
        return token;
    }
    const token = generateToken();
    const url = `https://stage.sportbook.work/?locale=fr&cid=gamblix-stage&token=${token}&customStyles=https://www.areadev.pro/sports.css`;
    console.log(url);
    return url;
});
exports.default = {
    initGames,
    provider,
    gamelist,
    allgameget,
    openGame,
    callbackget,
    callbackpost,
    gamehistory,
    sportsinitGames,
    getJackpot,
    getmessage,
    isReadMessage,
    categoryProviderChange,
    searchGame,
    eachgameget,
    opengame
    // livegamelist,
    // virtualgamelist,
    // callback,
};
//# sourceMappingURL=casino.service.js.map