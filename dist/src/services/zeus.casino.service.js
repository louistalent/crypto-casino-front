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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const axios = require('axios');
const https = require('https');
// API info
const TOKEN = 'gamblix';
const KEY = '7H8Fih3h5NU11xHa';
const GROUPID = 6883;
const ENDPOINT = `https://zeus.vdcgaming.net/api`;
const prisma = new client_1.PrismaClient();
const gamelist = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.zeusGames
        .findMany({
        where: {
            NOT: {
                device: 'mobile'
            }
        },
        select: {
            title: true
        },
        distinct: ['title']
    })
        .then((gamelist) => __awaiter(void 0, void 0, void 0, function* () {
        let gameCount = [];
        for (const game of gamelist) {
            yield prisma.zeusGames
                .findMany({
                where: {
                    title: game.title,
                    NOT: {
                        device: 'mobile'
                    }
                }
            })
                .then((result) => {
                gameCount.push(result.length);
            });
        }
        return { gamelist, gameCount };
    }));
});
const livegamelist = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.zeusGames
        .findMany({
        where: {
            NOT: {
                device: 'mobile'
            },
            title: 'live_dealers'
        }
    })
        .then((gamelist) => {
        return gamelist;
    });
});
const virtualgamelist = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.zeusGames
        .findMany({
        where: {
            NOT: {
                device: 'mobile'
            },
            title: 'fast_games'
        }
    })
        .then((gamelist) => {
        return gamelist;
    });
});
const providerGameList = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.title == 'All') {
        return yield prisma.zeusGames
            .findMany({
            where: {
                device: {
                    in: ['desktop', 'all']
                },
                NOT: {
                    device: 'mobile',
                    title: {
                        in: ['live_dealers', '', 'fast_games', 'sport_betting']
                    }
                }
            }
        })
            .then((result) => {
            return result;
        });
    }
    else {
        return yield prisma.zeusGames
            .findMany({
            where: {
                title: data.title,
                NOT: {
                    device: 'mobile'
                }
            }
        })
            .then((result) => {
            return result;
        });
    }
});
const initGames = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('===========zeus game start============');
        const response = yield axios.get(`${ENDPOINT}/game_list?token=${TOKEN}&key=${KEY}`, {
            params: {
                token: TOKEN,
                key: KEY
            },
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });
        const res = response.data;
        for (let key in res.software) {
            // if (key === 'error') {
            console.log(key, 'done', res.software[key].length);
            res.software[key].map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const gameData = {
                    id: '' + item.id + '',
                    gameId: '' + item.gid + '',
                    name: item.name,
                    img: item.icon,
                    device: item.platform,
                    categories: item.type,
                    title: key
                };
                let data = Object.assign({}, gameData);
                yield prisma.zeusGames.create({
                    data
                });
            }));
            // }
        }
        return res;
    }
    catch (error) {
        console.error(error);
    }
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
    try {
        const response = yield axios.get(`${ENDPOINT}/open_session`, {
            params: reqParams,
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });
        const res = response.data;
        if (res.err === 'ok') {
            return res.game_link;
        }
    }
    catch (_a) {
        return false;
    }
});
const searchGame = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.zeusGames
        .findMany({
        where: {
            NOT: {
                device: 'mobile'
            },
            name: {
                contains: data.gameName
            }
        }
    })
        .then((result) => {
        return result;
    });
});
const callbackpost = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data, 'callbackpost url is ok');
    const user = yield prisma.user.findFirst({
        where: {
            username: data.userId
        }
    });
    const updateBal = parseFloat(user.balance.toString()) + parseFloat(data.win) - parseFloat(data.bet);
    const updateBalnace = yield prisma.user.update({
        where: {
            username: user.username
        },
        data: {
            balance: parseFloat(updateBal.toFixed(2))
        }
    });
    return 'ok';
});
const callbackget = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('get callback ok');
    const user = yield prisma.user.findFirst({
        where: {
            username: data.userId
        }
    });
    return '' + user.balance + '';
});
exports.default = {
    initGames,
    gamelist,
    livegamelist,
    virtualgamelist,
    providerGameList,
    openGame,
    callbackget,
    callbackpost,
    searchGame
};
//# sourceMappingURL=zeus.casino.service.js.map