import Provider from '../models/provider.model';
import Gamelist from '../models/gamelist.model';
import User from '../models/user.model';
import Gametransaction from '../models/gametransaction.model';
import CategoryModel from '../models/categories.model';
import JackpotModel from '../models/jackpot.model';
import JackpotHistoryModel from '../models/jackpothistory.model';

const axios = require('axios');
const https = require('https');

const TOKEN = 'areadev';
const KEY = 'ZH66641MmaiykTnE';
const ENDPOINT = `https://api.riseupgames.net`;

const initGames = async () => {
    const response = await axios.get(`${ENDPOINT}/games/${TOKEN}`, {
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    const res_category = await CategoryModel.findOne({ key: 'casino' });

    let items = response.data.data;

    for (let i in items) {
        let games = [];
        let proitem = await Provider.findOneAndUpdate(
            { name: items[i].provider },
            { name: items[i].provider, categoryId: res_category._id, service: 'riseup', status: true },
            { upsert: true, new: true }
        );

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
        await Gamelist.deleteMany({ provider: proitem._id });
        await Gamelist.insertMany(games);
    }

    return response.data.data;
};

const openGame = async (data: any, user: any) => {
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
            Authorization:
                'Basic ' +
                Buffer.from(username + ':' + password)
                    .toString('base64')
                    .trimEnd()
        },
        data: JSON.stringify(datas)
    };
    console.log('req.dats.dats.dta.url', config);

    const res = await axios.request(config);

    console.log(res, 'req.dats.dats.dta.url', config);

    return res.data;
    // if (res.err === 'ok') {
    //     return res.game_link;
    // }
};

const getBalance = async (body: any) => {
    const user = await User.findOne({
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
    } else {
        return JSON.stringify({ status: false, balance: 0, error: 'Internal Error' });
    }
};

const setPlay = async (body: any) => {
    const user = await User.findOne({
        id: Number(body.token)
    });

    if (user) {
        console.log(body, 'req.setply');

        const game_link = await Gamelist.findOne({
            gameid: body.gameid
        });

        const TXID = await Gametransaction.find({ transactionId: body.tid });
        const newUpdateBal =
            parseFloat(user.balance.toString()) +
            parseFloat(user.bonusbalnace.toString()) +
            parseFloat(body.win) -
            parseFloat(body.bet);

        if (body.type === 'REFUND') {
            if (TXID.length === 1) {
                const betData: any = {
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
                await Gametransaction.create(betData);

                await User.findOneAndUpdate(
                    { _id: user._id },
                    { balance: parseFloat(updateBal.toFixed(2)) },
                    { upsert: true, new: true }
                );

                return {
                    status: true,
                    balance: newUpdateBal,
                    referenceTID: body.tid,
                    error: ''
                };
            } else if (TXID.length > 0) {
                return JSON.stringify({
                    status: false,
                    error: 'Transaction Already Refund'
                });
            } else {
                return JSON.stringify({
                    status: false,
                    error: 'Transaction Not Exist'
                });
            }
        } else {
            if (TXID.length > 0) {
                return JSON.stringify({ status: false, balance: 0, referenceTID: '', error: 'Transaction is unique' });
            } else {
                const betData: any = {
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
                } else if (body.type === 'BETWIN') {
                    if (body.bet > body.win) {
                        jackpot(body.amount, game_link, user);
                    }
                }

                console.log(body.amount, user.balance);
                let updateBal = parseFloat(user.balance.toString()) + parseFloat(body.win) - parseFloat(body.bet);
                if (user.balance > body.bet) {
                    await User.findOneAndUpdate(
                        { _id: user._id },
                        { balance: parseFloat(updateBal.toFixed(2)) },
                        { upsert: true, new: true }
                    );
                } else {
                    if (body.bet > body.win) {
                        updateBal =
                            parseFloat(user.balance.toString()) +
                            parseFloat(user.bonusbalnace.toString()) +
                            parseFloat(body.win) -
                            parseFloat(body.bet);
                        await User.findOneAndUpdate(
                            { _id: user._id },
                            { balance: 0, bonusbalnace: parseFloat(updateBal.toFixed(2)) },
                            { upsert: true, new: true }
                        );
                    } else {
                        updateBal = parseFloat(user.balance.toString()) + parseFloat(body.win) - parseFloat(body.bet);
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
                    status: true,
                    balance: newUpdateBal,
                    referenceTID: body.tid,
                    error: ''
                };
            }
        }
    } else {
        return JSON.stringify({ status: false, balance: 0, referenceTID: '', error: 'User token not exist' });
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
    setPlay
};
