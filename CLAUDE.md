# Poem Studio Development Guide

## Build & Development Commands
- **Start dev server**: `npm run dev`
- **Build for production**: `npm run build`
- **Start production server**: `npm run start`
- **Lint code**: `npm run lint`
- **Typecheck**: `npx tsc --noEmit`

## Code Style Guidelines
- **Component Organization**: Use the "use client" directive for client components
- **Imports**: Group imports by 1) React/Next, 2) External libraries, 3) Internal components/utils
- **Components**: Use functional components with explicit TypeScript interfaces
- **Naming**: PascalCase for components, camelCase for functions/variables, kebab-case for CSS classes
- **Types**: Define explicit interfaces for props, prefer explicit types over `any`
- **Formatting**: Follow Next.js conventions with 2-space indentation
- **State Management**: Use React hooks for local state (useState, useEffect)
- **CSS**: Use Tailwind CSS for styling with the `cn()` utility for conditional classes
- **Error Handling**: Use try/catch for async operations and provide user feedback

## Project Structure
- `app/`: Next.js app router components and pages
- `components/`: Reusable UI components organized by domain
- `lib/`: Utility functions and shared logic
- `public/`: Static assets and images