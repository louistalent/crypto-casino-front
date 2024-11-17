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
const PORTAL_CODE = 'teg101_TND';
const KEY = 'a689c2b30e7bb49be6a842a429e32348';
const ENDPOINT = `https://api.multigames.xyz`;
const initGames = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios.get(`${ENDPOINT}/api/${PORTAL_CODE}/GetProviders`, {
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    const res_category = yield categories_model_1.default.findOne({ key: 'casino' });
    let items = response.data.data;
    let gameitems = [];
    for (let i in items) {
        let games = [];
        let proitem = yield provider_model_1.default.findOneAndUpdate({ id: items[i].id }, {
            name: items[i].nameId,
            status: true,
            id: items[i].id,
            title: items[i].title,
            categoryId: res_category._id,
            service: 'multigames'
        }, { upsert: true, new: true });
        const gameresult = yield axios.get(`${ENDPOINT}/api/${PORTAL_CODE}/GetGames/${items[i].id}`, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });
        gameitems = gameresult.data.data;
        for (let j in gameitems) {
            let gameitem = gameitems[j];
            let device = gameitem.supportMobile && gameitem.supportDesktop
                ? 'all'
                : gameitem.supportMobile
                    ? 'mobile'
                    : 'desktop';
            games.push({
                name: gameitem.title,
                status: true,
                device: device,
                image: gameitem.image,
                gameid: gameitem.id,
                provider: proitem._id,
                sevice: 'multigames'
            });
        }
        yield gamelist_model_1.default.deleteMany({ provider: proitem._id });
        yield gamelist_model_1.default.insertMany(games);
    }
    return true;
});
const openGame = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const reqParams = {
        auth: String(user._id),
        playerId: user.username,
        portalCode: PORTAL_CODE,
        gameId: data.gameId
    };
    const reqEndpoint = `${ENDPOINT}/?auth=${reqParams.auth}&playerId=${reqParams.playerId}&portalCode=${reqParams.portalCode}&gameId=${reqParams.gameId}`;
    console.log(reqEndpoint, 'multigames lunch url');
    return reqEndpoint;
});
const Authenticate = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        username: body.playerId
    });
    if (user) {
        console.log('req.body.Authenticate.multigames.success');
        return {
            code: 10,
            message: 'SUCCESS',
            balance: (Number(user.balance) + Number(user.bonusbalnace)) * 100,
            messageId: body.messageId,
            sign: body.sign
        };
    }
    else {
        console.log('req.body.Authenticate.multigames.success.PLAYER_NOT_FOUND');
        return {
            code: 22,
            message: 'PLAYER_NOT_FOUND',
            balance: 0,
            messageId: body.messageId,
            sign: body.sign
        };
    }
});
const getBalance = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        username: body.playerId
    });
    if (user) {
        console.log('req.body.getBalance.multigames.SUCCESS');
        return {
            code: 10,
            message: 'SUCCESS',
            balance: (Number(user.balance) + Number(user.bonusbalnace)) * 100,
            messageId: body.messageId,
            sign: body.sign
        };
    }
    else {
        console.log('req.body.getBalance.multigames.PLAYER_NOT_FOUND');
        return {
            code: 22,
            message: 'PLAYER_NOT_FOUND',
            balance: 0,
            messageId: body.messageId,
            sign: body.sign
        };
    }
});
const addBalnace = (balance, amount, type) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(amount, '---------------------req.addBalance.multigames------------------', type);
    let updateBalance = 0;
    if (type === 'BET') {
        updateBalance = balance - amount;
    }
    else if (type === 'ROLLBACK') {
        updateBalance = balance + amount;
    }
    else if (type === 'WIN') {
        updateBalance = balance + amount;
    }
    else if (type === 'REFUND') {
        updateBalance = balance + amount;
    }
    else {
        updateBalance = balance - amount;
    }
    return parseFloat(updateBalance.toFixed(2));
});
const withdraw = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        username: body.playerId
    });
    if (body.amount < 0) {
        return {
            code: 11,
            message: 'GENERAL_ERROR',
            balance: 0,
            messageId: body.messageId,
            sign: body.sign
        };
    }
    else if (body.currency !== 'TND') {
        return {
            code: 23,
            message: 'INVALID_CURRENCY',
            balance: 0,
            messageId: body.messageId,
            sign: body.sign
        };
    }
    if (user) {
        const game_link = yield gamelist_model_1.default.findOne({
            gameid: body.gameId
        });
        const TXID = yield gametransaction_model_1.default.find({ transactionId: body.transactionId });
        if (TXID.length > 0) {
            console.log('req.body.multigames.withdraw.DUPLICATE_TRANSACTION');
            return {
                code: 25,
                message: 'DUPLICATE_TRANSACTION',
                balance: 0,
                messageId: body.messageId,
                sign: body.sign
            };
        }
        else {
            const betData = {
                amount: body.amount / 100,
                user_id: user._id,
                detail: {
                    resultType: body.type
                },
                game_id: game_link._id,
                provider_id: game_link.provider,
                user_credit: user.balance,
                transactionId: body.transactionId,
                currency: 'TND'
            };
            jackpot(body.amount / 100, game_link, user);
            let updateBal = 0;
            if (body.type === 'BET' || body.type === 'REFUND') {
                if (body.amount / 100 > Number(user.balance)) {
                    updateBal = yield addBalnace(Number(user.bonusbalnace) + Number(user.balance), body.amount / 100, body.type);
                    yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: 0, bonusbalnace: updateBal }, { upsert: true, new: true });
                }
                else {
                    updateBal = yield addBalnace(Number(user.balance), body.amount / 100, body.type);
                    yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: updateBal }, { upsert: true, new: true });
                }
            }
            else {
                updateBal = yield addBalnace(Number(user.balance), body.amount / 100, body.type);
                yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: updateBal }, { upsert: true, new: true });
            }
            betData.after_credit = updateBal;
            yield gametransaction_model_1.default.create(betData);
            console.log('req.body.multigames.withdraw.SUCCESS');
            const newUpdateBal = yield addBalnace(Number(user.bonusbalnace) + Number(user.balance), body.amount / 100, body.type);
            return {
                code: 10,
                message: 'SUCCESS',
                balance: Number(newUpdateBal) * 100,
                transactionId: body.transactionId,
                messageId: body.messageId,
                sign: body.sign
            };
        }
    }
    else {
        console.log('req.body.multigames.withdraw.PLAYER_NOT_FOUND');
        return {
            code: 22,
            message: 'PLAYER_NOT_FOUND',
            balance: 0,
            messageId: body.messageId,
            sign: body.sign
        };
    }
});
const deposit = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        username: body.playerId
    });
    if (body.amount < 0) {
        return {
            code: 11,
            message: 'GENERAL_ERROR',
            balance: 0,
            messageId: body.messageId,
            sign: body.sign
        };
    }
    else if (body.currency !== 'TND') {
        return {
            code: 23,
            message: 'INVALID_CURRENCY',
            balance: 0,
            messageId: body.messageId,
            sign: body.sign
        };
    }
    if (user) {
        const game_link = yield gamelist_model_1.default.findOne({
            gameid: body.gameId
        });
        const TXID = yield gametransaction_model_1.default.find({ transactionId: body.transactionId });
        if (body.type === 'REFUND') {
            if (TXID.length === 1) {
                const betData = {
                    amount: body.amount / 100,
                    user_id: user._id,
                    detail: {
                        resultType: body.type
                    },
                    game_id: game_link._id,
                    provider_id: game_link.provider,
                    user_credit: user.balance,
                    transactionId: body.transactionId,
                    currency: 'TND'
                };
                const updateBal = yield addBalnace(Number(user.balance), body.amount / 100, body.type);
                betData.after_credit = updateBal;
                yield gametransaction_model_1.default.create(betData);
                const updateUser = yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: updateBal }, { upsert: true, new: true });
                console.log('req.body.multigames.deposit.SUCCESS');
                return {
                    code: 10,
                    message: 'SUCCESS',
                    balance: (Number(updateUser.balance) + Number(updateUser.bonusbalnace)) * 100,
                    transactionId: body.transactionId,
                    messageId: body.messageId,
                    sign: body.sign
                };
            }
            else if (TXID.length > 0) {
                console.log('req.body.multigames.deposit.DUPLICATE_TRANSACTION length 0');
                return {
                    code: 25,
                    message: 'DUPLICATE_TRANSACTION',
                    balance: 0,
                    messageId: body.messageId,
                    sign: body.sign
                };
            }
            else {
                console.log('req.body.multigames.deposit.DUPLICATE_TRANSACTION ');
                return {
                    code: 25,
                    message: 'DUPLICATE_TRANSACTION',
                    balance: 0,
                    messageId: body.messageId,
                    sign: body.sign
                };
            }
        }
        else {
            if (TXID.length > 0) {
                console.log('req.body.multigames.deposit.DUPLICATE_TRANSACTION length 0');
                return {
                    code: 25,
                    message: 'DUPLICATE_TRANSACTION',
                    balance: 0,
                    messageId: body.messageId,
                    sign: body.sign
                };
            }
            else {
                let bodyType = body.type;
                if (body.type === 'WIN' && body.amount === 0) {
                    bodyType = 'lost';
                }
                const betData = {
                    amount: body.amount / 100,
                    user_id: user._id,
                    detail: {
                        resultType: bodyType
                    },
                    game_id: game_link._id,
                    provider_id: game_link.provider,
                    user_credit: user.balance,
                    transactionId: body.transactionId,
                    currency: 'TND'
                };
                const updateBal = yield addBalnace(Number(user.balance), body.amount / 100, body.type);
                betData.after_credit = updateBal;
                yield gametransaction_model_1.default.create(betData);
                const updateUser = yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { balance: updateBal }, { upsert: true, new: true });
                console.log(body.amount, 'req.body.multigames.deposit.SUCCESS');
                return {
                    code: 10,
                    message: 'SUCCESS',
                    balance: (Number(updateUser.balance) + Number(updateUser.bonusbalnace)) * 100,
                    transactionId: body.transactionId,
                    messageId: body.messageId,
                    sign: body.sign
                };
            }
        }
    }
    else {
        console.log('req.body.multigames.deposit.PLAYER_NOT_FOUND');
        return {
            code: 22,
            message: 'PLAYER_NOT_FOUND',
            balance: 0,
            messageId: body.messageId,
            sign: body.sign
        };
    }
});
const jackpot = (amount, game, user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield provider_model_1.default.findOne({ _id: game.provider }).populate('categoryId');
    if (result.categoryId.key === 'casinovip' || result.categoryId.key === 'casino') {
        const jackpotResult = yield jackpot_model_1.default.findOne({});
        const shop = yield user_model_1.default.findOne({ id: user.parent_id });
        const changeBalnace = jackpotResult.fee * amount;
        console.log(jackpotResult, jackpotResult.silverValue + changeBalnace, '---------------------changeBalance multigames.casino---------------------', user.balance);
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
    Authenticate,
    getBalance,
    withdraw,
    deposit
};
//# sourceMappingURL=multigames.casino.service.js.map