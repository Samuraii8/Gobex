const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const adminPassword = 'BurakGobexİnşaat05'; // Başlangıç şifresi
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.admin.upsert({
        where: { ad: 'BurakGobex01' },
        update: {},
        create: {
            ad: 'BurakGobex01',
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
