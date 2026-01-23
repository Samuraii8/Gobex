const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const adminPassword = '123456'; // Başlangıç şifresi
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.admin.upsert({
        where: { ad: 'admin' },
        update: {},
        create: {
            ad: 'admin',
            sifre: hashedPassword,
        },
    });

    console.log({ admin });
    console.log(`Admin created/found with password: ${adminPassword}`);
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
