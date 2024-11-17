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
const TOKEN = 'd6af2ee9293840239f542ad30d7563e8';
const KEY = 'cb40369fb2e245ca9b4403780e1c49a7';
const ENDPOINT = `https://apiv2.gitslotpark.com`;
const AGENTID = 'stefano';
const initGames = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios.get(`${ENDPOINT}/gamelist/`, {
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    });
    const res_category = yield categories_model_1.default.findOne({ key: 'casino' });
    let items = response.data.data;
    let games = [];
    for (let i in items) {
        let proitem = yield provider_model_1.default.findOneAndUpdate({ name: items[i].vendorid, service: 'Loginx Games' }, { name: items[i].vendorid, categoryId: res_category._id, service: 'Loginx Games', status: true }, { upsert: true, new: true });
        games.push({
            name: items[i].name,
            status: true,
            device: 'all',
            image: items[i].iconurl2,
            category: 'slot',
            gameid: items[i].gameid,
            provider: proitem._id,
            sevice: 'riseup-pragmatic'
        });
        yield gamelist_model_1.default.deleteMany({ provider: proitem._id });
    }
    yield gamelist_model_1.default.insertMany(games);
    return items;
});
const openGame = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const datas = {
        agentID: AGENTID,
        userID: user.id,
        gameid: data.gameId,
        lang: 'en',
        lobbyUrl: '#'
    };
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${ENDPOINT}/userAuth`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`
        },
        data: JSON.stringify(datas)
    };
    const res = yield axios.request(config);
    return res.data;
});
const getBalance = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        id: Number(body.userID)
    });
    if (user) {
        let data = JSON.stringify({
            code: 0,
            message: '',
            balance: Number(user.balance) + Number(user.bonusbalnace)
        });
        if (Number(user.balance) <= 0) {
            data = JSON.stringify({
                code: 0,
                message: '',
                balance: Number(user.bonusbalnace)
            });
        }
        console.log(data, '--riseup.pragmatic.data', user.bonusbalnace, '--userbalance--', user.balance);
        return data;
    }
    else {
        return JSON.stringify({ code: 5, balance: 0, message: 'Internal Error' });
    }
});
const betWin = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        id: Number(body.userID)
    });
    if (user) {
        console.log(body, 'req.betWin');
        const game_link = yield gamelist_model_1.default.findOne({
            gameid: body.gameID
        });
        const TXID = yield gametransaction_model_1.default.find({ transactionId: body.transactionID });
        const newUpdateBal = parseFloat(user.balance.toString()) +
            parseFloat(user.bonusbalnace.toString()) +
            parseFloat(body.winAmount) -
            parseFloat(body.betAmount);
        if (TXID.length > 0) {
            return JSON.stringify({ code: 5, balance: 0, message: 'Transaction is unique' });
        }
        else {
            let betType = 'BET';
            let txAmount = 0;
            if (body.winAmount > body.betAmount) {
                txAmount = parseFloat(body.winAmount) - parseFloat(body.betAmount);
                betType = 'WIN';
            }
            else {
                txAmount = parseFloat(body.betAmount) - parseFloat(body.winAmount);
            }
            const betData = {
                amount: txAmount,
                user_id: user._id,
                detail: {
                    resultType: betType
                },
                game_id: game_link._id,
                provider_id: game_link.provider,
                user_credit: user.balance,
                transactionId: body.transactionID,
                currency: 'TND'
            };
            if (betType === 'BET') {
                jackpot(txAmount, game_link, user);
            }
            else if (body.type === 'WIN') {
                jackpot(txAmount, game_link, user);
            }
            let updateBal = parseFloat(user.balance.toString()) + parseFloat(body.winAmount) - parseFloat(body.betAmount);
            if (user.balance > body.betAmount) {
                yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: parseFloat(updateBal.toFixed(2)) }, { upsert: true, new: true });
            }
            else {
                if (body.bet > body.winAmount) {
                    updateBal =
                        parseFloat(user.balance.toString()) +
                            parseFloat(user.bonusbalnace.toString()) +
                            parseFloat(body.winAmount) -
                            parseFloat(body.betAmount);
                    yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: 0, bonusbalnace: parseFloat(updateBal.toFixed(2)) }, { upsert: true, new: true });
                }
                else {
                    updateBal =
                        parseFloat(user.balance.toString()) + parseFloat(body.winAmount) - parseFloat(body.betAmount);
                    yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: parseFloat(updateBal.toFixed(2)) }, { upsert: true, new: true });
                }
            }
            betData.after_credit = updateBal;
            yield gametransaction_model_1.default.create(betData);
            return {
                code: 0,
                balance: newUpdateBal,
                platformTansactionID: body.transactionID,
                message: ''
            };
        }
    }
    else {
        return JSON.stringify({ code: 5, balance: 0, message: 'User token not exist' });
    }
});
const withdraw = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        id: Number(body.userID)
    });
    if (user) {
        console.log(body, 'req.withdraw');
        const game_link = yield gamelist_model_1.default.findOne({
            gameid: body.gameID
        });
        const TXID = yield gametransaction_model_1.default.find({ transactionId: body.transactionID });
        const newUpdateBal = parseFloat(user.balance.toString()) + parseFloat(user.bonusbalnace.toString()) - parseFloat(body.amount);
        if (TXID.length > 0) {
            return JSON.stringify({ code: 5, balance: 0, message: 'Transaction is unique' });
        }
        else {
            let betType = 'BET';
            const betData = {
                amount: body.amount,
                user_id: user._id,
                detail: {
                    resultType: betType
                },
                game_id: game_link._id,
                provider_id: game_link.provider,
                user_credit: user.balance,
                transactionId: body.transactionID,
                currency: 'TND'
            };
            jackpot(body.amount, game_link, user);
            let updateBal = parseFloat(user.balance.toString()) - parseFloat(body.amount);
            if (user.balance > body.amount) {
                yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: parseFloat(updateBal.toFixed(2)) }, { upsert: true, new: true });
            }
            else {
                updateBal =
                    parseFloat(user.balance.toString()) +
                        parseFloat(user.bonusbalnace.toString()) +
                        parseFloat(body.amount);
                yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: 0, bonusbalnace: parseFloat(updateBal.toFixed(2)) }, { upsert: true, new: true });
            }
            betData.after_credit = updateBal;
            yield gametransaction_model_1.default.create(betData);
            return {
                code: 0,
                balance: newUpdateBal,
                platformTansactionID: body.transactionID,
                message: ''
            };
        }
    }
    else {
        return JSON.stringify({ code: 5, balance: 0, message: 'User token not exist' });
    }
});
const deposit = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        id: Number(body.userID)
    });
    if (user) {
        console.log(body, 'req.deposit');
        const game_link = yield gamelist_model_1.default.findOne({
            gameid: body.gameID
        });
        const TXID = yield gametransaction_model_1.default.find({ transactionId: body.transactionID });
        const newUpdateBal = parseFloat(user.balance.toString()) + parseFloat(user.bonusbalnace.toString()) - parseFloat(body.amount);
        if (TXID.length > 0) {
            return JSON.stringify({ code: 5, balance: 0, message: 'Transaction is unique' });
        }
        else {
            let betType = 'WIN';
            const betData = {
                amount: body.amount,
                user_id: user._id,
                detail: {
                    resultType: betType
                },
                game_id: game_link._id,
                provider_id: game_link.provider,
                user_credit: user.balance,
                transactionId: body.transactionID,
                currency: 'TND'
            };
            jackpot(body.amount, game_link, user);
            let updateBal = parseFloat(user.balance.toString()) + parseFloat(body.amount);
            yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: parseFloat(updateBal.toFixed(2)) }, { upsert: true, new: true });
            betData.after_credit = updateBal;
            yield gametransaction_model_1.default.create(betData);
            return {
                code: 0,
                balance: newUpdateBal,
                platformTansactionID: body.transactionID,
                message: ''
            };
        }
    }
    else {
        return JSON.stringify({ code: 5, balance: 0, message: 'User token not exist' });
    }
});
const rollback = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        id: Number(body.userID)
    });
    if (user) {
        console.log(body, 'req.setply');
        const game_link = yield gamelist_model_1.default.findOne({
            gameid: body.gameID
        });
        const TXID = yield gametransaction_model_1.default.find({ transactionId: body.refTransactionID });
        if (TXID.length === 1) {
            const betData = {
                amount: TXID.amount,
                user_id: user._id,
                detail: {
                    resultType: 'REFUND'
                },
                game_id: game_link._id,
                provider_id: game_link.provider,
                user_credit: user.balance,
                transactionId: body.refTransactionID,
                currency: 'TND'
            };
            let updateBal = 0;
            updateBal = parseFloat(user.balance.toString()) + parseFloat(TXID.amount);
            betData.after_credit = updateBal;
            yield gametransaction_model_1.default.create(betData);
            yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: parseFloat(updateBal.toFixed(2)) }, { upsert: true, new: true });
            return {
                code: 0,
                message: ''
            };
        }
        else if (TXID.length > 0) {
            return JSON.stringify({
                code: 11,
                message: 'Transaction Already Refund'
            });
        }
        else {
            return JSON.stringify({
                code: 11,
                message: 'Transaction Not Exist'
            });
        }
    }
    else {
        return JSON.stringify({ code: 5, balance: 0, message: 'User token not exist' });
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
    rollback,
    betWin,
    withdraw,
    deposit
};
//# sourceMappingURL=pragmatic.casino.service.js.map