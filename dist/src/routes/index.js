"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth.route"));
const user_route_1 = __importDefault(require("./user.route"));
// import roleRoute from './role.route';
const casino_api_1 = __importDefault(require("./casino.api"));
const zeus_casino_api_1 = __importDefault(require("./zeus.casino.api"));
const sportsbook_api_1 = __importDefault(require("./sportsbook.api"));
const riseup_api_1 = __importDefault(require("./riseup.api"));
const multigames_api_1 = __importDefault(require("./multigames.api"));
const dashboard_api_1 = __importDefault(require("./dashboard.api"));
const riseup_pragmatic_api_1 = __importDefault(require("./riseup.pragmatic.api"));
const routes = [
    {
        path: '/auth',
        route: auth_route_1.default
    },
    {
        path: '/users',
        route: user_route_1.default
    },
    // {
    //     path: '/roles',
    //     route: roleRoute
    // },
    {
        path: '/casino',
        route: casino_api_1.default
    },
    {
        path: '/riseup',
        route: riseup_api_1.default
    },
    {
        path: '/multigames/casino',
        route: multigames_api_1.default
    },
    {
        path: '/zeus/casino',
        route: zeus_casino_api_1.default
    },
    {
        path: '/sportsbook/callback',
        route: sportsbook_api_1.default
    },
    {
        path: '/dashboard',
        route: dashboard_api_1.default
    },
    {
        path: '/riseup_pragmatic',
        route: riseup_pragmatic_api_1.default
    }
];
const router = express_1.default.Router();
routes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
//# sourceMappingURL=index.js.map