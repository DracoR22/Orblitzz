import { Resend } from 'resend';
import SubscriptionReceiptEmail from '@/emails/subscription-receipt-email'

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendSubscriptionReceiptEmail = async ({ userEmail }: { userEmail: string, price: number }) => {
      await resend.emails.send({
        from: `support@orblitzz.com`,
        to: userEmail,
        subject: 'Your Orblitzz receipt',
        react: SubscriptionReceiptEmail({
           userEmail
        }),
      });

      return null
}
