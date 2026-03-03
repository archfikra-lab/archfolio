'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

// Using absolute path for messages based on the NextJS root.
const messagesDir = path.join(process.cwd(), 'messages');

export async function fetchTranslations() {
    try {
        const enPath = path.join(messagesDir, 'en.json');
        const arPath = path.join(messagesDir, 'ar.json');

        const enObj = JSON.parse(fs.readFileSync(enPath, 'utf8'));
        const arObj = JSON.parse(fs.readFileSync(arPath, 'utf8'));

        return { success: true, en: enObj, ar: arObj };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function saveTranslations(enObj: any, arObj: any) {
    try {
        const enPath = path.join(messagesDir, 'en.json');
        const arPath = path.join(messagesDir, 'ar.json');

        // Write formatted JSON
        fs.writeFileSync(enPath, JSON.stringify(enObj, null, 4), 'utf8');
        fs.writeFileSync(arPath, JSON.stringify(arObj, null, 4), 'utf8');

        revalidatePath('/', 'layout'); // clear everything

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
