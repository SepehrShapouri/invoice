import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface InvoiceEmailData {
  clientName: string
  clientEmail: string
  invoiceSlug: string
  total: number
  currency: string
  senderName: string
  senderEmail: string
}

export async function sendInvoiceEmail(data: InvoiceEmailData) {
  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${data.invoiceSlug}`
  
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">New Invoice</h1>
      </div>
      
      <div style="padding: 30px 20px;">
        <p style="font-size: 16px; color: #333;">Hi ${data.clientName},</p>
        
        <p style="color: #666; line-height: 1.6;">
          You've received a new invoice from <strong>${data.senderName}</strong> for <strong>$${data.total.toFixed(2)} ${data.currency.toUpperCase()}</strong>.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${publicUrl}" 
             style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            View & Pay Invoice
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          Invoice #${data.invoiceSlug}<br>
          <a href="${publicUrl}" style="color: #4F46E5;">${publicUrl}</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px;">
          If you have any questions about this invoice, please contact ${data.senderName} at ${data.senderEmail}.
        </p>
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px;">
        Powered by Invoicely
      </div>
    </div>
  `

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: `Invoicely <onboarding@resend.dev>`,
      to: [data.clientEmail],
      subject: `Invoice #${data.invoiceSlug} from ${data.senderName}`,
      html: emailContent,
      replyTo: data.senderEmail
    })

    if (error) {
      throw new Error(`Email sending failed: ${error.message}`)
    }

    return { success: true, emailId: emailData?.id }
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

export async function sendInvoiceEmailPlain(data: InvoiceEmailData) {
  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${data.invoiceSlug}`
  
  const plainText = `
Hi ${data.clientName},

You've received a new invoice from ${data.senderName} for $${data.total.toFixed(2)} ${data.currency.toUpperCase()}.

View and pay your invoice here: ${publicUrl}

Invoice #${data.invoiceSlug}

If you have any questions about this invoice, please contact ${data.senderName} at ${data.senderEmail}.

---
Powered by Invoicely
  `

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: `Invoicely <onboarding@resend.dev>`,
      to: [data.clientEmail],
      subject: `Invoice #${data.invoiceSlug} from ${data.senderName}`,
      text: plainText.trim(),
      replyTo: data.senderEmail
    })

    if (error) {
      throw new Error(`Email sending failed: ${error.message}`)
    }

    return { success: true, emailId: emailData?.id }
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
} 