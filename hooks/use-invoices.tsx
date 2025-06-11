import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Invoice } from "@/types"

interface InvoicesResponse {
    success: boolean;
    invoices: Invoice[];
}

const fetchInvoices = async () => {
    const response = await axios.get<InvoicesResponse>("/api/invoices")
    if (!response.data.success) {
        throw new Error("Failed to fetch invoices")
    }
    return response.data.invoices
}

export default function useInvoices() {
    return useQuery({
        queryKey: ["invoices"],
        queryFn: fetchInvoices,
        retry: 2
    })
}