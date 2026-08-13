# Buyorama Backoffice API

NestJS-based backend API for Buyorama admin panel and services.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env` as needed

### Running the Application

#### Development Mode
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

#### Production Mode
```bash
npm run build
npm start
```

### API Endpoints

- `GET /api` - API information and available endpoints
- `GET /api/health` - Health check endpoint

### Project Structure

```
src/
├── main.ts           # Application entry point
├── app.module.ts     # Root module
├── app.controller.ts # Root controller
├── app.service.ts    # Root service
└── modules/          # Feature modules (to be added)
```

### Environment Variables

See `.env.example` for all available configuration options.

### Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Watch mode for TypeScript compilation
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:cov` - Run tests with coverage

## Features (Planned)

- User authentication & authorization
- Coupon management
- Store management
- Deal management
- Analytics & reporting
- Database integration

## License

ISC
