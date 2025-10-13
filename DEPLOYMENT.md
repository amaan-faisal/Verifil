# VeriFil Deployment Guide

## Frontend Deployment (Vercel)

### 1. Prepare for Deployment
- All pages are created and functional
- Landing page at `/` (root)
- Wallets page at `/wallets`
- Transactions page at `/transactions`
- Portfolio page at `/portfolio`

### 2. Deploy to Vercel

#### Option A: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Sign in with GitHub
4. Click "New Project"
5. Import your repository
6. Vercel will auto-detect Next.js settings
7. Click "Deploy"

#### Option B: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 3. Custom Domain Setup
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. SSL certificate will be auto-generated

## Backend Deployment (Flask API)

### Option 1: Heroku (Recommended for Flask)
```bash
# Install Heroku CLI
# Create Procfile
echo "web: python app.py" > Procfile

# Create requirements.txt
pip freeze > requirements.txt

# Deploy
heroku create your-app-name
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option 2: Railway
1. Connect GitHub repository
2. Railway auto-detects Python
3. Set environment variables
4. Deploy automatically

### Option 3: Render
1. Connect GitHub repository
2. Choose "Web Service"
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python app.py`

## Environment Variables

### Frontend (Vercel)
Set in Vercel dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.herokuapp.com
```

### Backend (Heroku/Railway/Render)
```
ETHERSCAN_API_KEY=your_etherscan_key
COINGECKO_API_KEY=your_coingecko_key
HONEYPOT_API_KEY=your_honeypot_key
```

## Post-Deployment Steps

1. **Update API URLs**: Change `lib/api.ts` to use production backend URL
2. **Test All Features**: Verify wallet analysis, transactions, portfolio work
3. **SSL Certificates**: Ensure HTTPS is enabled
4. **Performance**: Check Core Web Vitals in Vercel dashboard

## Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Backend Logs**: Check Heroku/Railway/Render logs
- **Error Tracking**: Consider Sentry for production error monitoring

## Cost Estimation

- **Vercel**: Free tier (100GB bandwidth, unlimited deployments)
- **Heroku**: $7/month for basic dyno
- **Railway**: $5/month for hobby plan
- **Render**: Free tier available

## Security Checklist

- [ ] API keys are in environment variables
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] HTTPS is enforced
- [ ] No sensitive data in client-side code

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints manually
4. Check browser console for errors

