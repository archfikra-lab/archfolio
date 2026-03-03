import { getSubscribersAction } from "@/app/actions/subscribers";
import { getSubscriptionPlansAction } from "@/app/actions/subscriptions";
import SubscribersClient from "./SubscribersClient";

export default async function SubscribersPage() {
    const dataResponse = await getSubscribersAction();
    const plansResponse = await getSubscriptionPlansAction();

    return <SubscribersClient
        initialUsers={dataResponse.success ? dataResponse.users : []}
        initialSettings={dataResponse.success ? dataResponse.settings : null}
        plans={plansResponse.success ? plansResponse.data : []}
    />;
}
