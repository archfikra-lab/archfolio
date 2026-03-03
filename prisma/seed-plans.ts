import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Fikra Subscription Plans...');

    const plans = [
        {
            name: 'Academic License',
            description: 'Free access for students and researchers to foundational case studies.',
            price: 0.00,
            perMonth: false,
            downloadLimit: 3,
            featuresJson: JSON.stringify([
                'Access to standard archives',
                '3 full PDF blueprint downloads/month',
                'Basic technical viewing',
                'Community forum access'
            ]),
            active: true
        },
        {
            name: 'Professional Tier',
            description: 'Unrestricted access for practicing architects and structural engineers.',
            price: 15.00,
            perMonth: true,
            downloadLimit: -1,
            featuresJson: JSON.stringify([
                'Unlimited PDF blueprint downloads',
                'High-resolution detail viewing',
                'Export to CAD formats (DXF/DWG)',
                'Priority technical support',
                'Early access to Fikra Awards entries'
            ]),
            active: true
        },
        {
            name: 'Enterprise Portfolio',
            description: 'Custom solutions for large firm multi-seat access and API integrations.',
            price: 99.00,
            perMonth: true,
            downloadLimit: -1,
            featuresJson: JSON.stringify([
                'Up to 20 user seats',
                'Firm-wide unlimited downloads',
                'Direct API access to case metadata',
                'Custom localized branding',
                'Dedicated Technical Account Manager'
            ]),
            active: true
        }
    ];

    for (const plan of plans) {
        await prisma.subscriptionPlan.upsert({
            where: { name: plan.name },
            update: plan,
            create: plan,
        });
        console.log(`Upserted plan: ${plan.name}`);
    }

    console.log('Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
