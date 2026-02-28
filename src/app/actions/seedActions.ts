'use server';

import { prisma } from '@/lib/prisma';

export async function seedDemoData() {
    try {
        // Seed Partners
        const partners = [
            { name: 'Kone Elevators', logoUrl: '/partners/kone.png', websiteUrl: 'https://kone.com', tier: 'PLATINUM', description: 'World-class vertical transportation solutions', order: 1, active: true },
            { name: 'Schüco International', logoUrl: '/partners/schuco.png', websiteUrl: 'https://schueco.com', tier: 'PLATINUM', description: 'Premium façade & window systems', order: 2, active: true },
            { name: 'Sika Construction', logoUrl: '/partners/sika.png', websiteUrl: 'https://sika.com', tier: 'GOLD', description: 'Specialty chemicals for construction', order: 3, active: true },
            { name: 'Hilti Corporation', logoUrl: '/partners/hilti.png', websiteUrl: 'https://hilti.com', tier: 'GOLD', description: 'Professional construction tools & systems', order: 4, active: true },
            { name: 'Zaha Hadid Architects', logoUrl: '/partners/zha.png', websiteUrl: 'https://zaha-hadid.com', tier: 'GOLD', description: 'Iconic parametric design studio', order: 5, active: true },
            { name: 'Autodesk', logoUrl: '/partners/autodesk.png', websiteUrl: 'https://autodesk.com', tier: 'SILVER', description: 'BIM & design software solutions', order: 6, active: true },
            { name: 'Trimble', logoUrl: '/partners/trimble.png', websiteUrl: 'https://trimble.com', tier: 'SILVER', description: 'Construction technology & positioning', order: 7, active: true },
            { name: 'ArcelorMittal', logoUrl: '/partners/arcelor.png', websiteUrl: 'https://arcelormittal.com', tier: 'SILVER', description: 'Leading steel and mining company', order: 8, active: true },
        ];

        for (const p of partners) {
            await (prisma as any).partner.upsert({
                where: { name: p.name },
                update: p,
                create: p,
            });
        }

        // Seed Donors
        const donors = [
            { name: 'The Aga Khan Foundation', logoUrl: '/donors/akf.png', amount: 250000, message: 'Supporting architectural heritage preservation worldwide', featured: true, active: true },
            { name: 'Arab Fund for Arts & Culture', logoUrl: '/donors/afac.png', amount: 150000, message: 'Empowering Arab architects through documentation', featured: true, active: true },
            { name: 'UNESCO Heritage Fund', logoUrl: '/donors/unesco.png', amount: 100000, message: 'Preserving built environment for future generations', featured: false, active: true },
            { name: 'King Abdullah II Design Award', logoUrl: '/donors/kadda.png', amount: 75000, message: 'Honoring design excellence in the MENA region', featured: false, active: true },
            { name: 'Masdar Clean Energy', logoUrl: '/donors/masdar.png', amount: 50000, message: 'Advancing sustainable architecture documentation', featured: false, active: true },
            { name: 'Jordan Engineers Association', logoUrl: '/donors/jea.png', amount: 25000, message: 'Bridging professional practice and academic research', featured: false, active: true },
        ];

        for (const d of donors) {
            await (prisma as any).donor.upsert({
                where: { name: d.name },
                update: d,
                create: d,
            });
        }

        // Seed Ads
        const ads = [
            {
                title: 'Schüco Parametric Façades',
                content: 'High-performance glazing solutions engineered for the modern architectural envelope. Award-winning systems for energy efficiency.',
                imageUrl: '/ads/schueco-facade.jpg',
                linkUrl: 'https://schueco.com',
                placement: 'HOMEPAGE',
                tier: 'PLATINUM',
                active: true,
                impressions: 12450,
                clicks: 387,
            },
            {
                title: 'Hilti BIM/CAD Library',
                content: 'Access 50,000+ BIM objects and technical specifications. Free for registered architects and engineers.',
                imageUrl: '/ads/hilti-bim.jpg',
                linkUrl: 'https://hilti.com/bim',
                placement: 'EXPLORE',
                tier: 'GOLD',
                active: true,
                impressions: 8920,
                clicks: 245,
            },
            {
                title: 'Autodesk Revit 2025',
                content: 'The industry-standard BIM software. New AI-powered design assistance and real-time collaboration.',
                imageUrl: '/ads/autodesk-revit.jpg',
                linkUrl: 'https://autodesk.com/revit',
                placement: 'HOMEPAGE',
                tier: 'GOLD',
                active: true,
                impressions: 15600,
                clicks: 521,
            },
            {
                title: 'Sika Waterproofing Solutions',
                content: 'Complete waterproofing systems for below-grade and above-grade applications. Technical support available.',
                imageUrl: '/ads/sika-waterproof.jpg',
                linkUrl: 'https://sika.com',
                placement: 'SIDEBAR',
                tier: 'SILVER',
                active: true,
                impressions: 5340,
                clicks: 112,
            },
        ];

        for (const a of ads) {
            const existing = await (prisma as any).ad.findFirst({ where: { title: a.title } });
            if (!existing) {
                await (prisma as any).ad.create({ data: a });
            }
        }

        return { success: true, partners: partners.length, donors: donors.length, ads: ads.length };
    } catch (error: any) {
        console.error('Seed error:', error);
        return { success: false, error: error.message };
    }
}
