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
const jackpothistory_model_1 = __importDefault(require("../models/jackpothistory.model"));
const axios = require('axios');
const https = require('https');
const TOKEN = 'areadev';
const KEY = 'ZH66641MmaiykTnE';
const ENDPOINT = `https://api.riseupgames.net`;
const initGames = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios.get(`${ENDPOINT}/games/${TOKEN}`, {
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    const res_category = yield categories_model_1.default.findOne({ key: 'casino' });
    let items = response.data.data;
    for (let i in items) {
        let games = [];
        let proitem = yield provider_model_1.default.findOneAndUpdate({ name: items[i].provider }, { name: items[i].provider, categoryId: res_category._id, service: 'riseup', status: true }, { upsert: true, new: true });
        for (let j in items[i].games) {
            let gameitem = items[i].games[j];
            games.push({
                name: gameitem.name,
                status: true,
                device: gameitem.device,
                image: gameitem.imgUrl,
                category: gameitem.type,
                gameid: gameitem.id,
                provider: proitem._id,
                sevice: 'riseup'
            });
        }
        console.log(games, 'games');
        yield gamelist_model_1.default.deleteMany({ provider: proitem._id });
        yield gamelist_model_1.default.insertMany(games);
    }
    return response.data.data;
});
const openGame = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data, '--opengame data--');
    const datas = {
        userID: user._id,
        username: user.username,
        gameID: data.gameId,
        token: String(user.id),
        currency: 'TND',
        language: 'en',
        maxBet: 0,
        betLimnit: 0
    };
    const username = TOKEN;
    const password = KEY;
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${ENDPOINT}/${data.title}/session/new`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' +
                Buffer.from(username + ':' + password)
                    .toString('base64')
                    .trimEnd()
        },
        data: JSON.stringify(datas)
    };
    console.log('req.dats.dats.dta.url', config);
    const res = yield axios.request(config);
    console.log(res, 'req.dats.dats.dta.url', config);
    return res.data;
    // if (res.err === 'ok') {
    //     return res.game_link;
    // }
});
const getBalance = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        id: Number(body.token)
    });
    if (user) {
        let data = JSON.stringify({
            status: true,
            balance: Number(user.balance) + Number(user.bonusbalnace),
            error: ''
        });
        if (Number(user.balance) <= 0) {
            data = JSON.stringify({
                status: true,
                balance: Number(user.bonusbalnace),
                error: ''
            });
        }
        console.log(data, '--riseup.data', user.bonusbalnace, '--userbalance--', user.balance);
        return data;
    }
    else {
        return JSON.stringify({ status: false, balance: 0, error: 'Internal Error' });
    }
});
const setPlay = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        id: Number(body.token)
    });
    if (user) {
        console.log(body, 'req.setply');
        const game_link = yield gamelist_model_1.default.findOne({
            gameid: body.gameid
        });
        const TXID = yield gametransaction_model_1.default.find({ transactionId: body.tid });
        const newUpdateBal = parseFloat(user.balance.toString()) +
            parseFloat(user.bonusbalnace.toString()) +
            parseFloat(body.win) -
            parseFloat(body.bet);
        if (body.type === 'REFUND') {
            if (TXID.length === 1) {
                const betData = {
                    amount: body.amount,
                    user_id: user._id,
                    detail: {
                        resultType: body.type
                    },
                    game_id: game_link._id,
                    provider_id: game_link.provider,
                    user_credit: user.balance,
                    transactionId: body.tid,
                    currency: 'TND'
                };
                let updateBal = 0;
                updateBal = parseFloat(user.balance.toString()) + parseFloat(body.bet);
                betData.after_credit = updateBal;
                yield gametransaction_model_1.default.create(betData);
                yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: parseFloat(updateBal.toFixed(2)) }, { upsert: true, new: true });
                return {
                    status: true,
                    balance: newUpdateBal,
                    referenceTID: body.tid,
                    error: ''
                };
            }
            else if (TXID.length > 0) {
                return JSON.stringify({
                    status: false,
                    error: 'Transaction Already Refund'
                });
            }
            else {
                return JSON.stringify({
                    status: false,
                    error: 'Transaction Not Exist'
                });
            }
        }
        else {
            if (TXID.length > 0) {
                return JSON.stringify({ status: false, balance: 0, referenceTID: '', error: 'Transaction is unique' });
            }
            else {
                const betData = {
                    amount: body.amount,
                    user_id: user._id,
                    detail: {
                        resultType: body.type
                    },
                    game_id: game_link._id,
                    provider_id: game_link.provider,
                    user_credit: user.balance,
                    transactionId: body.tid,
                    currency: 'TND'
                };
                if (body.type === 'BET') {
                    jackpot(body.amount, game_link, user);
                }
                else if (body.type === 'BETWIN') {
                    if (body.bet > body.win) {
                        jackpot(body.amount, game_link, user);
                    }
                }
                console.log(body.amount, user.balance);
                let updateBal = parseFloat(user.balance.toString()) + parseFloat(body.win) - parseFloat(body.bet);
                if (user.balance > body.bet) {
                    yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: parseFloat(updateBal.toFixed(2)) }, { upsert: true, new: true });
                }
                else {
                    if (body.bet > body.win) {
                        updateBal =
                            parseFloat(user.balance.toString()) +
                                parseFloat(user.bonusbalnace.toString()) +
                                parseFloat(body.win) -
                                parseFloat(body.bet);
                        yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: 0, bonusbalnace: parseFloat(updateBal.toFixed(2)) }, { upsert: true, new: true });
                    }
                    else {
                        updateBal = parseFloat(user.balance.toString()) + parseFloat(body.win) - parseFloat(body.bet);
                        yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: parseFloat(updateBal.toFixed(2)) }, { upsert: true, new: true });
                    }
                }
                betData.after_credit = updateBal;
                yield gametransaction_model_1.default.create(betData);
                return {
                    status: true,
                    balance: newUpdateBal,
                    referenceTID: body.tid,
                    error: ''
                };
            }
        }
    }
    else {
        return JSON.stringify({ status: false, balance: 0, referenceTID: '', error: 'User token not exist' });
    }
});
const jackpot = (amount, game, user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield provider_model_1.default.findOne({ _id: game.provider }).populate('categoryId');
    if (result.categoryId.key === 'casinovip' || result.categoryId.key === 'casino') {
        const jackpotResult = yield jackpot_model_1.default.findOne({});
        const shop = yield user_model_1.default.findOne({ id: user.parent_id });
        const changeBalnace = jackpotResult.fee * amount;
        console.log(jackpotResult, jackpotResult.silverValue + changeBalnace, '---------------------changeBalance riseup.casino---------------------', user.balance);
        if (jackpotResult.silverValue + changeBalnace === user.balance) {
            const betData = {
                amount: jackpotResult.silverValue + changeBalnace,
                jackpot: 'silver',
                user_name: user.name,
                user_id: user._id,
                shop_name: shop.name
            };
            yield jackpothistory_model_1.default.create(betData);
            yield user_model_1.default.findOneAndUpdate({ _id: user._id }, {
                $inc: {
                    balance: jackpotResult.silverValue + changeBalnace
                }
            });
            yield jackpot_model_1.default.updateOne({}, {
                $set: {
                    silverValue: jackpotResult.silver.startvalue,
                    goldValue: jackpotResult.gold.startvalue,
                    platinumValue: jackpotResult.platinum.startvalue
                }
            });
        }
        else if (jackpotResult.goldValue + changeBalnace === user.balance) {
            const betData = {
                amount: jackpotResult.silverValue + changeBalnace,
                jackpot: 'silver',
                user_name: user.name,
                user_id: user._id,
                shop_name: shop.name
            };
            yield jackpothistory_model_1.default.create(betData);
            yield user_model_1.default.findOneAndUpdate({ _id: user._id }, {
                $inc: {
                    balance: jackpotResult.goldValue + changeBalnace
                }
            });
            yield jackpot_model_1.default.updateOne({}, {
                $set: {
                    silverValue: jackpotResult.silver.startvalue,
                    goldValue: jackpotResult.gold.startvalue,
                    platinumValue: jackpotResult.platinum.startvalue
                }
            });
        }
        else if (jackpotResult.platinumValue + changeBalnace === user.balance) {
            const betData = {
                amount: jackpotResult.silverValue + changeBalnace,
                jackpot: 'silver',
                user_name: user.name,
                user_id: user._id,
                shop_name: shop.name
            };
            yield jackpothistory_model_1.default.create(betData);
            yield user_model_1.default.findOneAndUpdate({ _id: user._id }, {
                $inc: {
                    balance: jackpotResult.platinumValue + changeBalnace
                }
            });
            yield jackpot_model_1.default.updateOne({}, {
                $set: {
                    silverValue: jackpotResult.silver.startvalue,
                    goldValue: jackpotResult.gold.startvalue,
                    platinumValue: jackpotResult.platinum.startvalue
                }
            });
        }
        else {
            yield jackpot_model_1.default.findOneAndUpdate({}, {
                $inc: {
                    silverValue: changeBalnace,
                    goldValue: changeBalnace,
                    platinumValue: changeBalnace
                }
            });
        }
    }
});
exports.default = {
    initGames,
    openGame,
    getBalance,
    setPlay
};
//# sourceMappingURL=riseup.casino.service.js.map