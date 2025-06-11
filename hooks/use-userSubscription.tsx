import { useQuery } from "@tanstack/react-query"
import axios from "axios"

interface UserSubscription {
    plan: string;
    subscriptionStatus: string;
    subscriptionCurrentPeriodStart: string;
    subscriptionCurrentPeriodEnd: string;
    subscriptionCancelAtPeriodEnd: boolean;
    invoicesSentThisMonth: number;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
}

interface SubscriptionResponse {
    success: boolean;
    subscription: UserSubscription;
}

const fetchUserSubscription = async () => {
    const response = await axios.get<SubscriptionResponse>("/api/user/subscription")
    if (!response.data.success) {
        throw new Error("Failed to fetch subscription data")
    }
    return response.data.subscription
}

export default function useUserSubscription() {
    return useQuery({
        queryKey: ["user-subscription"],
        queryFn: fetchUserSubscription,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
        initialData: undefined
    })
}