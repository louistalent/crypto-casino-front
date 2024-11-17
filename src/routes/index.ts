import express from 'express';

import authRoute from './auth.route';
import userRoute from './user.route';
// import roleRoute from './role.route';
import casinoRoute from './casino.api';
import zeusCasinoRoute from './zeus.casino.api';
import sportsbookRoute from './sportsbook.api';
import riseupRoute from './riseup.api';
import multigamesRoute from './multigames.api';
import dashboardRoute from './dashboard.api';
import riseupPragmaticRoute from './riseup.pragmatic.api';

const routes = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/users',
        route: userRoute
    },
    // {
    //     path: '/roles',
    //     route: roleRoute
    // },
    {
        path: '/casino',
        route: casinoRoute
    },
    {
        path: '/riseup',
        route: riseupRoute
    },
    {
        path: '/multigames/casino',
        route: multigamesRoute
    },
    {
        path: '/zeus/casino',
        route: zeusCasinoRoute
    },
    {
        path: '/sportsbook/callback',
        route: sportsbookRoute
    },
    {
        path: '/dashboard',
        route: dashboardRoute
    },
    {
        path: '/riseup_pragmatic',
        route: riseupPragmaticRoute
    }
];

const router = express.Router();
routes.forEach((route: any) => {
    router.use(route.path, route.route);
});

export default router;
