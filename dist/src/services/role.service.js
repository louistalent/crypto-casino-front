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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const prisma = new client_1.PrismaClient();
/**
 * Check if Slug is taken
 * @param {string} slug
 *
 * * @param {string} [excludeUserId] - The id of the role to be excluded
 * @returns {Promise<boolean>}
 */
const isSlugTaken = (slug, excludeUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const role = yield prisma.roles.findFirst({
        where: {
            slug,
            NOT: {
                id: excludeUserId
            }
        }
    });
    return !!role;
});
/**
 * Get role by id
 * @param {string} id
 * @returns {Promise<Role>}
 */
const getRoleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.roles.findUnique({
        where: {
            id
        }
    });
});
/**
 * Get role by slug
 * @param {string} slug
 * @returns {Promise<Role>}
 */
const getRoleBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.roles.findUnique({
        where: {
            slug
        }
    });
});
/**
 * remove role by id
 * @param {string} id
 * @returns {Promise<Role>}
 */
const removeRoleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.roles.delete({
        where: {
            id
        }
    });
});
const createRole = ({ name, slug }) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.roles
        .create({
        data: {
            id: (0, uuid_1.v4)(),
            name,
            slug
        }
    })
        .then((role) => {
        return role;
    })
        .catch((error) => {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Slug already taken');
    });
});
/**
 * Query for users
 * @returns {Promise<QueryResult>}
 */
const getAllRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.roles.findMany().then((roles) => {
        return roles;
    });
});
/**
 * Delete Role by id
 * @param {string} roleId
 * @returns {Promise<Role>}
 */
const deleteRoleById = (roleId) => __awaiter(void 0, void 0, void 0, function* () {
    const role = yield getRoleById(roleId);
    if (!role) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Role not found');
    }
    else {
        yield removeRoleById(roleId);
    }
    return role;
});
/**
 * Update role by id
 * @param {string} roleId
 * @param {Object} updateBody
 * @returns {Promise<Role>}
 */
const updateRoleById = (roleId, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const role = yield getRoleById(roleId);
    if (!role) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Role not found');
    }
    if (updateBody.slug && (yield isSlugTaken(updateBody.slug, roleId))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Slug already taken');
    }
    const updatedUser = yield prisma.roles.update({
        where: {
            id: roleId
        },
        data: Object.assign({}, updateBody)
    });
    return updatedUser;
});
exports.default = {
    getRoleBySlug,
    createRole,
    getAllRoles,
    getRoleById,
    deleteRoleById,
    updateRoleById
};
//# sourceMappingURL=role.service.js.map