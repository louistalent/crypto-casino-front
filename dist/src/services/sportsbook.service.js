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
const user_model_1 = __importDefault(require("../models/user.model"));
const gametransaction_model_1 = __importDefault(require("../models/gametransaction.model"));
const gamelist_model_1 = __importDefault(require("../models/gamelist.model"));
// betsy API info
const gameId = {
    gameid: 'sports_15325',
    providerid: '6286521bae381d04f10f6d24'
};
const profile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (token.length > 20) {
        return {
            profile: {
                code: 3,
                message: 'An invalid token.'
            },
            status: 401
        };
    }
    const tokenUpdate = Number(token.replace(/\D/g, ''));
    const user = yield user_model_1.default.findOne({
        id: tokenUpdate
    });
    if (user) {
        let returnData = {
            userId: user.id.toString(),
            currency: user.currency,
            currencies: ['TND', 'EUR'],
            isTest: false,
            customFields: {
                nickname: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                birthday: user.birthday,
                gender: 'female',
                phone: user.phonenumber,
                isCashOutAllowed: true,
                operatorUser: '1234',
                isVerified: true,
                userCountry: 'GB',
                userStatus: 'positive',
                userSessionIp: user.ip,
                userSessionCountry: 'GB',
                registrationDate: user.createdAt,
                percentMargin: 13.2,
                avgBet: 12,
                isAbuser: 1,
                isVIP: 1
            }
        };
        return { profile: returnData, status: 200 };
    }
    else {
        return {
            profile: {
                code: 3,
                message: 'An invalid token.'
            },
            status: 401
        };
    }
});
const verifyParams = (req, res, next) => {
    const header = req.headers;
    if (!header['x-sign'] || !header['x-sign-jws']) {
        return res.status(401).json({
            code: 1,
            message: 'Request signature is invalid. Read this section to learn how to sign the request.'
        });
    }
    next();
};
const balance = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (isNaN(Number(data.userId))) {
        return {
            status: 400,
            profile: {
                code: 2,
                message: 'The user is not found.'
            }
        };
    }
    const userdata = yield user_model_1.default.findOne({
        id: Number(data.userId)
    });
    if (!userdata) {
        return {
            profile: {
                code: 2,
                message: 'The user is not found.'
            },
            status: 400
        };
    }
    const { token } = req.body;
    if (token.length > 20) {
        return {
            profile: {
                code: 3,
                message: 'An invalid token.'
            },
            status: 401
        };
    }
    const tokenUpdate = Number(token.replace(/\D/g, ''));
    const user = yield user_model_1.default.findOne({
        id: tokenUpdate
    });
    if (!user) {
        return {
            profile: {
                code: 3,
                message: 'An invalid token.'
            },
            status: 401
        };
    }
    if (!userdata.currency || userdata.currency !== data.currency) {
        return {
            status: 400,
            profile: {
                code: 5,
                message: 'A request data error.'
            }
        };
    }
    let returnData = {
        userId: data.userId.toString(),
        currency: data.currency,
        amount: Number(userdata.balance) + Number(userdata.bonusbalnace)
    };
    console.log(returnData, '--balance--');
    return {
        profile: returnData,
        status: 200
    };
});
const bet = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { token } = req.body;
    console.log(req.body, '--bet start --');
    if (token.length > 20) {
        return {
            profile: {
                code: 3,
                message: 'An invalid token.'
            },
            status: 401
        };
    }
    let details = req.body.metadata && req.body.metadata.length ? req.body.metadata[0] : {};
    if (isNaN(Number(data.userId))) {
        return {
            status: 400,
            profile: {
                code: 2,
                message: 'The user is not found.'
            }
        };
    }
    const userdata = yield user_model_1.default.findOne({
        id: Number(data.userId)
    });
    if (!userdata) {
        return {
            status: 400,
            profile: {
                code: 2,
                message: 'The user is not found.'
            }
        };
    }
    if (!data.amount) {
        return {
            status: 400,
            profile: {
                code: 6,
                message: 'The bet amount is not set. This error triggers the Rollback.'
            }
        };
    }
    if (!data.currency) {
        return {
            status: 400,
            profile: {
                code: 5,
                message: 'A request data error.'
            }
        };
    }
    if (data.amount > Number(userdata.balance) + Number(userdata.bonusbalnace)) {
        return {
            status: 400,
            profile: {
                code: 7,
                message: 'Not enough money.'
            }
        };
    }
    if (userdata.currency !== data.currency) {
        return {
            status: 400,
            profile: {
                code: 5,
                message: 'A request data error.'
            }
        };
    }
    const prevsettle = yield gametransaction_model_1.default.findOne({
        transactionId: data.transactionId,
        'detail.resultType': 'BET'
    }).sort({ createdAt: -1 });
    if (prevsettle) {
        return {
            status: 400,
            profile: {
                code: 5,
                message: 'A request data error.'
            }
        };
    }
    const sportsGameId = yield gamelist_model_1.default.findOne({ gameid: gameId.gameid });
    console.log(sportsGameId, 'sportsGameId.sports');
    let betData = {
        amount: data.amount,
        user_id: userdata._id,
        transactionId: data.transactionId,
        user_credit: userdata.balance,
        currency: data.currency,
        type: data.type,
        game_id: sportsGameId._id,
        provider_id: sportsGameId.provider,
        detail: Object.assign(Object.assign({}, details), { transactiontime: new Date(Date.now() + 7000), resultType: 'BET', settled: false, requestId: data.requestId })
    };
    betData.detail.outcomeId += '';
    yield gametransaction_model_1.default.create(betData);
    console.log('--process0');
    yield balanceUpdate(userdata, data.amount, 'BET');
    return {
        profile: {
            transactionId: data.transactionId,
            transactionTime: new Date()
        },
        status: 200
    };
});
const balanceUpdate = (user, amount, type) => __awaiter(void 0, void 0, void 0, function* () {
    let updateBal = 0;
    console.log(amount, '--amount--');
    console.log(type, 'balance updated');
    if (type == 'BET') {
        updateBal = Number(amount) * -1;
        // updateBal = parseFloat(user.balance.toString()) - parseFloat(amount);
    }
    else if (type == 'cashout') {
        updateBal = Number(amount);
        // updateBal = parseFloat(user.balance.toString()) + parseFloat(amount);
    }
    console.log(updateBal, '--updateBal--');
    // await prisma.user.update({
    //     where: {
    //         id: user.id
    //     },
    //     data: {
    //         balance: updateBal
    //     }
    // });
    yield user_model_1.default.findOneAndUpdate({ _id: user._id }, {
        $inc: {
            balance: updateBal
        }
        // balance: { $inc: updateBal }
    });
});
const settledBet = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    // console.log(data.userId, '--data.userId---');
    if (isNaN(Number(data.userId))) {
        return {
            status: 400,
            profile: {
                code: 2,
                message: 'The user is not found.'
            }
        };
    }
    const userdata = yield user_model_1.default.findOne({
        id: Number(data.userId)
    });
    if (!userdata) {
        return {
            status: 400,
            profile: {
                code: 2,
                message: 'The user is not found.'
            }
        };
    }
    const prevBet = yield gametransaction_model_1.default.findOne({
        transactionId: data.transactionId,
        'detail.resultType': 'BET'
    });
    if (!prevBet) {
        return {
            status: 400,
            profile: {
                code: 5,
                message: 'A request data error.'
            }
        };
    }
    switch (data.type) {
        case 1:
            return unsettlechild(req, prevBet);
        case 2:
            return settlechild(req, prevBet);
        case 3:
            return rollbackchild(req, prevBet);
    }
});
const unsettlechild = (req, prevBet) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    let resultType = 'unsettle';
    const prevsettle = yield gametransaction_model_1.default.findOne({
        transactionId: data.transactionId,
        'detail.settled': true
    }).sort({ createdAt: -1 });
    if (!prevsettle) {
        return {
            status: 400,
            profile: {
                code: 5,
                message: 'A request data error.'
            }
        };
    }
    const userdata = yield user_model_1.default.findOne({
        id: Number(data.userId)
    });
    const sportsGameId = yield gamelist_model_1.default.findOne({ gameid: gameId.gameid });
    let betData = {
        transactionId: data.transactionId,
        currency: data.currency,
        amount: data.amount,
        user_id: userdata._id,
        type: data.type,
        user_credit: userdata.balance,
        game_id: sportsGameId._id,
        provider_id: sportsGameId.provider,
        detail: Object.assign(Object.assign({}, prevBet.detail), { coefficient: data.coefficient, resultType: resultType, settled: true, gameType: data.gameType })
    };
    yield gametransaction_model_1.default.create(betData);
    let amount = 0;
    if (prevsettle) {
        if (prevsettle.detail.resultType == 'won') {
            amount = -prevsettle.amount;
        }
        else if (prevsettle.detail.resultType == 'refund') {
            amount = -prevBet.amount;
        }
        else {
            amount = prevsettle.amount;
        }
    }
    else {
        amount = -data.amount;
    }
    // console.log('--process1');
    yield balanceUpdate(userdata, amount, 'cashout');
    return {
        status: 200,
        profile: {
            transactionId: data.transactionId,
            transactionTime: new Date()
        }
    };
});
const settlechild = (req, prevBet) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    let resultType = data.resultType;
    const prevsettle = yield gametransaction_model_1.default.findOne({
        transactionId: data.transactionId,
        'detail.settled': true
    }).sort({ createdAt: -1 });
    // console.log(prevsettle, '--prevsettle---');
    const userdata = yield user_model_1.default.findOne({
        id: Number(data.userId)
    });
    const sportsGameId = yield gamelist_model_1.default.findOne({ gameid: gameId.gameid });
    let betData = {
        transactionId: data.transactionId,
        currency: data.currency,
        amount: data.amount,
        user_id: userdata._id,
        type: data.type,
        game_id: sportsGameId._id,
        provider_id: sportsGameId.provider,
        user_credit: userdata.balance,
        detail: Object.assign(Object.assign({}, prevBet.detail), { coefficient: data.coefficient, resultType: data.resultType, settled: true, gameType: data.gameType })
    };
    yield gametransaction_model_1.default.create(betData);
    if (resultType == 'refund') {
        let amount = 0;
        if (prevsettle) {
            if (prevsettle.detail.resultType == 'lose') {
                amount = prevBet.amount;
            }
            else {
                amount = data.amount - prevsettle.amount;
            }
        }
        else {
            amount = data.amount;
        }
        yield balanceUpdate(userdata, amount, 'cashout');
        return {
            status: 200,
            profile: {
                transactionId: data.transactionId,
                transactionTime: new Date()
            }
        };
    }
    else if (resultType == 'won') {
        let amount = 0;
        if (prevsettle) {
            if (prevsettle.detail.resultType == 'refund') {
                amount = data.amount - prevBet.amount;
            }
            else if (prevsettle.detail.resultType == 'lost') {
                amount = data.amount;
            }
            else if (prevsettle.detail.resultType == 'unsettle') {
                amount = data.amount;
            }
            else if (prevsettle.detail.resultType == 'won') {
                amount = data.amount - prevsettle.amount;
            }
            else {
                amount = data.amount;
            }
        }
        else {
            amount = data.amount;
        }
        yield balanceUpdate(userdata, amount, 'cashout');
        return {
            status: 200,
            profile: {
                transactionId: data.transactionId,
                transactionTime: new Date()
            }
        };
    }
    else if (resultType == 'cashout') {
        yield balanceUpdate(userdata, data.amount, 'cashout');
        return {
            status: 200,
            profile: {
                transactionId: data.transactionId,
                transactionTime: new Date()
            }
        };
    }
    else if (resultType == 'lost') {
        let amount = 0;
        if (prevsettle) {
            amount = -data.amount - prevsettle.amount;
        }
        else {
            amount = -data.amount;
        }
        yield balanceUpdate(userdata, amount, 'cashout');
        return {
            status: 200,
            profile: {
                transactionId: data.transactionId,
                transactionTime: new Date()
            }
        };
    }
});
const rollbackchild = (req, prevBet) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    let resultType = 'rollback';
    const prevsettle = yield gametransaction_model_1.default.findOne({
        transactionId: data.transactionId,
        'detail.settled': true
    }).sort({ createdAt: -1 });
    if (prevsettle) {
        return {
            status: 400,
            profile: {
                code: 5,
                message: 'A request data error.'
            }
        };
    }
    const userdata = yield user_model_1.default.findOne({
        id: Number(data.userId)
    });
    const sportsGameId = yield gamelist_model_1.default.findOne({ gameid: gameId.gameid });
    let betData = {
        transactionId: data.transactionId,
        currency: data.currency,
        amount: data.amount,
        user_id: userdata._id,
        type: data.type,
        game_id: sportsGameId._id,
        provider_id: sportsGameId.provider,
        user_credit: userdata.balance,
        detail: Object.assign(Object.assign({}, prevBet.detail), { settled: true, resultType: resultType })
    };
    let rdata = yield gametransaction_model_1.default.create(betData);
    if (!rdata) {
        return {
            status: 400,
            profile: {
                code: 5,
                message: 'A request data error.'
            }
        };
    }
    yield balanceUpdate(userdata, data.amount, 'cashout');
    return {
        status: 200,
        profile: {
            transactionId: data.transactionId,
            transactionTime: new Date()
        }
    };
});
const betcheck = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (isNaN(Number(data.userId))) {
        return {
            status: 400,
            profile: {
                code: 2,
                message: 'The user is not found.'
            }
        };
    }
    const userdata = yield user_model_1.default.findOne({
        id: Number(data.userId)
    });
    if (!userdata) {
        return {
            status: 400,
            profile: {
                code: 2,
                message: 'The user is not found.'
            }
        };
    }
    if (data.transactionId) {
        const prevsettle = yield gametransaction_model_1.default.findOne({
            transactionId: data.transactionId
        }).sort({ createdAt: -1 });
        if (prevsettle) {
            return {
                status: 200,
                profile: {
                    transactionId: prevsettle.transactionId,
                    currency: 'TND',
                    amount: prevsettle.amount,
                    transactionTime: prevsettle.detail.transactiontime,
                    type: Number(prevsettle.type)
                }
            };
        }
        else {
            return {
                status: 400,
                profile: {
                    code: 5,
                    message: 'A request data error.'
                }
            };
        }
    }
    else {
        return {
            status: 400,
            profile: {
                code: 5,
                message: 'A request data error.'
            }
        };
    }
});
exports.default = {
    profile,
    verifyParams,
    balance,
    bet,
    settledBet,
    betcheck
};
//# sourceMappingURL=sportsbook.service.js.map