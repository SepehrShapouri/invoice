// useSendInvoice.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Invoice } from "@/types";

type InvoiceResponse = {
  success: boolean;
  invoice: Invoice;
};

const sendInvoice = async (slug: string) => {
  const response = await axios.post<InvoiceResponse>(`/api/invoices/${slug}/send`);
  if (!response.data.success) {
    throw new Error("Failed to fetch invoice");
  }
  return response.data.invoice;
};

export default function useSendInvoice() {
  return useMutation({
    mutationFn: (slug: string) => sendInvoice(slug),
    retry: 2,
  });
}
