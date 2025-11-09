# Company Admin Dashboard

## Overview

This is a full-stack company admin dashboard built with React, Express, and PostgreSQL. The application provides a comprehensive content management system for managing products, categories, company information, users, roles, and customer support emails. It features role-based access control with granular permissions, allowing different administrative users to access specific features based on their assigned roles.

The dashboard uses IBM's Carbon Design System principles to provide a data-intensive enterprise interface with clear visual hierarchy and consistent patterns across all modules.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component Library**: shadcn/ui components built on Radix UI primitives
- Provides accessible, unstyled components that are customized with Tailwind CSS
- Components include dialogs, dropdowns, forms, tables, and data visualization elements

**Styling System**: Tailwind CSS with custom design tokens
- Based on IBM Plex Sans typography
- Custom color system with HSL values for theme consistency
- Supports light and dark modes via CSS variables
- Spacing limited to specific Tailwind units (1, 2, 3, 4, 6, 8, 12, 16) for consistency

**State Management**: TanStack Query (React Query)
- Handles all server state with automatic caching and refetching
- Custom query client with credential-based fetching
- Optimistic updates for mutations

**Routing**: Wouter (lightweight routing library)
- Client-side routing for single-page application navigation
- Route protection based on authentication status

**Design System**: Carbon Design System principles
- Information density for enterprise applications
- Clear visual hierarchy and consistent patterns
- 3-column grid layout for dashboard cards
- Fixed 240px sidebar navigation

### Backend Architecture

**Framework**: Express.js with TypeScript
- RESTful API structure
- Middleware for JSON parsing and request logging
- Session-based authentication

**Database ORM**: Drizzle ORM
- Type-safe database queries
- Schema defined in TypeScript with migrations support
- Validation through drizzle-zod integration

**Authentication**: Replit Auth (OpenID Connect)
- Passport.js strategy for OIDC
- Session management with connect-pg-simple
- Support for multiple auth providers (Google, GitHub, Email)
- User verification status tracking (pending/verified)

**API Design Pattern**: Resource-based routing
- `/admin/auth/user` - Current user session
- `/admin/users` - User management
- `/admin/roles` - Role and permission management
- `/admin/products` - Product CRUD operations
- `/admin/categories` - Category management
- `/admin/company-infos` - Company information
- `/admin/emails` - Support email management
- `/admin/analytics` - Analytics data

### Data Storage

**Database**: PostgreSQL (via Neon serverless)
- WebSocket connection for serverless compatibility
- Connection pooling for performance

**Schema Structure**:
- `sessions` - Session storage for authentication
- `roles` - System and custom roles with permission arrays
- `users` - Admin users with role assignments and company associations
- `products` - Product catalog with category and company relationships
- `categories` - Hierarchical category structure
- `companyInfos` - Company information records
- `supportEmails` - Customer support email inbox
- `productClicks` - Analytics tracking for product interactions
- `userInvitations` - Pending user invitations

**Role-Based Access Control**:
- Hierarchical role system (Super Admin > Admin > Manager > Editor > Viewer)
- Permission-based page access control
- Assignable roles based on current user's role level
- System roles cannot be deleted or modified

### External Dependencies

**Authentication Service**: Replit Auth (OIDC)
- Provides federated authentication
- Returns JWT tokens with user claims
- Requires `ISSUER_URL`, `REPL_ID`, and `SESSION_SECRET` environment variables

**Database Service**: Neon Serverless PostgreSQL
- Requires `DATABASE_URL` environment variable
- Uses WebSocket connection for serverless compatibility

**Third-Party UI Libraries**:
- Radix UI - Accessible component primitives
- Lucide React - Icon library
- TanStack Query - Server state management
- date-fns - Date formatting utilities
- Zod - Runtime schema validation

**Development Tools**:
- Vite - Fast development server and build tool
- Replit-specific plugins for development environment integration
- ESBuild - Production bundling for server code

**Font Loading**: Google Fonts
- IBM Plex Sans (primary typography)
- IBM Plex Mono (code/data display)