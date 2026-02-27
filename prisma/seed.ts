import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Clear existing data
    await prisma.discipline.deleteMany();
    await prisma.project.deleteMany();

    await prisma.project.create({
        data: {
            title: 'The Glass Pavilion',
            location: 'Dubai, UAE',
            typology: 'Commercial',
            year: 2023,
            fikraVerificationStatus: 'Verified',
            disciplines: {
                create: [
                    { type: 'Architectural', contentJson: JSON.stringify({ description: 'A seamless glass structure emphasizing natural light.' }) },
                    { type: 'Structural', contentJson: JSON.stringify({ system: 'Tension cables and high-strength glass fins.' }) }
                ]
            }
        }
    });

    await prisma.project.create({
        data: {
            title: 'Metropolitan Bridge',
            location: 'London, UK',
            typology: 'Infrastructure',
            year: 2024,
            fikraVerificationStatus: 'Verified',
            disciplines: {
                create: [
                    { type: 'Structural', contentJson: JSON.stringify({ description: 'Suspension bridge with a novel damping system.' }) },
                    { type: 'Civil', contentJson: JSON.stringify({ material: 'Ultra-high performance concrete.' }) }
                ]
            }
        }
    });

    await prisma.project.create({
        data: {
            title: 'Parametric Concert Hall',
            location: 'Berlin, Germany',
            typology: 'Cultural',
            year: 2022,
            fikraVerificationStatus: 'Pending',
            disciplines: {
                create: [
                    { type: 'Architectural', contentJson: JSON.stringify({ description: 'Acoustically optimized interior shells.' }) },
                    { type: 'Acoustics', contentJson: JSON.stringify({ modeling: 'Parametric ray tracing for sound reflections.' }) }
                ]
            }
        }
    });

    await prisma.project.create({
        data: {
            title: 'Industrial Retrofit',
            location: 'New York, USA',
            typology: 'Adaptive Reuse',
            year: 2025,
            fikraVerificationStatus: 'Verified',
            disciplines: {
                create: [
                    { type: 'Architectural', contentJson: JSON.stringify({ description: 'Preserving the brick shell while modernizing core.' }) },
                    { type: 'Conservation', contentJson: JSON.stringify({ focus: 'Structural stabilization of old masonry.' }) }
                ]
            }
        }
    });

    await prisma.project.create({
        data: {
            title: 'Elevated Botanical Gardens',
            location: 'Singapore',
            typology: 'Landscape/Public',
            year: 2021,
            fikraVerificationStatus: 'Verified',
            disciplines: {
                create: [
                    { type: 'Architectural', contentJson: JSON.stringify({ description: 'Cantilevered walkways over diverse biomes.' }) },
                    { type: 'MEP', contentJson: JSON.stringify({ hvac: 'Microclimate control systems.' }) }
                ]
            }
        }
    });

    console.log('Seeding completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
