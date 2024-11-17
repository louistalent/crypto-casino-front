import Provider from '../models/provider.model';
import Gamelist from '../models/gamelist.model';
import User from '../models/user.model';
import Gametransaction from '../models/gametransaction.model';
import CategoryModel from '../models/categories.model';
import JackpotModel from '../models/jackpot.model';
import JackpotHistoryModel from '../models/jackpothistory.model';

const axios = require('axios');
const https = require('https');

const TOKEN = 'd6af2ee9293840239f542ad30d7563e8';
const KEY = 'cb40369fb2e245ca9b4403780e1c49a7';
const ENDPOINT = `https://apiv2.gitslotpark.com`;
const AGENTID = 'stefano';

const initGames = async () => {
    const response = await axios.get(`${ENDPOINT}/gamelist/`, {
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    });
    const res_category = await CategoryModel.findOne({ key: 'casino' });

    let items = response.data.data;

    let games = [];
    for (let i in items) {
        let proitem = await Provider.findOneAndUpdate(
            { name: items[i].vendorid, service: 'Loginx Games' },
            { name: items[i].vendorid, categoryId: res_category._id, service: 'Loginx Games', status: true },
            { upsert: true, new: true }
        );

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
        await Gamelist.deleteMany({ provider: proitem._id });
    }
    await Gamelist.insertMany(games);

    return items;
};

const openGame = async (data: any, user: any) => {
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

    const res = await axios.request(config);

    return res.data;
};

