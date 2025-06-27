# Deployment Guide for eBlessings

## Option 1: Deploy to Netlify (Recommended)

### Step 1: Create a GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `eblessings` or any name you prefer
3. Make it public or private (your choice)

### Step 2: Push Your Code to GitHub
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit the changes
git commit -m "Initial commit: eBlessings anniversary website"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### Step 3: Deploy to Netlify
1. Go to [Netlify](https://netlify.com) and sign up/login
2. Click "New site from Git"
3. Choose GitHub and select your repository
4. Configure the build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
5. Click "Deploy site"

### Step 4: Configure Environment Variables (Optional)
In Netlify dashboard, go to Site settings > Environment variables and add:
- `NODE_VERSION`: `18`

## Option 2: Deploy to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts
```

## Option 3: Deploy to GitHub Pages

### Step 1: Add homepage to package.json
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
}
```

### Step 2: Install gh-pages
```bash
npm install --save-dev gh-pages
```

### Step 3: Add deploy scripts to package.json
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### Step 4: Deploy
```bash
npm run deploy
```

## After Deployment

### Test Your Website
1. Visit your deployed URL
2. Test video recording (should work better on HTTPS)
3. Test audio recording
4. Access admin panel with password: `parents2024`

### Share with Family
- Send the public URL to family and friends
- They can record messages without any login
- All recordings will be visible in your admin panel

### Custom Domain (Optional)
- In Netlify/Vercel, you can add a custom domain
- Example: `eblessings.yourdomain.com`

## Troubleshooting

### Camera/Microphone Issues
- HTTPS is required for media access
- Make sure to allow permissions when prompted
- Try different browsers if issues persist

### Build Issues
- Check that all dependencies are in package.json
- Ensure Node.js version is compatible
- Check build logs for errors

## Security Notes

### Admin Password
- The admin password is hardcoded in the app
- For production, consider implementing proper authentication
- Change the password in `src/App.js` if needed

### Data Storage
- Currently using mock data
- For persistent storage, implement a backend API
- Consider using services like Firebase, Supabase, or your own server 