const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const locations = await prisma.project.findMany({
        select: { location: true },
        distinct: ['location']
    });
    const typologies = await prisma.project.findMany({
        select: { typology: true },
        distinct: ['typology']
    });

    console.log("LOCATIONS:", locations.map(l => l.location));
    console.log("TYPOLOGIES:", typologies.map(t => t.typology));
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
