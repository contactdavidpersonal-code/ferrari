# Resend Lead Email Integration Setup

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Resend API Key (already added)
RESEND_API_KEY=re_your_api_key_here

# Email to receive lead notifications (Nicole's email)
RESEND_TO_EMAIL=nicole@example.com

# From email address (must be verified domain in Resend)
# For development, you can use onboarding@resend.dev
# For production, use your verified domain
RESEND_FROM_EMAIL=leads@nmsrealtypa.homes
```

## Setup Steps

### 1. Configure Resend Domain (Production)

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add your domain: `nmsrealtypa.homes`
3. Add the DNS records provided by Resend
4. Once verified, you can use `leads@nmsrealtypa.homes` as the FROM address

### 2. For Development/Testing

Use Resend's onboarding email:
```bash
RESEND_FROM_EMAIL=onboarding@resend.dev
```

This will work immediately for testing, but emails will have a "via resend.dev" notice.

### 3. Set Nicole's Email

Update the `RESEND_TO_EMAIL` with the actual email address where lead notifications should be sent:
```bash
RESEND_TO_EMAIL=nicole@thepreferredrealty.com
```

## How It Works

### Contact Form Leads
1. User fills out contact form on website
2. Lead is saved to Neon database (`leads` table)
3. Email notification is sent to Nicole via Resend
4. Email includes: name, contact details, buying stage, preferred contact time

### AI Chat Leads
1. AI assistant naturally asks for contact information during conversation
2. When user provides email/phone/name AND expresses interest in being contacted
3. Lead is automatically captured and saved to database
4. Email notification is sent to Nicole with full conversation history
5. Email includes properties the user was interested in

## Lead Email Format

The emails sent to Nicole include:
- **Header:** "New Lead from NMS Realty Website"
- **Source Badge:** "Contact Form" or "AI Chat Conversation"
- **Contact Information:** Name, email, phone, preferred contact method
- **Lead Details:** Buying stage, best time to contact
- **Message/Conversation:** User's message or full AI chat transcript
- **Properties of Interest:** Properties the user viewed or discussed
- **Footer:** Lead ID, timestamp

## Testing

1. Test contact form submission
2. Test AI chat lead capture by:
   - Chatting about properties
   - Providing your email when AI asks
   - Confirming you want Nicole to contact you

## Troubleshooting

### Emails not sending?
- Check RESEND_API_KEY is correct
- Verify RESEND_FROM_EMAIL domain is verified (or use onboarding@resend.dev)
- Check Resend dashboard for error logs

### Emails going to spam?
- Verify domain DNS records in Resend
- Use a verified domain instead of onboarding@resend.dev
- Check SPF, DKIM, and DMARC records

