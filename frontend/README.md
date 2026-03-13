# BookHive Frontend

A modern, production-ready React application for the BookHive online bookstore.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

## Features

### User Features
- 📚 Browse and search books
- 🛒 Shopping cart management
- ❤️ Wishlist functionality
- 👤 User authentication (OTP-based registration)
- 📦 Order management
- 🔍 Advanced search and filtering
- 📱 Responsive design

### Admin Features
- 📊 Admin dashboard with statistics
- 📖 Book management (CRUD operations)
- 👥 User management
- 📦 Order management
- 📈 Sales analytics

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components (Header, Footer, BookCard)
│   │   └── ui/              # Shadcn UI components
│   ├── layouts/             # Layout components
│   ├── pages/               # Page components
│   │   ├── auth/            # Authentication pages
│   │   └── admin/           # Admin pages
│   ├── routes/              # Route configuration
│   ├── services/            # API services
│   ├── store/               # Redux store
│   │   └── slices/          # Redux slices
│   ├── utils/               # Utility functions
│   ├── lib/                 # Library utilities
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── public/                  # Static assets
└── index.html              # HTML template
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`:
```
VITE_API_URL=http://localhost:5000
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` (development) |

Production deployment note:
Set `VITE_API_URL` in your Vercel project (Production + Preview) to your Render backend HTTPS URL.

## Redux Store Structure

- **auth** - User authentication state
- **books** - Books catalog and details
- **cart** - Shopping cart items
- **wishlist** - User wishlist
- **orders** - Order history and details
- **admin** - Admin dashboard data

## API Integration

The app uses Axios for API calls with:
- Automatic token injection
- Request/response interceptors
- Error handling
- Base URL configuration

## Routing

Protected routes require authentication:
- `/cart` - Shopping cart
- `/wishlist` - User wishlist
- `/orders` - Order history
- `/profile` - User profile

Admin-only routes:
- `/admin` - Admin dashboard
- `/admin/books` - Book management
- `/admin/orders` - Order management
- `/admin/users` - User management

## Styling

The app uses Tailwind CSS with:
- Custom color palette (amber/orange theme)
- Responsive design utilities
- Custom components from Shadcn/ui
- Consistent spacing and typography

## Components

### UI Components (Shadcn/ui)
- Button
- Input
- Label
- Card
- Badge
- Textarea
- Dialog
- Select
- Tabs
- Separator

### Common Components
- **Header** - Navigation with cart/wishlist counters
- **Footer** - Site footer with links
- **BookCard** - Book display card with actions

## Best Practices

- Component-based architecture
- Centralized state management
- Protected routes
- Error handling with toast notifications
- Responsive design
- Optimized images
- Code splitting
- Environment-based configuration

## Contributing

1. Follow the existing code structure
2. Use functional components with hooks
3. Implement proper error handling
4. Add loading states for async operations
5. Ensure responsive design
6. Test on multiple devices

## License

MIT
