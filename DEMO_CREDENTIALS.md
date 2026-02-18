# Demo Credentials

## 🔐 Demo User Accounts

### Regular Client Account
- **Email:** `demo.client@abitsolutions.com`
- **Password:** `Demo@123456`
- **Access:** Client Dashboard, Project Management, Support Tickets
- **Status:** Approved

### Admin Account
- **Email:** `demo.admin@abitsolutions.com`
- **Password:** `Admin@123456`
- **Access:** Full Admin Dashboard, User Management, All Settings
- **Status:** Approved with Admin Role

## 🚀 How to Enable Authentication

Your website is currently running but authentication features are disabled because the Supabase API key is not configured.

### Step 1: Get Your Supabase API Key

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Log in to your account
3. Select your project (ID: `psjkbzxaaifkfyqizuiz`)
4. Navigate to **Settings** → **API**
5. Copy the **anon/public** key (NOT the service_role key)

### Step 2: Update Environment Variables

1. Open `.env.local` file in the project root
2. Replace `your_supabase_anon_key_here` with the actual key you copied
3. Save the file

### Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C in terminal)
npm run dev
```

### Step 4: Seed Demo Users

After configuring the API key, you need to create the demo users:

1. Go to your Supabase Dashboard
2. Navigate to **Database** → **Functions**
3. Find `seed-demo-users` function
4. Click "Invoke function" to create the demo accounts

Alternatively, you can manually create users in **Authentication** → **Users** panel.

## 📝 Notes

- The demo credentials are already defined in the seed function
- All demo users are automatically approved and ready to use
- The admin account has full access to all admin features
- The client account can create projects and support tickets

## ⚠️ Security Note

Remember to change these demo credentials in production and never commit your actual Supabase keys to version control!
