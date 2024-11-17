import User from '../models/user.model';
import Gametransaction from '../models/gametransaction.model';
import Gamelist from '../models/gamelist.model';

// betsy API info

const gameId = {
    gameid: 'sports_15325',
    providerid: '6286521bae381d04f10f6d24'
};

const profile = async (req) => {
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

    const user = await User.findOne({
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
    } else {
        return {
            profile: {
                code: 3,
                message: 'An invalid token.'
            },
            status: 401
        };
    }
};

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

const balance = async (req: any) => {
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
    const userdata = await User.findOne({
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

    const user = await User.findOne({
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
};

const bet = async (req: any) => {
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
    const userdata = await User.findOne({
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

    const prevsettle = await Gametransaction.findOne({
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

    const sportsGameId: any = await Gamelist.findOne({ gameid: gameId.gameid });
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
        detail: {
            ...details,
            transactiontime: new Date(Date.now() + 7000),
            resultType: 'BET',
            settled: false,
            requestId: data.requestId
        }
    };

    betData.detail.outcomeId += '';
    await Gametransaction.create(betData);
    console.log('--process0');

    await balanceUpdate(userdata, data.amount, 'BET');

    return {
        profile: {
            transactionId: data.transactionId,
            transactionTime: new Date()
        },
        status: 200
    };
};

const balanceUpdate = async (user: any, amount: any, type: string) => {
    let updateBal = 0;
    console.log(amount, '--amount--');
    console.log(type, 'balance updated');
    if (type == 'BET') {
        updateBal = Number(amount) * -1;
        // updateBal = parseFloat(user.balance.toString()) - parseFloat(amount);
    } else if (type == 'cashout') {
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

    await User.findOneAndUpdate(
        { _id: user._id },
        {
            $inc: {
                balance: updateBal
            }
            // balance: { $inc: updateBal }
        }
    );
};

const settledBet = async (req: any) => {
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
    const userdata = await User.findOne({
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

    const prevBet = await Gametransaction.findOne({
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
};

const unsettlechild = async (req: any, prevBet: any) => {
    const data = req.body;
    let resultType = 'unsettle';

    const prevsettle: any = await Gametransaction.findOne({
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

    const userdata = await User.findOne({
        id: Number(data.userId)
    });

    const sportsGameId: any = await Gamelist.findOne({ gameid: gameId.gameid });

    let betData = {
        transactionId: data.transactionId,
        currency: data.currency,
        amount: data.amount,
        user_id: userdata._id,
        type: data.type,
        user_credit: userdata.balance,
        game_id: sportsGameId._id,
        provider_id: sportsGameId.provider,
        detail: {
            ...prevBet.detail,
            coefficient: data.coefficient,
            resultType: resultType,
            settled: true,
            gameType: data.gameType
        }
    };

    await Gametransaction.create(betData);

    let amount = 0;

    if (prevsettle) {
        if (prevsettle.detail.resultType == 'won') {
            amount = -prevsettle.amount;
        } else if (prevsettle.detail.resultType == 'refund') {
            amount = -prevBet.amount;
        } else {
            amount = prevsettle.amount;
        }
    } else {
        amount = -data.amount;
    }
    // console.log('--process1');
    await balanceUpdate(userdata, amount, 'cashout');
    return {
        status: 200,
        profile: {
            transactionId: data.transactionId,
            transactionTime: new Date()
        }
    };
};

const settlechild = async (req: any, prevBet: any) => {
    const data = req.body;
    let resultType = data.resultType;

    const prevsettle: any = await Gametransaction.findOne({
        transactionId: data.transactionId,
        'detail.settled': true
    }).sort({ createdAt: -1 });
    // console.log(prevsettle, '--prevsettle---');

    const userdata = await User.findOne({
        id: Number(data.userId)
    });

    const sportsGameId: any = await Gamelist.findOne({ gameid: gameId.gameid });

    let betData = {
        transactionId: data.transactionId,
        currency: data.currency,
        amount: data.amount,
        user_id: userdata._id,
        type: data.type,
        game_id: sportsGameId._id,
        provider_id: sportsGameId.provider,
        user_credit: userdata.balance,
        detail: {
            ...prevBet.detail,
            coefficient: data.coefficient,
            resultType: data.resultType,
            settled: true,
            gameType: data.gameType
        }
    };

    await Gametransaction.create(betData);

    if (resultType == 'refund') {
        let amount = 0;

        if (prevsettle) {
            if (prevsettle.detail.resultType == 'lose') {
                amount = prevBet.amount;
            } else {
                amount = data.amount - prevsettle.amount;
            }
        } else {
            amount = data.amount;
        }
        await balanceUpdate(userdata, amount, 'cashout');
        return {
            status: 200,
            profile: {
                transactionId: data.transactionId,
                transactionTime: new Date()
            }
        };
    } else if (resultType == 'won') {
        let amount = 0;
        if (prevsettle) {
            if (prevsettle.detail.resultType == 'refund') {
                amount = data.amount - prevBet.amount;
            } else if (prevsettle.detail.resultType == 'lost') {
                amount = data.amount;
            } else if (prevsettle.detail.resultType == 'unsettle') {
                amount = data.amount;
            } else if (prevsettle.detail.resultType == 'won') {
                amount = data.amount - prevsettle.amount;
            } else {
                amount = data.amount;
            }
        } else {
            amount = data.amount;
        }
        await balanceUpdate(userdata, amount, 'cashout');
        return {
            status: 200,
            profile: {
                transactionId: data.transactionId,
                transactionTime: new Date()
            }
        };
    } else if (resultType == 'cashout') {
        await balanceUpdate(userdata, data.amount, 'cashout');
        return {
            status: 200,
            profile: {
                transactionId: data.transactionId,
                transactionTime: new Date()
            }
        };
    } else if (resultType == 'lost') {
        let amount = 0;

        if (prevsettle) {
            amount = -data.amount - prevsettle.amount;
        } else {
            amount = -data.amount;
        }
        await balanceUpdate(userdata, amount, 'cashout');
        return {
            status: 200,
            profile: {
                transactionId: data.transactionId,
                transactionTime: new Date()
            }
        };
    }
};

const rollbackchild = async (req: any, prevBet: any) => {
    const data = req.body;
    let resultType = 'rollback';

    const prevsettle = await Gametransaction.findOne({
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

    const userdata = await User.findOne({
        id: Number(data.userId)
    });

    const sportsGameId: any = await Gamelist.findOne({ gameid: gameId.gameid });

    let betData = {
        transactionId: data.transactionId,
        currency: data.currency,
        amount: data.amount,
        user_id: userdata._id,
        type: data.type,
        game_id: sportsGameId._id,
        provider_id: sportsGameId.provider,
        user_credit: userdata.balance,
        detail: {
            ...prevBet.detail,
            settled: true,
            resultType: resultType
        }
    };

    let rdata = await Gametransaction.create(betData);
    if (!rdata) {
        return {
            status: 400,
            profile: {
                code: 5,
                message: 'A request data error.'
            }
        };
    }

    await balanceUpdate(userdata, data.amount, 'cashout');

    return {
        status: 200,
        profile: {
            transactionId: data.transactionId,
            transactionTime: new Date()
        }
    };
};

const betcheck = async (req: any) => {
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
    const userdata = await User.findOne({
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
        const prevsettle: any = await Gametransaction.findOne({
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
        } else {
            return {
                status: 400,
                profile: {
                    code: 5,
                    message: 'A request data error.'
                }
            };
        }
    } else {
        return {
            status: 400,
            profile: {
                code: 5,
                message: 'A request data error.'
            }
        };
    }
};

export default {
    profile,
    verifyParams,
    balance,
    bet,
    settledBet,
    betcheck
};
