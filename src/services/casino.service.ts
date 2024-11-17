import Provider from '../models/provider.model';
import Gamelist from '../models/gamelist.model';
import User from '../models/user.model';
import Gametransaction from '../models/gametransaction.model';
import CategoryModel from '../models/categories.model';
import JackpotModel from '../models/jackpot.model';
import MessageModel from '../models/message.model';
// const Gamelist = require("../models/")
const axios = require('axios');
const https = require('https');

const TOKEN = 'gamblix';
const KEY = '7H8Fih3h5NU11xHa';
const GROUPID = 6883;
const ENDPOINT = `https://zeus.vdcgaming.net/api`;

const initGames = async () => {
    const response = await axios.get(`${ENDPOINT}/game_list?token=${TOKEN}&key=${KEY}`, {
        params: {
            token: TOKEN,
            key: KEY
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    let items = response.data.software;

    for (let i in items) {
        let games = [];
        let proitem = await Provider.findOneAndUpdate({ name: i }, { name: i }, { upsert: true, new: true });

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
        await Gamelist.deleteMany({ provider: proitem._id });
        await Gamelist.insertMany(games);
    }

    return false;
    // } catch (error) {
    //     console.error(error);
    // }
};

const sportsinitGames = async () => {
    const res_category = await CategoryModel.findOne({ name: 'SPORT' });

    let games = [];
    const proitem = await Provider.findOneAndUpdate(
        { name: 'Sports' },
        { name: 'Sports', categoryId: res_category._id, service: 'betsy', status: true },
        { upsert: true, new: true }
    );

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

    await Gamelist.deleteMany({ provider: proitem._id });
    await Gamelist.insertMany(games);
    console.log('sports game insert success');
    return true;
};

const provider = async (data: any) => {
    const category = await CategoryModel.findOne({ key: data.name });
    let pids = [];
    if (category) {
        const providerse = await Provider.find({ categoryId: category._id, status: true });
        pids = providerse.map((item) => item._id);
    }

    let array = await Gamelist.aggregate([
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
};

const gamelist = async (data: any) => {
    const category = await CategoryModel.findOne({ key: data.title });
    let pids = [];
    if (category) {
        const providerse = await Provider.find({ categoryId: category._id, status: true });
        pids = providerse.map((item) => item._id);
    }
    if (pids[0]) {
        let array = await Gamelist.find({
            device: { $in: ['desktop', 'all'] },
            // sevice: 'multigames',
            provider: { $in: pids[0] },
            status: true
        }).populate('provider');
        return array;
    } else {
        return [];
    }
};

const eachgameget = async (data: any) => {
    const providerse: any = await Provider.findOne({ name: data.id, status: true });
    if (providerse) {
        let array = await Gamelist.find({
            device: { $in: ['desktop', 'all'] },
            // sevice: 'multigames',
            provider: { $in: providerse._id },
            status: true
        }).populate('provider');
        return array;
    } else {
        return [];
    }
};

const allgameget = async (data: any) => {
    const category = await CategoryModel.findOne({ key: data.title });
    let pids = [];
    if (category) {
        const providerse = await Provider.find({ categoryId: category._id, status: true });
        pids = providerse.map((item) => item._id);
    }

    let array = await Gamelist.find({
        device: { $in: ['desktop', 'all'] },
        // sevice: 'multigames',
        provider: { $in: pids },
        status: true
    }).populate('provider');

    return array;
};

const openGame = async (data: any, user: any) => {
    const reqParams = {
        token: TOKEN,
        key: KEY,
        group_id: GROUPID,
        user_id: user.username,
        game_id: data.gameId,
        software: data.title.toLowerCase()
    };
    const response = await axios.get(`${ENDPOINT}/open_session`, {
        params: reqParams,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    const res = response.data;
    if (res.err === 'ok') {
        return res.game_link;
    }
};

const callbackget = async (data: any) => {
    const user = await User.findOne({
        username: data.userId
    });
    return '' + user.balance + '';
};

const callbackpost = async (data: any) => {
    const user = await User.findOne({
        username: data.userId
    });

    const game_link = await Gamelist.findOne({
        gameid: data.gameId
    });

    const betData: any = {
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
    await Gametransaction.create(betData);

    await User.findOneAndUpdate(
        { _id: user._id },
        { balance: parseFloat(updateBal.toFixed(2)) },
        { upsert: true, new: true }
    );

    return 'ok';
};

const gamehistory = async (data: any) => {
    let array = await Gametransaction.find({ user_id: data._id })
        .populate('game_id', 'name')
        .populate('provider_id', 'name')
        .sort({ createdAt: -1 });
    return array;
};

const getJackpot = async () => {
    const jackpot = await JackpotModel.findOne({});
    return jackpot;
};

const getmessage = async (data: any) => {
    const message = await MessageModel.find({ $or: [{ from_id: data._id }, { to_id: data._id }] })
        .populate('from_id', 'username')
        .populate('to_id', 'username')
        .sort({
            createdAt: -1
        });
    return message;
};

const isReadMessage = async (data: any) => {
    await MessageModel.updateMany({ $or: [{ from_id: data._id }, { to_id: data._id }] }, { isUnRead: false });
    return 'success';
};

const categoryProviderChange = async () => {
    const result = await CategoryModel.findOne({ name: 'Casino' });
    if (result) {
        await Provider.updateMany({}, { $set: { categoryId: result._id } });
        return 'success';
    } else {
        return 'fail';
    }
};

const searchGame = async (data: any) => {
    const category = await CategoryModel.findOne({ key: data.category });
    let pids = [];
    if (category) {
        const providerse = await Provider.find({ categoryId: category._id, status: true });
        pids = providerse.map((item) => item._id);
    }
    // if (pids[0]) {
    console.log(data);
    let array = await Gamelist.find({
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
};

const opengame = async (user: any) => {
    function generateToken(): string {
        const characters: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let token: string = user?.id;

        // Generate 10 random English characters
        for (let i = 0; i < 4; i += 1) {
            const randomChar: string = characters[Math.floor(Math.random() * characters.length)];
            token += randomChar;
        }

        return token;
    }

    const token = generateToken();
    const url = `https://stage.sportbook.work/?locale=fr&cid=gamblix-stage&token=${token}&customStyles=https://www.areadev.pro/sports.css`;

    console.log(url);

    return url;
};

export default {
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
