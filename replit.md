# Overview

ROOTED is a web application designed to empower small-scale farmers by connecting them directly with buyers, helping them manage crop schedules, and supporting communities through a donation platform. The application features separate dashboards for farmers and buyers, along with a community donation system to reduce food waste and support local communities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system
- **State Management**: TanStack Query for server state management and caching
- **Build Tool**: Vite for fast development and optimized builds

## Backend Architecture
- **Framework**: Express.js with TypeScript for REST API development
- **Storage Layer**: In-memory storage with interface-based design for easy database migration
- **Middleware**: Custom logging middleware for API request tracking
- **Development**: Hot module replacement with Vite integration in development mode

## Data Storage Solutions
- **Database**: PostgreSQL configured with Drizzle ORM for type-safe database operations
- **Schema**: Well-defined tables for users (farmers/buyers), crops, and donations
- **Migrations**: Drizzle Kit for database schema management and migrations
- **Connection**: Neon Database serverless PostgreSQL for cloud deployment

## Authentication and Authorization
- **Provider**: Firebase Authentication for user management
- **Strategy**: Email/password authentication with user type differentiation (farmer/buyer)
- **Session Management**: Planned implementation with connect-pg-simple for PostgreSQL session storage
- **User Types**: Role-based access with separate dashboards for farmers and buyers

## External Dependencies
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Google Fonts integration (Inter, DM Sans, Fira Code, Geist Mono)
- **Weather Integration**: OpenWeather API planned for farmer dashboard weather widgets
- **Deployment**: Replit environment with development tooling

## Application Structure
The application follows a clean monorepo structure with shared schemas between client and server. The frontend implements a modern React architecture with proper separation of concerns through dedicated page components, reusable UI components, and centralized state management. The backend uses a service-oriented approach with clear separation between routes, storage, and business logic.

## Key Features
- **Farmer Dashboard**: Crop management, scheduling, and donation flagging
- **Buyer Marketplace**: Browse available crops and contact sellers
- **Community Donations**: Platform for distributing surplus crops to communities
- **Responsive Design**: Mobile-first approach with adaptive layouts