import { PrismaClient, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const rolesData: Prisma.RolesCreateInput[] = [
    {
        id: uuidv4(),
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
        id: uuidv4(),
        name: 'Admin',
        slug: 'admin'
    },
    {
        id: uuidv4(),
        name: 'Shop',
        slug: 'shop'
    },
    {
        id: uuidv4(),
        name: 'User',
        slug: 'user'
    }
];

async function main() {
    console.log(`Start seeding ...`);
    for (let role of rolesData) {
        await prisma.roles.create({
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
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
