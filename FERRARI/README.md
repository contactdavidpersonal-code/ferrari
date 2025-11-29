# Pittsburgh Real Estate Pro - Nicole Marie Severson

A professional real estate landing page for Nicole Marie Severson, a eXp Realty agent specializing in the Pittsburgh, PA market. This modern, AI-powered website showcases property listings, market insights, and provides an intelligent chat assistant for lead generation.

## 🏠 Live Demo

- **Frontend**: [https://fullstack-473115.web.app](https://fullstack-473115.web.app)
- **Backend**: [https://my-awesome-agent-fpybslzlkq-uc.a.run.app](https://my-awesome-agent-fpybslzlkq-uc.a.run.app)

## ✨ Key Features

### 🏘️ Property Showcase
- **Commercial & Business**: Investment opportunities and commercial properties
- **VA Loan Services**: Specialized assistance for veterans and military families
- **Residential & Land**: Home listings and land development opportunities
- **Market Statistics**: Real-time Pittsburgh market data and trends

### 🤖 AI-Powered Chat Agent
- Intelligent property assistant representing Nicole
- Lead capture with conversational flow
- Compliance guardrails for real estate regulations
- Warm, professional personality for enhanced user engagement

### 📱 Modern User Experience
- Fully responsive design (mobile-first)
- Tabbed navigation system
- Professional eXp Realty branding
- Fast, smooth interactions

### 🎯 Lead Generation
- Conversational contact modal
- Lead scoring system
- Email integration for immediate follow-up
- Multiple contact touchpoints throughout the site

## 🛠️ Technical Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS with custom brand palette
- **AI Integration**: Custom chat agent with compliance features
- **Deployment**: Firebase Hosting + Google Cloud Run
- **Branding**: eXp Realty compliance

### Brand Colors
- **Primary**: #000000 (Black)
- **Accent**: #D4AF37 (Gold)
- **Charcoal**: #333333 (Text)
- **Cream**: #F7F1EB (Background)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FERRARI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file and add:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run locally**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
FERRARI/
├── components/           # React components
│   ├── AIChatAgent.tsx  # AI chat assistant
│   ├── Header.tsx       # Navigation header
│   ├── TabbedContent.tsx # Main content tabs
│   ├── FeaturedListings.tsx # Residential properties
│   ├── InvestorListings.tsx # Commercial properties
│   ├── ContactLeadModal.tsx # Lead capture modal
│   └── ...
├── constants.tsx        # Property data and icons
├── types.ts            # TypeScript interfaces
├── agentPrompts.ts     # AI assistant configuration
├── App.tsx             # Main application component
└── assets/             # Images and branding assets
```

## 🏢 Real Estate Focus Areas

### Commercial & Business
- Multi-family investment properties
- Commercial real estate opportunities
- Business property acquisitions
- Portfolio development strategies

### VA Loan Services
- Zero down payment assistance
- Military family support
- Veteran-specific property guidance
- Streamlined loan processing

### Residential & Land
- Single-family homes
- Land development opportunities
- First-time homebuyer assistance
- Market trend analysis

## 🤖 AI Assistant Features

The chat agent includes:
- **Compliance Guardrails**: Prevents unlicensed real estate activities
- **Lead Scoring**: Automatically rates potential clients
- **Context Awareness**: Understands property-specific inquiries
- **Professional Tone**: Maintains eXp Realty standards
- **Data Protection**: Local processing for privacy

## 📊 Market Insights

The site showcases Pittsburgh market data including:
- Median home prices ($254,724)
- Decade appreciation (105%)
- Population growth (27,200+ new residents)
- High equity properties (76.03%)

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Customization
- Update `agentPrompts.ts` to modify AI assistant behavior
- Modify `constants.tsx` to update property listings
- Adjust Tailwind config in `index.html` for brand colors

## 📞 Contact Information

- **Agent**: Nicole Marie Severson
- **Brokerage**: eXp Realty
- **Location**: Pittsburgh, Pennsylvania
- **Phone**: 412-365-0333

## 📋 Compliance & Legal

This website includes:
- Pennsylvania real estate license compliance
- Consumer notice requirements
- Privacy policy and terms of service
- AI disclosure statements
- Equal housing opportunity notices

## 🚀 Deployment

The application is deployed using:
- **Frontend**: Firebase Hosting
- **Backend**: Google Cloud Run
- **CDN**: Global content delivery for fast loading

---

*Built with ❤️ for Pittsburgh real estate professionals*
