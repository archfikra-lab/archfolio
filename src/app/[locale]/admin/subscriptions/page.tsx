import SubscriptionsClient from "./SubscriptionsClient";
import { getSubscriptionPlansAction } from "@/app/actions/subscriptions";

export default async function AdminSubscriptionsPage() {
    const result = await getSubscriptionPlansAction();
    const plans = result.data || [];

    return <SubscriptionsClient initialPlans={plans} />;
}
