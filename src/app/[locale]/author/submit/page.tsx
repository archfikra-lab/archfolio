import SubmitProjectClient from "./SubmitProjectClient";
import { getPrizesAction } from "@/app/actions/prizes";

export default async function SubmitProjectPage() {
    const result = await getPrizesAction(true); // only active
    const activePrizes = result.data || [];

    return <SubmitProjectClient activePrizes={activePrizes} />;
}

