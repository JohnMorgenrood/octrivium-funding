# Google OAuth Setup Instructions

## 🔐 How to Get Google OAuth Credentials

### Step 1: Go to Google Cloud Console
1. Visit https://console.cloud.google.com/
2. Sign in with your Google account (golearnx@gmail.com)

### Step 2: Create a New Project (if needed)
1. Click on the project dropdown at the top
2. Click "New Project"
3. Name it "Octrivium Funding" or similar
4. Click "Create"

### Step 3: Enable Google+ API
1. In the sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### Step 4: Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (for public users)
3. Fill in:
   - App name: Octrivium Funding
   - User support email: golearnx@gmail.com
   - Developer email: golearnx@gmail.com
4. Click "Save and Continue"
5. Skip "Scopes" (click "Save and Continue")
6. Skip "Test users" (click "Save and Continue")

### Step 5: Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "+ Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Set Name: "Octrivium Web Client"
5. Add Authorized JavaScript origins:
   - http://localhost:3000
   - https://your-production-domain.com (when deployed)
6. Add Authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google
   - https://your-production-domain.com/api/auth/callback/google (when deployed)
7. Click "Create"

### Step 6: Copy Your Credentials
You'll see a popup with:
- **Client ID**: Looks like `1054672467890-abc123xyz.apps.googleusercontent.com`
- **Client Secret**: Looks like `GOCSPX-abcdefghijklmnopqrstuvwxyz`

### Step 7: Update Your .env File
Replace the placeholder values in `.env`:

```env
GOOGLE_CLIENT_ID="your-actual-client-id-here"
GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
```

### Step 8: Restart Your Dev Server
```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## ✅ Testing Google Sign-In

1. Go to http://localhost:3000/login
2. Click "Sign in with Google"
3. Choose your Google account
4. Grant permissions

### First Time Sign-In (golearnx@gmail.com):
- ✅ Account automatically created
- ✅ Given ADMIN role
- ✅ Given BUSINESS tier subscription
- ✅ Can access /admin dashboard
- ✅ Unlimited invoices
- ✅ Can add team members

### Other Google Accounts:
- ✅ Account created with INVESTOR role
- ✅ Given FREE tier subscription
- ✅ Normal user access

---

## 🎯 What You Can Do Now

### As Admin (golearnx@gmail.com):
1. **Access Admin Dashboard**: `/admin`
   - View all users and subscriptions
   - See platform revenue
   - Manage user accounts

2. **Use Accounting Software**:
   - Unlimited invoices
   - Add team members (up to 4)
   - Add custom Yoco API keys
   - Add bank EFT details
   - Send payment reminders

3. **Send Invoice Reminders**:
   - Open any unpaid invoice
   - Click "Send Reminder" button
   - Customer receives email with payment link

---

## 🚀 Production Deployment

When deploying to Vercel/production:

1. Add your production domain to Google OAuth:
   - Go back to Google Cloud Console
   - Add your Vercel URL to authorized origins and redirect URIs

2. Update environment variables on Vercel:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   NEXTAUTH_URL=https://your-vercel-app.vercel.app
   ```

3. Test sign-in on production!

---

## 📧 Email Integration (Next Step)

To send actual reminder emails, you need to set up Resend:

1. Sign up at https://resend.com
2. Get your API key
3. Update `.env`:
   ```
   RESEND_API_KEY="re_your_api_key_here"
   EMAIL_FROM="noreply@yourdomain.com"
   ```

The email template is already built in `/api/invoices/send-reminder`!