const getBalance = async (body: any) => {
    const user = await User.findOne({
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
    } else {
        return JSON.stringify({ code: 5, balance: 0, message: 'Internal Error' });
    }
};

const betWin = async (body: any) => {
    const user = await User.findOne({
        id: Number(body.userID)
    });

    if (user) {
        console.log(body, 'req.betWin');

        const game_link = await Gamelist.findOne({
            gameid: body.gameID
        });

        const TXID = await Gametransaction.find({ transactionId: body.transactionID });
        const newUpdateBal =
            parseFloat(user.balance.toString()) +
            parseFloat(user.bonusbalnace.toString()) +
            parseFloat(body.winAmount) -
            parseFloat(body.betAmount);

        if (TXID.length > 0) {
            return JSON.stringify({ code: 5, balance: 0, message: 'Transaction is unique' });
        } else {
            let betType = 'BET';
            let txAmount = 0;
            if (body.winAmount > body.betAmount) {
                txAmount = parseFloat(body.winAmount) - parseFloat(body.betAmount);
                betType = 'WIN';
            } else {
                txAmount = parseFloat(body.betAmount) - parseFloat(body.winAmount);
            }
            const betData: any = {
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
            } else if (body.type === 'WIN') {
                jackpot(txAmount, game_link, user);
            }

            let updateBal =
                parseFloat(user.balance.toString()) + parseFloat(body.winAmount) - parseFloat(body.betAmount);
            if (user.balance > body.betAmount) {
                await User.findOneAndUpdate(
                    { _id: user._id },
                    { balance: parseFloat(updateBal.toFixed(2)) },
                    { upsert: true, new: true }
                );
            } else {
                if (body.bet > body.winAmount) {
                    updateBal =
                        parseFloat(user.balance.toString()) +
                        parseFloat(user.bonusbalnace.toString()) +
                        parseFloat(body.winAmount) -
                        parseFloat(body.betAmount);
                    await User.findOneAndUpdate(
                        { _id: user._id },
                        { balance: 0, bonusbalnace: parseFloat(updateBal.toFixed(2)) },
                        { upsert: true, new: true }
                    );
                } else {
                    updateBal =
                        parseFloat(user.balance.toString()) + parseFloat(body.winAmount) - parseFloat(body.betAmount);
                    await User.findOneAndUpdate(
                        { _id: user._id },
                        { balance: parseFloat(updateBal.toFixed(2)) },
                        { upsert: true, new: true }
                    );
                }
            }

            betData.after_credit = updateBal;
            await Gametransaction.create(betData);

            return {
                code: 0,
                balance: newUpdateBal,
                platformTansactionID: body.transactionID,
                message: ''
            };
        }
    } else {
        return JSON.stringify({ code: 5, balance: 0, message: 'User token not exist' });
    }
};

const withdraw = async (body: any) => {
    const user = await User.findOne({
        id: Number(body.userID)
    });

    if (user) {
        console.log(body, 'req.withdraw');

        const game_link = await Gamelist.findOne({
            gameid: body.gameID
        });

        const TXID = await Gametransaction.find({ transactionId: body.transactionID });
        const newUpdateBal =
            parseFloat(user.balance.toString()) + parseFloat(user.bonusbalnace.toString()) - parseFloat(body.amount);

        if (TXID.length > 0) {
            return JSON.stringify({ code: 5, balance: 0, message: 'Transaction is unique' });
        } else {
            let betType = 'BET';

            const betData: any = {
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
                await User.findOneAndUpdate(
                    { _id: user._id },
                    { balance: parseFloat(updateBal.toFixed(2)) },
                    { upsert: true, new: true }
                );
            } else {
                updateBal =
                    parseFloat(user.balance.toString()) +
                    parseFloat(user.bonusbalnace.toString()) +
                    parseFloat(body.amount);
                await User.findOneAndUpdate(
                    { _id: user._id },
                    { balance: 0, bonusbalnace: parseFloat(updateBal.toFixed(2)) },
                    { upsert: true, new: true }
                );
            }

            betData.after_credit = updateBal;
            await Gametransaction.create(betData);

            return {
                code: 0,
                balance: newUpdateBal,
                platformTansactionID: body.transactionID,
                message: ''
            };
        }
    } else {
        return JSON.stringify({ code: 5, balance: 0, message: 'User token not exist' });
    }
};

const deposit = async (body: any) => {
    const user = await User.findOne({
        id: Number(body.userID)
    });

    if (user) {
        console.log(body, 'req.deposit');

        const game_link = await Gamelist.findOne({
            gameid: body.gameID
        });

        const TXID = await Gametransaction.find({ transactionId: body.transactionID });
        const newUpdateBal =
            parseFloat(user.balance.toString()) + parseFloat(user.bonusbalnace.toString()) - parseFloat(body.amount);

        if (TXID.length > 0) {
            return JSON.stringify({ code: 5, balance: 0, message: 'Transaction is unique' });
        } else {
            let betType = 'WIN';

            const betData: any = {
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
            await User.findOneAndUpdate(
                { _id: user._id },
                { balance: parseFloat(updateBal.toFixed(2)) },
                { upsert: true, new: true }
            );

            betData.after_credit = updateBal;
            await Gametransaction.create(betData);

            return {
                code: 0,
                balance: newUpdateBal,
                platformTansactionID: body.transactionID,
                message: ''
            };
        }
    } else {
        return JSON.stringify({ code: 5, balance: 0, message: 'User token not exist' });
    }
};

const rollback = async (body: any) => {
    const user = await User.findOne({
        id: Number(body.userID)
    });

    if (user) {
        console.log(body, 'req.setply');

        const game_link = await Gamelist.findOne({
            gameid: body.gameID
        });

        const TXID: any = await Gametransaction.find({ transactionId: body.refTransactionID });

        if (TXID.length === 1) {
            const betData: any = {
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
            await Gametransaction.create(betData);

            await User.findOneAndUpdate(
                { _id: user._id },
                { balance: parseFloat(updateBal.toFixed(2)) },
                { upsert: true, new: true }
            );

            return {
                code: 0,
                message: ''
            };
        } else if (TXID.length > 0) {
            return JSON.stringify({
                code: 11,
                message: 'Transaction Already Refund'
            });
        } else {
            return JSON.stringify({
                code: 11,
                message: 'Transaction Not Exist'
            });
        }
    } else {
        return JSON.stringify({ code: 5, balance: 0, message: 'User token not exist' });
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
            '---------------------changeBalance riseup.casino---------------------',
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
    getBalance,
    rollback,
    betWin,
    withdraw,
    deposit
};
