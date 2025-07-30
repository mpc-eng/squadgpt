# 🤖 SquadGPT - AI-Powered Product Development Assistant

SquadGPT is a comprehensive AI-powered platform that guides you through the complete product development process using a team of specialized AI agents. From initial idea exploration to post-launch analysis, our AI squad helps you create professional Product Requirements Documents (PRDs) and development plans.

## ✨ Features

### 🎯 **6-Stage Product Development Workflow**
- **Aperture**: Initial idea exploration and hypothesis validation
- **Discovery**: Deep research and market analysis
- **Define**: Problem definition and success metrics
- **Design**: Solution architecture and UX design
- **Deliver**: Implementation planning and roadmap
- **Live**: Post-launch analysis and iteration planning

### 🤖 **AI Squad Team**
- **👔 Business Analyst**: Market analysis and business viability
- **📋 Product Manager**: Product strategy and feature prioritization
- **🏗️ Solution Architect**: Technical architecture and implementation
- **⚡ Scrum Master**: Development roadmap and execution strategy

### 🛠️ **Key Features**
- **Interactive PRD Editor**: Tabbed interface for organizing requirements
- **AI Chat Interface**: Context-aware conversations with the AI squad
- **Agent Debate Panel**: Multi-perspective analysis of your project
- **Stage Guidance**: Contextual help and recommendations
- **Version Control**: Track changes to PRD sections
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/squadgpt.git
   cd squadgpt
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd squadgpt-backend
   npm install
   
   # Install frontend dependencies
   cd ../squadgpt-frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In squadgpt-backend directory
   cp .env.example .env
   ```
   
   Edit `squadgpt-backend/.env`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   ```

4. **Start the development servers**
   ```bash
   # Start backend (from squadgpt-backend directory)
   npm run dev
   
   # Start frontend (from squadgpt-frontend directory)
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 📖 Usage Guide

### 1. **Create a New PRD**
- Navigate to `/start-prd`
- Fill out the initial form with your hypothesis and supporting evidence
- Our AI squad will analyze your input and provide initial insights

### 2. **Work Through Stages**
- Use the left sidebar to navigate between development stages
- Each stage has specific goals and AI assistance
- The workspace guidance provides contextual help

### 3. **Use the PRD Editor**
- Organize your requirements using the tabbed interface
- Use AI summarization to refine your content
- Track changes with version control

### 4. **Chat with AI**
- Ask questions specific to your current stage
- Get recommendations and insights from the AI squad
- Use conversation starters for guidance

### 5. **Review Agent Analysis**
- See how different AI agents analyze your project
- Get multi-perspective insights
- Use the debate panel for comprehensive analysis

## 🏗️ Architecture

### Frontend (Next.js 14 + TypeScript)
- **React 18** with modern hooks and context
- **Next.js 14** with App Router
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **TypeScript** for type safety

### Backend (Node.js + Fastify)
- **Fastify** web framework
- **LangChain** for AI agent orchestration
- **OpenAI GPT-3.5-turbo** for AI processing
- **Security** with helmet and rate limiting
- **Testing** with Jest and Supertest

### AI Agents
- **Business Analyst**: Market and business analysis
- **Product Manager**: Product strategy and requirements
- **Solution Architect**: Technical architecture
- **Scrum Master**: Development planning
- **Chat Agent**: Context-aware conversations
- **Summarizer**: Content refinement

## 🔧 Development

### Project Structure
```
SquadGPT/
├── squadgpt-backend/          # Backend API server
│   ├── src/
│   │   └── index.js          # Main server file
│   ├── __tests__/            # Backend tests
│   └── package.json
├── squadgpt-frontend/         # Frontend React app
│   ├── src/
│   │   ├── app/              # Next.js app router
│   │   ├── components/       # React components
│   │   └── contexts/         # React contexts
│   └── package.json
├── README.md
└── .gitignore
```

### Available Scripts

**Backend:**
```bash
npm run dev          # Start development server
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run linter
```

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
```

## 🧪 Testing

### Backend Tests
```bash
cd squadgpt-backend
npm test
```

### Frontend Tests
```bash
cd squadgpt-frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Install dependencies: `npm install --production`
3. Start with PM2: `pm2 start src/index.js`

### Frontend Deployment
1. Build the app: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-3.5-turbo API
- **LangChain** for AI agent orchestration
- **Next.js** for the React framework
- **TailwindCSS** for the styling system
- **Fastify** for the backend framework

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

---

**Built with ❤️ by the SquadGPT team** 