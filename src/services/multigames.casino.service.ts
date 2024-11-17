import Provider from '../models/provider.model';
import Gamelist from '../models/gamelist.model';
import User from '../models/user.model';
import Gametransaction from '../models/gametransaction.model';
import CategoryModel from '../models/categories.model';
import JackpotModel from '../models/jackpot.model';
import JackpotHistoryModel from '../models/jackpothistory.model';

const axios = require('axios');
const https = require('https');

const PORTAL_CODE = 'teg101_TND';
const KEY = 'a689c2b30e7bb49be6a842a429e32348';
const ENDPOINT = `https://api.multigames.xyz`;

const initGames = async () => {
    const response = await axios.get(`${ENDPOINT}/api/${PORTAL_CODE}/GetProviders`, {
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    const res_category = await CategoryModel.findOne({ key: 'casino' });

    let items = response.data.data;
    let gameitems = [];

    for (let i in items) {
        let games = [];
        let proitem = await Provider.findOneAndUpdate(
            { id: items[i].id },
            {
                name: items[i].nameId,
                status: true,
                id: items[i].id,
                title: items[i].title,
                categoryId: res_category._id,
                service: 'multigames'
            },
            { upsert: true, new: true }
        );

        const gameresult = await axios.get(`${ENDPOINT}/api/${PORTAL_CODE}/GetGames/${items[i].id}`, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        gameitems = gameresult.data.data;
        for (let j in gameitems) {
            let gameitem = gameitems[j];
            let device =
                gameitem.supportMobile && gameitem.supportDesktop
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
        await Gamelist.deleteMany({ provider: proitem._id });
        await Gamelist.insertMany(games);
    }

    return true;
};

const openGame = async (data: any, user: any) => {
    const reqParams = {
        auth: String(user._id),
        playerId: user.username,
        portalCode: PORTAL_CODE,
        gameId: data.gameId
    };
    const reqEndpoint = `${ENDPOINT}/?auth=${reqParams.auth}&playerId=${reqParams.playerId}&portalCode=${reqParams.portalCode}&gameId=${reqParams.gameId}`;

    console.log(reqEndpoint, 'multigames lunch url');
    return reqEndpoint;
};

const Authenticate = async (body: any) => {
    const user = await User.findOne({
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
    } else {
        console.log('req.body.Authenticate.multigames.success.PLAYER_NOT_FOUND');

        return {
            code: 22,
            message: 'PLAYER_NOT_FOUND',
            balance: 0,
            messageId: body.messageId,
            sign: body.sign
        };
    }
};

const getBalance = async (body: any) => {
    const user = await User.findOne({
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
    } else {
        console.log('req.body.getBalance.multigames.PLAYER_NOT_FOUND');

        return {
            code: 22,
            message: 'PLAYER_NOT_FOUND',
            balance: 0,
            messageId: body.messageId,
            sign: body.sign
        };
    }
};

const addBalnace = async (balance: number, amount: number, type: string) => {
    console.log(amount, '---------------------req.addBalance.multigames------------------', type);
    let updateBalance = 0;
    if (type === 'BET') {
        updateBalance = balance - amount;
    } else if (type === 'ROLLBACK') {
        updateBalance = balance + amount;
    } else if (type === 'WIN') {
        updateBalance = balance + amount;
    } else if (type === 'REFUND') {
        updateBalance = balance + amount;
    } else {
        updateBalance = balance - amount;
    }

    return parseFloat(updateBalance.toFixed(2));
};

const withdraw = async (body: any) => {
    const user = await User.findOne({
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
    } else if (body.currency !== 'TND') {
        return {
            code: 23,
            message: 'INVALID_CURRENCY',
            balance: 0,
            messageId: body.messageId,
            sign: body.sign
        };
    }

    if (user) {
        const game_link = await Gamelist.findOne({
            gameid: body.gameId
        });

        const TXID = await Gametransaction.find({ transactionId: body.transactionId });

        if (TXID.length > 0) {
            console.log('req.body.multigames.withdraw.DUPLICATE_TRANSACTION');

            return {
                code: 25,
                message: 'DUPLICATE_TRANSACTION',
                balance: 0,
                messageId: body.messageId,
                sign: body.sign
            };
        } else {
            const betData: any = {
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
                    updateBal = await addBalnace(
                        Number(user.bonusbalnace) + Number(user.balance),
                        body.amount / 100,
                        body.type
                    );
                    await User.findOneAndUpdate(
                        { _id: user._id },
                        { balance: 0, bonusbalnace: updateBal },
                        { upsert: true, new: true }
                    );
                } else {
                    updateBal = await addBalnace(Number(user.balance), body.amount / 100, body.type);
                    await User.findOneAndUpdate({ _id: user._id }, { balance: updateBal }, { upsert: true, new: true });
                }
            } else {
                updateBal = await addBalnace(Number(user.balance), body.amount / 100, body.type);
                await User.findOneAndUpdate({ _id: user._id }, { balance: updateBal }, { upsert: true, new: true });
            }
            betData.after_credit = updateBal;
            await Gametransaction.create(betData);

            console.log('req.body.multigames.withdraw.SUCCESS');
            const newUpdateBal = await addBalnace(
                Number(user.bonusbalnace) + Number(user.balance),
                body.amount / 100,
                body.type
            );
            return {
                code: 10,
                message: 'SUCCESS',
                balance: Number(newUpdateBal) * 100,
                transactionId: body.transactionId,
                messageId: body.messageId,
                sign: body.sign
            };
        }
    } else {
        console.log('req.body.multigames.withdraw.PLAYER_NOT_FOUND');

        return {
            code: 22,
            message: 'PLAYER_NOT_FOUND',
            balance: 0,
            messageId: body.messageId,
            sign: body.sign
        };
    }
};

const deposit = async (body: any) => {
    const user = await User.findOne({
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
    } else if (body.currency !== 'TND') {
        return {
            code: 23,
            message: 'INVALID_CURRENCY',
            balance: 0,
            messageId: body.messageId,
            sign: body.sign
        };
    }

    if (user) {
        const game_link = await Gamelist.findOne({
            gameid: body.gameId
        });

        const TXID = await Gametransaction.find({ transactionId: body.transactionId });

        if (body.type === 'REFUND') {
            if (TXID.length === 1) {
                const betData: any = {
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
                const updateBal = await addBalnace(Number(user.balance), body.amount / 100, body.type);
                betData.after_credit = updateBal;
                await Gametransaction.create(betData);

                const updateUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { balance: updateBal },
                    { upsert: true, new: true }
                );
                console.log('req.body.multigames.deposit.SUCCESS');

                return {
                    code: 10,
                    message: 'SUCCESS',
                    balance: (Number(updateUser.balance) + Number(updateUser.bonusbalnace)) * 100,
                    transactionId: body.transactionId,
                    messageId: body.messageId,
                    sign: body.sign
                };
            } else if (TXID.length > 0) {
                console.log('req.body.multigames.deposit.DUPLICATE_TRANSACTION length 0');

                return {
                    code: 25,
                    message: 'DUPLICATE_TRANSACTION',
                    balance: 0,
                    messageId: body.messageId,
                    sign: body.sign
                };
            } else {
                console.log('req.body.multigames.deposit.DUPLICATE_TRANSACTION ');

                return {
                    code: 25,
                    message: 'DUPLICATE_TRANSACTION',
                    balance: 0,
                    messageId: body.messageId,
                    sign: body.sign
                };
            }
        } else {
            if (TXID.length > 0) {
                console.log('req.body.multigames.deposit.DUPLICATE_TRANSACTION length 0');

                return {
                    code: 25,
                    message: 'DUPLICATE_TRANSACTION',
                    balance: 0,
                    messageId: body.messageId,
                    sign: body.sign
                };
            } else {
                let bodyType = body.type;
                if (body.type === 'WIN' && body.amount === 0) {
                    bodyType = 'lost';
                }

                const betData: any = {
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

                const updateBal = await addBalnace(Number(user.balance), body.amount / 100, body.type);
                betData.after_credit = updateBal;

                await Gametransaction.create(betData);

                const updateUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { balance: updateBal },
                    { upsert: true, new: true }
                );

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
    } else {
        console.log('req.body.multigames.deposit.PLAYER_NOT_FOUND');

        return {
            code: 22,
            message: 'PLAYER_NOT_FOUND',
            balance: 0,
            messageId: body.messageId,
            sign: body.sign
        };
    }
};

const jackpot = async (amount: number, game: any, user: any) => {
    const result: any = await Provider.findOne({ _id: game.provider }).populate('categoryId');
    if (result.categoryId.key === 'casinovip' || result.categoryId.key === 'casino') {
        const jackpotResult: any = await JackpotModel.findOne({});
        const shop: any = await User.findOne({ id: user.parent_id });
        const changeBalnace = jackpotResult.fee * amount;
        console.log(
            jackpotResult,
            jackpotResult.silverValue + changeBalnace,
            '---------------------changeBalance multigames.casino---------------------',
            user.balance
        );
        if (jackpotResult.silverValue + changeBalnace === user.balance) {
            const betData: any = {
                amount: jackpotResult.silverValue + changeBalnace,
                jackpot: 'silver',
                user_name: user.name,
                user_id: user._id,
                shop_name: shop.name
            };

            await JackpotHistoryModel.create(betData);

            await User.findOneAndUpdate(
                { _id: user._id },
                {
                    $inc: {
                        balance: jackpotResult.silverValue + changeBalnace
                    }
                }
            );

            await JackpotModel.updateOne(
                {},
                {
                    $set: {
                        silverValue: jackpotResult.silver.startvalue,
                        goldValue: jackpotResult.gold.startvalue,
                        platinumValue: jackpotResult.platinum.startvalue
                    }
                }
            );
        } else if (jackpotResult.goldValue + changeBalnace === user.balance) {
            const betData: any = {
                amount: jackpotResult.silverValue + changeBalnace,
                jackpot: 'silver',
                user_name: user.name,
                user_id: user._id,
                shop_name: shop.name
            };

            await JackpotHistoryModel.create(betData);

            await User.findOneAndUpdate(
                { _id: user._id },
                {
                    $inc: {
                        balance: jackpotResult.goldValue + changeBalnace
                    }
                }
            );

            await JackpotModel.updateOne(
                {},
                {
                    $set: {
                        silverValue: jackpotResult.silver.startvalue,
                        goldValue: jackpotResult.gold.startvalue,
                        platinumValue: jackpotResult.platinum.startvalue
                    }
                }
            );
        } else if (jackpotResult.platinumValue + changeBalnace === user.balance) {
            const betData: any = {
                amount: jackpotResult.silverValue + changeBalnace,
                jackpot: 'silver',
                user_name: user.name,
                user_id: user._id,
                shop_name: shop.name
            };

            await JackpotHistoryModel.create(betData);

            await User.findOneAndUpdate(
                { _id: user._id },
                {
                    $inc: {
                        balance: jackpotResult.platinumValue + changeBalnace
                    }
                }
            );

            await JackpotModel.updateOne(
                {},
                {
                    $set: {
                        silverValue: jackpotResult.silver.startvalue,
                        goldValue: jackpotResult.gold.startvalue,
                        platinumValue: jackpotResult.platinum.startvalue
                    }
                }
            );
        } else {
            await JackpotModel.findOneAndUpdate(
                {},
                {
                    $inc: {
                        silverValue: changeBalnace,
                        goldValue: changeBalnace,
                        platinumValue: changeBalnace
                    }
                }
            );
        }
    }
};

export default {
    initGames,
    openGame,
    Authenticate,
    getBalance,
    withdraw,
    deposit
};
