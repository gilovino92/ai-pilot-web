# 🚀 X-Pilot AI - Frontend Application

A modern React SPA (Single Page Application) that provides an intelligent chat interface for trading professionals. Built with cutting-edge technologies and optimized for performance and user experience.

## 🌟 Features

### 🤖 AI Chat Interface
- **Real-time Conversations**: Live chat with AI assistant specialized for trading
- **Stream Processing**: Real-time message streaming via Server-Sent Events (SSE)
- **Interactive Elements**: Support for user input prompts, selection options, and file uploads
- **Message History**: Persistent chat history with pagination
- **Multi-Agent Actions**: Visual indicators for different AI agent actions (searching, thinking, answering)

### 💼 Business Features
- **Company Research**: AI-powered company verification and background checks
- **Lead Management**: Customer relationship tracking and management
- **Document Processing**: Integration with document analysis and processing
- **Market Intelligence**: Real-time market data and insights
- **Sales Automation**: Automated follow-ups and task management

### 🔐 Authentication & Security
- **OIDC Integration**: Secure authentication with Pilot SSO
- **JWT Token Management**: Automatic token refresh and session management
- **Role-based Access**: User permissions and role management
- **API Security**: Secure communication with backend services

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Dark/Light Mode**: Theme switching with system preference detection
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: Graceful error recovery and user feedback
- **Offline Support**: Progressive Web App capabilities

## 🛠️ Tech Stack

### Core Framework
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server

### Routing & State Management
- **TanStack Router** - Type-safe file-based routing with data loading
- **TanStack Query** - Powerful data synchronization and caching
- **TanStack Store** - Lightweight global state management
- **TanStack Form** - Type-safe form handling with validation

### UI & Styling
- **shadcn/ui** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Recharts** - Composable charting library

### Real-time & Communication
- **Server-Sent Events (SSE)** - Real-time message streaming
- **Event Source Polyfill** - Cross-browser SSE support
- **WebSocket Support** - Future-ready real-time communication

### Development & Quality
- **ESLint** - Code linting with React and TypeScript rules
- **Prettier** - Code formatting with Tailwind plugin
- **TypeScript ESLint** - Advanced TypeScript linting
- **Perfectionist** - Import and object sorting

## 📁 Project Structure

```
src/
├── app/                    # Application modules
│   ├── chat-copilot/      # AI chat interface components
│   │   ├── CopilotConversation.tsx
│   │   ├── CopilotQuickActions.tsx
│   │   └── CopilotRecentChats.tsx
│   ├── conversation/      # Conversation management
│   ├── customer/          # Customer relationship management
│   ├── document/          # Document processing
│   ├── member/            # User management
│   ├── prospect/          # Lead management
│   └── task/              # Task automation
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   ├── layouts/          # Layout components
│   └── common/           # Common utility components
├── data/                 # API client and data management
│   ├── chatbot.ts        # Chat API integration
│   ├── dify.ts           # External AI service integration
│   └── auth.ts           # Authentication utilities
├── hooks/                # Custom React hooks
├── stores/               # Global state management
├── routes/               # File-based routing
│   ├── auth/             # Authentication routes
│   ├── chat/             # Chat interface routes
│   ├── dashboard/        # Dashboard routes
│   └── welcome/          # Landing page
├── libs/                 # Utility libraries
├── config/               # Application configuration
└── i18n/                 # Internationalization
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** (LTS recommended)
- **pnpm** (Package manager)
- **Backend API** running on `http://localhost:8000`

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd ai-pilot-web
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Setup environment variables**:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1

# Authentication (OIDC)
VITE_OIDC_AUTHORITY=https://your-oidc-provider.com
VITE_OIDC_CLIENT_ID=your-client-id
VITE_OIDC_REDIRECT_URI=http://localhost:3000/auth/callback

# External Services
VITE_DIFY_API_URL=your-dify-api
VITE_DIFY_API_KEY=your-dify-api-key

# Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

4. **Start development server**:
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the application
pnpm build

# Preview the production build
pnpm preview
```

## 🔧 Development

### Code Quality

```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Type checking
npx tsc --noEmit
```

### Update Dependencies

```bash
# Update to latest minor versions
pnpx taze minor -w && pnpm install

# Update UI components
pnpm update-ui
```

### Internationalization

```bash
# Compile i18n messages
pnpm compile-i18n
```

## 🏗️ Architecture

### File-based Routing
The application uses TanStack Router with file-based routing:

```
routes/
├── __root.tsx           # Root layout
├── index.lazy.tsx       # Home page
├── auth/
│   ├── login/
│   │   └── route.lazy.tsx
│   └── register/
│       └── route.lazy.tsx
└── chat/
    └── route.lazy.tsx
