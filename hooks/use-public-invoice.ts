import { Invoice } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type InvoiceResponse = {
  success: boolean;
  invoice: Invoice;
};

const fetchPublicInvoice = async (slug: string) => {
  const response = await axios.get<InvoiceResponse>(
    `/api/public/invoices/${slug}`
  );
  if (!response.data.success) {
    throw new Error("Failed to fetch invoice");
  }
  return response.data.invoice;
};

export default function usePublicInvoice(slug: string) {
  return useQuery({
    queryKey: ["invoice", slug],
    queryFn: () => fetchPublicInvoice(slug),
    retry: 2,
  });
}
