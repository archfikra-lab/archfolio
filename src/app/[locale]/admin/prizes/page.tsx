import PrizesClient from "./PrizesClient";
import { getPrizesAction } from "@/app/actions/prizes";

export default async function AdminPrizesPage() {
    const result = await getPrizesAction();
    const prizes = result.data || [];

    return <PrizesClient initialPrizes={prizes} />;
}
