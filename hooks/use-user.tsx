import { useQuery } from "@tanstack/react-query"
import axios from "axios"

interface UserSubscription {
    plan: string;
    subscriptionStatus?: string;
    invoicesSentThisMonth: number;
}

interface User {
    subscription: UserSubscription;
}

const fetchUser = async () => {
    const response = await axios.get<{ success: boolean; user: User }>("/api/user")
    if (!response.data.success) {
        throw new Error("Failed to fetch user data")
    }
    return response.data.user
}

export default function useUser() {
    const query = useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
    })

    return {
        ...query,
        subscription: query.data?.subscription,
        isPro: query.data?.subscription.plan === 'pro' && query.data?.subscription.subscriptionStatus === 'active',
        canCreateInvoice: query.data?.subscription.plan === 'pro' ||
            (query.data?.subscription.plan === 'free' && query.data?.subscription.invoicesSentThisMonth < 1)
    }
} 