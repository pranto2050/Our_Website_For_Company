# Vercel Deployment Guide

## 🚨 Fixing the Blank Page Issue

Your Vercel deployment shows a blank page because environment variables are not configured.

## ✅ Quick Fix (2 Steps):

### Step 1: Add Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/pranto2050/our-website-for-company/settings/environment-variables
2. Add these two variables:

**Variable 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://psjkbzxaaifkfyqizuiz.supabase.co`

**Variable 2:**
- Name: `VITE_SUPABASE_PUBLISHABLE_KEY`
- Value: `your_supabase_anon_key_here`

(Use the placeholder value for now - demo mode will work)

### Step 2: Redeploy

After adding the variables, redeploy:
```bash
git add .
git commit -m "Add demo mode support"
git push
```

Or manually trigger a redeploy in Vercel dashboard.

## 🎭 Demo Mode

With the placeholder key, your site will run in **Demo Mode**:
- ✅ Full UI functionality
- ✅ Demo login works
- ✅ Client: demo.client@abitsolutions.com / Demo@123456
- ✅ Admin: demo.admin@abitsolutions.com / Admin@123456
- ⚠️ No real database (data doesn't persist)

## 🚀 For Production (Get Real Keys):

1. Go to https://app.supabase.com/project/psjkbzxaaifkfyqizuiz/settings/api
2. Copy the actual **anon/public** key
3. Update the `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel
4. Redeploy

## 🔍 Troubleshooting

If the blank page persists:
1. Check Vercel deployment logs for errors
2. Check browser console (F12) for errors
3. Ensure both environment variables are set
4. Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
