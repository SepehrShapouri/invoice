import { Invoice } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type InvoiceResponse = {
    success: boolean;
    invoice: Invoice;
  };

  const fetchInvoice = async (slug: string) => {
    const response = await axios.get<InvoiceResponse>(`/api/invoices/${slug}`)
    if (!response.data.success) {
        throw new Error("Failed to fetch invoice")
    }
    return response.data.invoice
  }

  export default function useInvoice(slug: string) {
    return useQuery({
        queryKey: ["invoice", slug],
        queryFn: () => fetchInvoice(slug),
        retry: 2
    })
  }