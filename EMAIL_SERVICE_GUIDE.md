# Email Service Setup Guide

## ✅ What's Been Built

### 1. **Modern Email Dashboard** (`/dashboard/emails`)
   - Gmail-like interface with inbox, sent, drafts, starred, and trash folders
   - Email preview pane with full HTML rendering
   - Star/unstar emails
   - Search functionality
   - Compose modal for sending emails
   - Real-time quota tracking

### 2. **Database Schema**
   - `Email` model with full metadata (from, to, subject, body, attachments)
   - User fields for email plans: `emailPlanType`, `emailQuotaLimit`, `emailQuotaUsed`, `emailQuotaResetDate`
   - Support for threaded conversations, spam filtering, and folder management

### 3. **Subscription Plans** (`/dashboard/emails/upgrade`)
   - **FREE**: 50 emails/month - R0
   - **PRO**: 500 emails/month - R99/month
   - **BUSINESS**: Unlimited emails - R299/month
   - Yoco payment integration for upgrades
   - Beautiful pricing page with feature comparison

### 4. **API Endpoints**
   - `GET /api/emails` - Fetch emails by folder (inbox/sent/starred/trash)
   - `GET /api/emails/quota` - Get current usage and plan limits
   - `POST /api/emails/send` - Send new email (checks quota, increments usage)
   - `PATCH /api/emails/[id]` - Update email (mark read, star, etc.)
   - `DELETE /api/emails/[id]` - Soft delete email
   - `POST /api/webhooks/resend` - Receive incoming emails

### 5. **Yoco Integration**
   - Email subscription payments added to checkout API
   - Webhook handler processes successful upgrades
   - Automatic plan upgrade and quota reset on payment

## 🚀 Next Steps to Go Live

### Step 1: Configure Resend Webhook (for incoming emails)
1. Go to https://resend.com/webhooks
2. Click "Add Webhook"
3. Set URL to: `https://octrivium.co.za/api/webhooks/resend`
4. Select event: `email.received`
5. Click "Create Webhook"

### Step 2: Configure Domain for Receiving
1. In Resend dashboard, go to your domain (octrivium.co.za)
2. Enable "Inbound" routing
3. Set up email routing rules:
   - Forward all emails to webhook: `https://octrivium.co.za/api/webhooks/resend`
   - Or forward specific addresses: `support@octrivium.co.za`, `sales@octrivium.co.za`, etc.

### Step 3: Test Email Flow
1. Send a test email to `test@octrivium.co.za`
2. Check webhook logs in Resend dashboard
3. Verify email appears in `/dashboard/emails`

### Step 4: Set Up Custom Email Addresses (Optional)
Users can have their own email addresses like:
- `firstname@company.octrivium.co.za`
- Route through Resend inbound
- Store in user's inbox via webhook

## 🎨 Features Overview

### For Users:
- **Send emails** with quota tracking
- **Receive emails** in modern inbox
- **Search and filter** emails
- **Star important** emails
- **Organize** with folders
- **Upgrade plan** when limits reached

### For Business Model:
- **Freemium to Premium** conversion funnel
- **R99/month PRO** plan for growing businesses
- **R299/month BUSINESS** plan for enterprises
- **Quota enforcement** drives upgrades
- **Automatic renewal** via Yoco subscriptions

## 💡 Marketing as a Service

### Value Propositions:
1. **"Professional email included"** - No need for Gmail/Outlook
2. **"Send invoices AND emails"** - All-in-one platform
3. **"Team email management"** - BUSINESS plan feature
4. **"Unlimited emails"** - Enterprise upgrade path

### Pricing Strategy:
- FREE tier gets users hooked (50 emails = ~1-2 emails/day)
- PRO tier targets small businesses (500 emails = plenty for most)
- BUSINESS tier for high-volume users (unlimited = peace of mind)

## 🔧 Technical Details

### Quota System:
- Tracks `emailQuotaUsed` on each send
- Resets monthly via `emailQuotaResetDate`
- Enforces limits before sending (except BUSINESS plan)
- Shows visual quota indicator in dashboard

### Email Storage:
- All sent and received emails stored in database
- HTML and plain text versions preserved
- Attachments stored as JSON references
- Soft delete keeps emails in trash folder

### Security:
- All emails require authentication
- Users can only access their own emails
- Webhook validates sender domain
- Rate limiting via quota system

## 📊 Metrics to Track

1. **Email plan distribution** (FREE vs PRO vs BUSINESS)
2. **Quota usage rates** (how close to limits)
3. **Conversion rate** (FREE → PRO upgrades)
4. **Emails sent per user** (engagement metric)
5. **Revenue per user** from email plans

## 🎯 Future Enhancements

- [ ] Email templates (save common messages)
- [ ] Scheduled sending
- [ ] Email signatures
- [ ] Reply and forward functionality
- [ ] Attachment uploads
- [ ] Rich text editor for compose
- [ ] Email analytics (open rates, etc.)
- [ ] Team shared inboxes
- [ ] Auto-responders
- [ ] Email filters and rules

---

**Status**: ✅ Ready for production (pending Resend webhook setup)
