# SMTP Email Configuration Guide

## Overview
GENFITY menggunakan SMTP untuk mengirim email notifications seperti:
- Password credentials untuk merchant/staff baru
- Order confirmation untuk customer
- Password reset links (future feature)

## Supported Email Providers

### 1. Gmail (Recommended untuk Development)

**Step 1: Enable 2-Factor Authentication**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification"

**Step 2: Generate App Password**
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select app: "Mail"
3. Select device: "Other" → enter "GENFITY"
4. Click "Generate"
5. Copy the 16-character password

**Step 3: Configure `.env.local`**
```env
EMAIL_FROM="your-email@gmail.com"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="xxxx xxxx xxxx xxxx"  # App password from step 2
```

### 2. Outlook / Hotmail

```env
EMAIL_FROM="your-email@outlook.com"
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_USER="your-email@outlook.com"
SMTP_PASSWORD="your-password"
```

### 3. SendGrid (Recommended untuk Production)

**Step 1: Create SendGrid Account**
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Verify your email
3. Create API Key

**Step 2: Configure**
```env
EMAIL_FROM="noreply@yourdomain.com"
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="YOUR_SENDGRID_API_KEY"
```

### 4. Mailgun

```env
EMAIL_FROM="noreply@yourdomain.com"
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="postmaster@yourdomain.mailgun.org"
SMTP_PASSWORD="your-mailgun-password"
```

### 5. Custom SMTP Server

```env
EMAIL_FROM="noreply@yourdomain.com"
SMTP_HOST="mail.yourdomain.com"
SMTP_PORT="587"  # or 465 for SSL
SMTP_USER="your-username"
SMTP_PASSWORD="your-password"
```

## Testing Email Configuration

### Option 1: Via API Endpoint (After API is built)
```bash
curl -X POST http://localhost:3000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@example.com"}'
```

### Option 2: Via Code
Create `scripts/test-email.ts`:
```typescript
import emailService from '@/lib/services/EmailService';

async function testEmail() {
  const result = await emailService.sendTestEmail('your-email@example.com');
  console.log('Email sent:', result);
}

testEmail();
```

Run:
```bash
npx tsx scripts/test-email.ts
```

## Common SMTP Ports

| Port | Protocol | Description |
|------|----------|-------------|
| 25   | SMTP     | Standard (often blocked by ISPs) |
| 465  | SMTPS    | SMTP over SSL (secure) |
| 587  | SMTP     | SMTP with STARTTLS (recommended) |
| 2525 | SMTP     | Alternative port (SendGrid, Mailgun) |

## Troubleshooting

### Error: "Invalid login"
- **Gmail**: Make sure you're using App Password, not regular password
- **Outlook**: Enable "Less secure app access" in account settings
- **Others**: Verify username and password are correct

### Error: "Connection timeout"
- Check if port is correct (587 or 465)
- Check firewall settings
- Try alternative port (2525)

### Error: "Self-signed certificate"
For development with self-signed certificates:
```typescript
// In EmailService.ts, add to transporter config:
{
  tls: {
    rejectUnauthorized: false
  }
}
```
⚠️ **Never use this in production!**

### Error: "Message rejected"
- Verify EMAIL_FROM address
- For Gmail: EMAIL_FROM must match SMTP_USER
- For SendGrid/Mailgun: Verify domain is verified

### Emails going to spam
1. **SPF Record**: Add to your domain DNS
   ```
   v=spf1 include:_spf.google.com ~all
   ```

2. **DKIM**: Configure in SendGrid/Mailgun

3. **DMARC**: Add to domain DNS
   ```
   v=DMARC1; p=none; rua=mailto:admin@yourdomain.com
   ```

## Production Best Practices

### 1. Use Professional Email Service
- ❌ Gmail (limited to 500 emails/day)
- ✅ SendGrid (40,000 free emails/month)
- ✅ Mailgun (5,000 free emails/month)
- ✅ AWS SES (pay-as-you-go)

### 2. Domain Verification
- Use your own domain (e.g., noreply@genfity.com)
- Verify domain with email provider
- Setup SPF, DKIM, DMARC records

### 3. Email Rate Limiting
Implement rate limiting to avoid spam flags:
```typescript
// Max 100 emails per hour per IP
// Max 1000 emails per day per merchant
```

### 4. Email Queue
For production, use queue system:
- **BullMQ** for Redis-based queue
- **AWS SQS** for cloud queue
- **RabbitMQ** for self-hosted

### 5. Email Templates
- Use responsive HTML templates
- Test on multiple email clients
- Include plain text fallback

## Environment Variables Summary

Required in `.env.local`:
```env
EMAIL_FROM="noreply@genfity.com"     # Sender email address
SMTP_HOST="smtp.gmail.com"            # SMTP server hostname
SMTP_PORT="587"                       # SMTP port
SMTP_USER="your-email@gmail.com"      # SMTP username
SMTP_PASSWORD="your-app-password"     # SMTP password/API key
```

## Email Templates Location

Email templates are in:
- `src/lib/utils/emailTemplates.ts`
  - `getPasswordNotificationTemplate()` - New account credentials
  - `getOrderConfirmationTemplate()` - Order confirmation

## Next Steps

1. Configure SMTP credentials in `.env.local`
2. Test email sending with test endpoint
3. Verify emails are not going to spam
4. For production: Setup SendGrid/Mailgun
5. Configure domain DNS records (SPF, DKIM, DMARC)

---

**Last Updated**: November 9, 2025
