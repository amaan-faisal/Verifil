# VeriFil - Crypto Portfolio Analyzer

A modern web application for analyzing Ethereum wallets, detecting scams, and monitoring crypto portfolios. Built with Next.js 14 and Flask.

## 🌟 Features

- **Landing Page**: Professional marketing page with features showcase
- **Wallet Dashboard**: Connect and analyze Ethereum wallets
- **Transaction History**: Detailed transaction records with filtering
- **Portfolio Overview**: Comprehensive portfolio analytics and risk assessment
- **Risk Analysis**: Detect honeypots, rug pulls, and risky tokens
- **Real-time Data**: Live blockchain data integration

## 🚀 Live Demo

- **Landing Page**: `/` - Professional homepage
- **Wallets**: `/wallets` - Wallet management and analysis
- **Transactions**: `/transactions` - Transaction history and filtering
- **Portfolio**: `/portfolio` - Portfolio overview and analytics

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Flask (Python)
- **APIs**: Etherscan, CoinGecko, 1inch, Honeypot.is
- **Styling**: Tailwind CSS with dark theme
- **Deployment**: Vercel (Frontend), Heroku/Railway (Backend)

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Portfolio-App
   ```

2. **Install dependencies**
   ```bash
   # Windows
   install.bat
   
   # Linux/Mac
   chmod +x install.sh
   ./install.sh
   ```

3. **Start the development servers**
   ```bash
   # Windows
   start-dev.bat
   
   # Linux/Mac
   chmod +x start-dev.sh
   ./start-dev.sh
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
Portfolio-App/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── wallets/           # Wallet dashboard
│   │   └── page.tsx       # Wallets page
│   ├── transactions/      # Transaction history
│   │   └── page.tsx       # Transactions page
│   ├── portfolio/         # Portfolio overview
│   │   └── page.tsx       # Portfolio page
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── WalletCard.tsx     # Wallet display card
│   ├── WalletDetails.tsx  # Detailed wallet view
│   ├── AddWalletModal.tsx # Add wallet modal
│   ├── RiskAnalysis.tsx   # Risk analysis component
│   ├── TransactionHistory.tsx # Transaction list
│   └── DeleteInstructions.tsx # Delete instructions
├── lib/                   # Utility libraries
│   ├── api.ts            # API client
│   ├── utils.ts          # Helper functions
│   └── demo-data.ts      # Sample data
├── app.py                # Flask backend
├── vercel.json           # Vercel configuration
├── deploy.bat            # Windows deployment script
├── deploy.sh             # Linux/Mac deployment script
├── DEPLOYMENT.md         # Deployment guide
└── README.md
```

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically
4. Add custom domain

### Backend (Heroku/Railway/Render)
1. Deploy Flask app to cloud provider
2. Set environment variables
3. Update frontend API URL

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🔧 API Endpoints

### Wallet Information
- `GET /api/wallet/<address>` - Get wallet details and holdings
- `GET /api/wallet/<address>/transactions` - Get transaction history
- `GET /api/wallet/<address>/risk-analysis` - Get risk assessment

### Health Check
- `GET /api/health` - API health status

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Keys (for production)
ETHERSCAN_API_KEY=your_etherscan_api_key
COINGECKO_API_KEY=your_coingecko_api_key
HONEYPOT_API_KEY=your_honeypot_api_key

# Backend URL (for production)
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## 💻 Development

### Frontend Development
```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend Development
```bash
python app.py        # Start Flask server
```

## 📊 Features in Detail

### Landing Page
- Professional marketing design
- Feature highlights
- Call-to-action buttons
- Statistics showcase

### Wallet Dashboard
- Real-time ETH balance
- ERC-20 token holdings
- USD value calculations
- Portfolio overview
- Risk analysis integration

### Transaction History
- ETH transactions
- ERC-20 token transfers
- Advanced filtering
- Gas fee tracking
- Block confirmation status

### Portfolio Overview
- Aggregated portfolio value
- Asset distribution charts
- Risk assessment summary
- Top holdings analysis
- Wallet comparison

### Risk Assessment
- Honeypot detection
- Rug pull analysis
- New token warnings
- Holder count analysis
- Risk scoring system

## 🚀 Quick Deployment

```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue on GitHub.