import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

import ApiError from '../utils/ApiError';

const prisma = new PrismaClient();

/**
 * Check if Slug is taken
 * @param {string} slug
 *
 * * @param {string} [excludeUserId] - The id of the role to be excluded
 * @returns {Promise<boolean>}
 */
const isSlugTaken = async (slug: string, excludeUserId: string) => {
    const role = await prisma.roles.findFirst({
        where: {
            slug,
            NOT: {
                id: excludeUserId
            }
        }
    });
    return !!role;
};

/**
 * Get role by id
 * @param {string} id
 * @returns {Promise<Role>}
 */
const getRoleById = async (id: string) => {
    return prisma.roles.findUnique({
        where: {
            id
        }
    });
};

/**
 * Get role by slug
 * @param {string} slug
 * @returns {Promise<Role>}
 */
const getRoleBySlug = async (slug: string) => {
    return await prisma.roles.findUnique({
        where: {
            slug
        }
    });
};

/**
 * remove role by id
 * @param {string} id
 * @returns {Promise<Role>}
 */
const removeRoleById = async (id: string) => {
    return prisma.roles.delete({
        where: {
            id
        }
    });
};

/**
 * Create a role
 * @param {Object} userBody
 * @returns {Promise<Role>}
 */

type createRoleProps = {
    name: string;
    slug: string;
};

const createRole = async ({ name, slug }: createRoleProps) => {
    return prisma.roles
        .create({
            data: {
                id: uuidv4(),
                name,
                slug
            }
        })
        .then((role) => {
            return role;
        })
        .catch((error: any) => {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Slug already taken');
        });
};

/**
 * Query for users
 * @returns {Promise<QueryResult>}
 */
const getAllRoles = async () => {
    return await prisma.roles.findMany().then((roles) => {
        return roles;
    });
};

/**
 * Delete Role by id
 * @param {string} roleId
 * @returns {Promise<Role>}
 */
const deleteRoleById = async (roleId: string) => {
    const role = await getRoleById(roleId);
    if (!role) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
    } else {
        await removeRoleById(roleId);
    }
    return role;
};

/**
 * Update role by id
 * @param {string} roleId
 * @param {Object} updateBody
 * @returns {Promise<Role>}
 */
const updateRoleById = async (roleId: string, updateBody: any) => {
    const role = await getRoleById(roleId);
    if (!role) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
    }
    if (updateBody.slug && (await isSlugTaken(updateBody.slug, roleId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Slug already taken');
    }

    const updatedUser = await prisma.roles.update({
        where: {
            id: roleId
        },
        data: {
            ...updateBody
        }
    });
    return updatedUser;
};

export default {
    getRoleBySlug,
    createRole,
    getAllRoles,
    getRoleById,
    deleteRoleById,
    updateRoleById
};