```

### Data Loading Strategy
- **Route-level Loading**: Data fetching at route level using TanStack Query
- **Component-level Loading**: Granular loading states for individual components
- **Background Refetching**: Automatic data synchronization
- **Optimistic Updates**: Immediate UI updates with rollback on errors

### State Management
- **Server State**: TanStack Query for API data
- **Client State**: TanStack Store for UI state
- **Form State**: TanStack Form for form handling
- **Authentication State**: React OIDC Context

## 📊 Performance Optimizations

### Bundle Optimization
- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Automatic unused code elimination
- **Dynamic Imports**: Component-level code splitting
- **Bundle Analysis**: Built-in bundle analyzer

### Runtime Performance
- **Virtual Scrolling**: Large list virtualization with TanStack Virtual
- **Memoization**: Strategic use of React.memo and useMemo
- **Intersection Observer**: Lazy loading and infinite scrolling
- **Service Worker**: Caching strategies for offline support

### Development Experience
- **Hot Module Replacement**: Instant updates during development
- **TypeScript Integration**: Full type safety across the application
- **Dev Tools**: React Query and Router devtools integration

## 🔐 Security Features

### Authentication Flow
1. **OIDC Discovery**: Automatic provider configuration
2. **Silent Renewal**: Background token refresh
3. **Secure Storage**: Token storage in HTTP-only cookies
4. **CSRF Protection**: State parameter validation

### API Security
- **Bearer Token Authentication**: JWT tokens in Authorization headers
- **Request Validation**: Input sanitization and validation
- **CORS Configuration**: Proper cross-origin request handling
- **Error Handling**: Secure error messages without sensitive information

## 🧪 Testing Strategy

### Unit Testing
```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### E2E Testing
```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests in UI mode
pnpm test:e2e:ui
```

## 📱 Progressive Web App

### PWA Features
- **Service Worker**: Caching and offline functionality
- **App Manifest**: Install prompts and native app experience
- **Push Notifications**: Real-time notifications support
- **Background Sync**: Offline action queuing

### Installation
The app can be installed on mobile devices and desktops through browser prompts or manually via browser settings.

## 🌐 Browser Support

### Supported Browsers
- **Chrome/Edge**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Mobile Safari**: 14+
- **Samsung Internet**: 15+

### Polyfills
- **Event Source**: SSE support for older browsers
- **IntersectionObserver**: Scroll-based loading
- **ResizeObserver**: Responsive component handling

## 📈 Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **User Analytics**: Google Analytics 4 integration
- **Error Tracking**: Client-side error reporting
- **Performance Budgets**: Bundle size monitoring

### Usage Analytics
- **User Journey Tracking**: Navigation flow analysis
- **Feature Usage**: Component interaction tracking
- **Conversion Metrics**: Goal completion tracking

## 🚀 Deployment

### Build Configuration
```bash
# Development build
pnpm build --mode development

# Staging build
pnpm build --mode staging

# Production build
pnpm build --mode production
```

### Environment-specific Builds
- **Development**: Debug tools, verbose logging
- **Staging**: Production-like with debug capabilities
- **Production**: Optimized, minified, no debug tools

### Deployment Targets
- **Static Hosting**: Vercel, Netlify, AWS S3
- **CDN**: CloudFront, CloudFlare
- **Container**: Docker with Nginx
- **Traditional Hosting**: Apache, Nginx

## 🤝 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes**: Follow coding standards and patterns
4. **Run tests**: Ensure all tests pass
5. **Lint code**: Fix any linting issues
6. **Commit changes**: Use conventional commit messages
7. **Push branch**: `git push origin feature/amazing-feature`
8. **Create Pull Request**: Provide detailed description

### Coding Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow configured rules
- **Prettier**: Auto-formatting on save
- **Conventional Commits**: Structured commit messages
- **Component Patterns**: Consistent component structure

### Pull Request Guidelines
- **Clear Description**: Explain what and why
- **Screenshots**: For UI changes
- **Breaking Changes**: Document any breaking changes
- **Tests**: Include tests for new features
- **Documentation**: Update relevant documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and inline comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Wiki**: Additional documentation and guides

### Common Issues
- **Build Failures**: Check Node.js version and dependencies
- **Authentication Issues**: Verify OIDC configuration
- **API Errors**: Ensure backend service is running
- **Performance Issues**: Check network conditions and browser console

---

**X-Pilot AI Frontend** - Empowering  traders with intelligent user experiences 🌾✨
