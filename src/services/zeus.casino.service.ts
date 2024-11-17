import { PrismaClient } from '@prisma/client';
const axios = require('axios');
const https = require('https');

// API info
const TOKEN = 'gamblix';
const KEY = '7H8Fih3h5NU11xHa';
const GROUPID = 6883;
const ENDPOINT = `https://zeus.vdcgaming.net/api`;

const prisma = new PrismaClient();
const gamelist = async () => {
    return await prisma.zeusGames
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
        .then(async (gamelist) => {
            let gameCount = [];
            for (const game of gamelist) {
                await prisma.zeusGames
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
        });
};

const livegamelist = async () => {
    return await prisma.zeusGames
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
};

const virtualgamelist = async () => {
    return await prisma.zeusGames
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
};

const providerGameList = async (data: any) => {
    if (data.title == 'All') {
        return await prisma.zeusGames
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
    } else {
        return await prisma.zeusGames
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
};

const initGames = async () => {
    try {
        console.log('===========zeus game start============');
        const response = await axios.get(`${ENDPOINT}/game_list?token=${TOKEN}&key=${KEY}`, {
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

            res.software[key].map(async (item) => {
                interface Game {
                    id: string;
                    gameId: string;
                    name: string;
                    img: string;
                    device: string;
                    categories: string;
                    title: string;
                }

                const gameData: Game = {
                    id: '' + item.id + '',
                    gameId: '' + item.gid + '',
                    name: item.name,
                    img: item.icon,
                    device: item.platform,
                    categories: item.type,
                    title: key
                };

                let data = {
                    ...gameData
                } as any;

                await prisma.zeusGames.create({
                    data
                });
            });
            // }
        }

        return res;
    } catch (error) {
        console.error(error);
    }
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
    try {
        const response = await axios.get(`${ENDPOINT}/open_session`, {
            params: reqParams,
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });
        const res = response.data;
        if (res.err === 'ok') {
            return res.game_link;
        }
    } catch {
        return false;
    }
};

const searchGame = async (data: any) => {
    return await prisma.zeusGames
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
};

const callbackpost = async (data: any) => {
    console.log(data, 'callbackpost url is ok');
    const user = await prisma.user.findFirst({
        where: {
            username: data.userId
        }
    });

    const updateBal = parseFloat(user.balance.toString()) + parseFloat(data.win) - parseFloat(data.bet);

    const updateBalnace = await prisma.user.update({
        where: {
            username: user.username
        },
        data: {
            balance: parseFloat(updateBal.toFixed(2))
        }
    });

    return 'ok';
};

const callbackget = async (data: any) => {
    console.log('get callback ok');
    const user = await prisma.user.findFirst({
        where: {
            username: data.userId
        }
    });

    return '' + user.balance + '';
};

export default {
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
