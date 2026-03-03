import { fetchTranslations } from "@/app/actions/translations";
import TranslationsClient from "./TranslationsClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TranslationsAdminPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        redirect('/');
    }

    const { en, ar, success, error } = await fetchTranslations();

    if (!success) {
        return (
            <div className="tracing-paper p-8 rounded-lg shadow-sm border border-red-500/20 w-max bg-red-50 text-red-700">
                <h2 className="text-xl font-bold mb-2 uppercase">Error Loading Translations</h2>
                <p>{error}</p>
            </div>
        );
    }

    return <TranslationsClient initialEn={en} initialAr={ar} />;
}
