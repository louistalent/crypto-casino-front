"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pragmaticService = exports.dashboardService = exports.multigamesService = exports.riseupCasinoService = exports.zeusCasinoService = exports.roleService = exports.sportsbookService = exports.tokenService = exports.userService = exports.authService = exports.casinoService = void 0;
const auth_service_1 = __importDefault(require("./auth.service"));
exports.authService = auth_service_1.default;
const user_service_1 = __importDefault(require("./user.service"));
exports.userService = user_service_1.default;
const token_service_1 = __importDefault(require("./token.service"));
exports.tokenService = token_service_1.default;
const casino_service_1 = __importDefault(require("./casino.service"));
exports.casinoService = casino_service_1.default;
const sportsbook_service_1 = __importDefault(require("./sportsbook.service"));
exports.sportsbookService = sportsbook_service_1.default;
const role_service_1 = __importDefault(require("./role.service"));
exports.roleService = role_service_1.default;
const zeus_casino_service_1 = __importDefault(require("./zeus.casino.service"));
exports.zeusCasinoService = zeus_casino_service_1.default;
const riseup_casino_service_1 = __importDefault(require("./riseup.casino.service"));
exports.riseupCasinoService = riseup_casino_service_1.default;
const multigames_casino_service_1 = __importDefault(require("./multigames.casino.service"));
exports.multigamesService = multigames_casino_service_1.default;
const dashboard_service_1 = __importDefault(require("./dashboard.service"));
exports.dashboardService = dashboard_service_1.default;
const pragmatic_casino_service_1 = __importDefault(require("./pragmatic.casino.service"));
exports.pragmaticService = pragmatic_casino_service_1.default;
//# sourceMappingURL=index.js.map