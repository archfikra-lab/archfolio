import { PrismaClient, Role, ProjectStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Clear existing data (in order of relations)
    await prisma.attachment.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.discipline.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    // 1. Create Users
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@archfolio.com',
            name: 'Platform Admin',
            role: Role.ADMIN,
        }
    });

    const authorUser = await prisma.user.create({
        data: {
            email: 'architect@studio1.com',
            name: 'Studio One Architects',
            role: Role.AUTHOR,
        }
    });

    const academicUser = await prisma.user.create({
        data: {
            email: 'professor@university.edu',
            name: 'Dr. Sarah Jenkins',
            role: Role.ACADEMIC,
        }
    });

    const expertUser = await prisma.user.create({
        data: {
            email: 'engineer@structures.com',
            name: 'Marcus Structural Eng',
            role: Role.EXPERT,
        }
    });

    // 2. Create Projects with new fields and relations
    await prisma.project.create({
        data: {
            title: 'The Jordan Museum',
            location: 'Amman, Jordan',
            latitude: 31.9472,
            longitude: 35.9317,
            mapLink: 'https://maps.google.com/?q=31.9472,35.9317',
            shortDescription: 'National institution presenting the history and cultural heritage of Jordan.',
            typology: 'Cultural',
            architecturalStyle: 'Modern',
            year: 2014,
            status: ProjectStatus.APPROVED,
            authorId: authorUser.id,
            reviewerId: expertUser.id,
            disciplines: {
                create: [
                    { type: 'Architectural', contentJson: JSON.stringify({ description: 'Stone-clad volumes reflecting the rugged landscape.' }) },
                    { type: 'Exhibition', contentJson: JSON.stringify({ system: 'State-of-the-art interactive displays and lighting.' }) }
                ]
            },
            attachments: {
                create: [
                    { type: 'photo', url: '/images/jordan-museum.jpg', description: 'Exterior View' }
                ]
            }
        }
    });

    await prisma.project.create({
        data: {
            title: 'Queen Alia International Airport',
            location: 'Amman, Jordan',
            latitude: 31.7225,
            longitude: 35.9933,
            mapLink: 'https://maps.google.com/?q=31.7225,35.9933',
            shortDescription: 'Modern terminal mimicking Bedouin tents with a modular roof canopy.',
            typology: 'Infrastructure',
            architecturalStyle: 'High-Tech',
            year: 2013,
            status: ProjectStatus.APPROVED,
            authorId: authorUser.id,
            reviewerId: academicUser.id,
            disciplines: {
                create: [
                    { type: 'Architectural', contentJson: JSON.stringify({ description: 'Modular roof canopy inspired by Bedouin tents.' }) },
                    { type: 'Structural', contentJson: JSON.stringify({ material: 'Concrete domes with shallow arches.' }) }
                ]
            },
            attachments: {
                create: [
                    { type: 'photo', url: '/images/qaia-terminal.jpg', description: 'Terminal Roof Canopy' }
                ]
            }
        }
    });

    await prisma.project.create({
        data: {
            title: 'King Abdullah I Mosque',
            location: 'Amman, Jordan',
            latitude: 31.9614,
            longitude: 35.9126,
            mapLink: 'https://maps.google.com/?q=31.9614,35.9126',
            shortDescription: 'A landmark mosque distinguished by its massive blue mosaic dome.',
            typology: 'Religious',
            architecturalStyle: 'Islamic Revival',
            year: 1989,
            status: ProjectStatus.PENDING_REVIEW,
            authorId: authorUser.id,
            disciplines: {
                create: [
                    { type: 'Architectural', contentJson: JSON.stringify({ description: 'Octagonal prayer hall topped by a blue dome.' }) },
                    { type: 'Artistic', contentJson: JSON.stringify({ modeling: 'Intricate blue mosaic tiles and Islamic calligraphy.' }) }
                ]
            }
        }
    });

    await prisma.project.create({
        data: {
            title: 'Royal Automobile Museum',
            location: 'Amman, Jordan',
            latitude: 31.9833,
            longitude: 35.8333,
            mapLink: 'https://maps.google.com/?q=31.9833,35.8333',
            shortDescription: 'Showcases the late King Husseins cars in a sleek, purpose-built facility.',
            typology: 'Cultural',
            architecturalStyle: 'Contemporary',
            year: 2003,
            status: ProjectStatus.APPROVED,
            authorId: authorUser.id,
            reviewerId: academicUser.id, // Academic review
            disciplines: {
                create: [
                    { type: 'Architectural', contentJson: JSON.stringify({ description: 'Circular progression leading through automotive history.' }) },
                    { type: 'Lighting', contentJson: JSON.stringify({ focus: 'Theatrical spotlighting for classic vehicles.' }) }
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
