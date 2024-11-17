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
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const rolesData = [
    {
        id: (0, uuid_1.v4)(),
        name: 'Super Admin',
        slug: 'super_admin',
        users: {
            create: {
                id: 0,
                email: 'admin@areadev.com',
                username: 'Admin',
                firstName: 'Admin',
                lastName: 'User',
                status: 'active',
                password: '123123'
                // avatar: {
                //     create: {
                //         id: uuidv4(),
                //         name: 'default.png',
                //         type: 'image/png',
                //         size: 0,
                //         link: 'default.png',
                //         originalName: 'default.png'
                //     }
                // }
            }
        }
    },
    {
        id: (0, uuid_1.v4)(),
        name: 'Admin',
        slug: 'admin'
    },
    {
        id: (0, uuid_1.v4)(),
        name: 'Shop',
        slug: 'shop'
    },
    {
        id: (0, uuid_1.v4)(),
        name: 'User',
        slug: 'user'
    }
];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Start seeding ...`);
        for (let role of rolesData) {
            yield prisma.roles.create({
                data: role
            });
        }
        // await prisma.user.create({
        //     data:  {
        //         email: 'admin@trock.com',
        //         username: 'Admin',
        //         firstName: 'Admin',
        //         lastName: 'User',
        //         password: '123123',
        //         role: {
        //             connect: {
        //                 slug: 'admin'
        //             }
        //         }
        //     }
        // });
        console.log(`Seeding finished.`);
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
//# sourceMappingURL=seed.js.map