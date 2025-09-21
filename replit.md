# Replit Configuration

## Overview

Cheap Studio is an AI-powered generative playground that allows users to create images and videos using various AI models. The application provides cost estimation, usage tracking, and a modern web interface for content generation. Built as a Next.js application with TypeScript, it features a dashboard for monitoring usage quotas, dedicated pages for image and video generation, and real-time cost calculations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15.5.3 with App Router for modern React development
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming and dark mode support
- **State Management**: React hooks with local component state, localStorage for persistence
- **TypeScript**: Full TypeScript implementation for type safety

### Design System
- **Component Structure**: Modular UI components following shadcn/ui patterns
- **Theme**: Dark-first design with blue accent colors and slate color palette
- **Typography**: Geist font family for modern, clean appearance
- **Layout**: Responsive grid-based layouts with mobile-first approach

### Application Structure
- **Dashboard**: Usage tracking with progress bars for image/video quotas
- **Image Generator**: Multi-image upload support with prompt-based generation
- **Video Generator**: Duration-based video creation with cost estimation
- **Usage Analytics**: Monthly usage overview and billing estimates
- **Cost Estimation**: Real-time pricing calculations based on dimensions and duration

### Data Architecture
- **Pricing Logic**: Megapixel-based image pricing and per-second video pricing
- **State Persistence**: Browser localStorage for user preferences and API keys
- **File Handling**: Client-side image preview and file management
- **Mock Data**: Placeholder data structure for demonstration purposes

### Performance Optimizations
- **Service Worker**: Comprehensive caching strategies for offline functionality
- **PWA Support**: Progressive Web App manifest for mobile installation
- **Image Optimization**: Next.js Image component with unoptimized flag for flexibility
- **Process Management**: PM2 configuration for production deployment

## External Dependencies

### UI and Styling
- **@radix-ui/react-*** packages for accessible UI primitives (Avatar, Dialog, Dropdown, Icons, Label, Progress, Separator, Slider, Slot)
- **class-variance-authority** for component variant management
- **clsx** and **tailwind-merge** for conditional CSS class handling
- **tailwindcss** v4 for utility-first styling

### Development Tools
- **TypeScript** for static type checking
- **ESLint** with Next.js configuration for code quality
- **PostCSS** with Tailwind integration

### Production Infrastructure
- **PM2** for process management and monitoring
- **Vercel** deployment platform (configured in README)
- **Next.js** built-in optimizations for fonts and images

### Planned Integrations
- AI model APIs (Gemini, FLUX.1) for actual generation capabilities
- Payment processing for billing and subscription management
- Database integration for user data and generation history
- Authentication system for user management

### Browser APIs
- **localStorage** for client-side data persistence
- **File API** for image upload and preview functionality
- **Service Worker API** for offline capabilities and caching