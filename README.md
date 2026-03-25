# ZYMO Enterprise Portal

A modern web application for enterprise verification and onboarding process.

## Features

- Company verification process
- Financial department verification
- Bank account verification
- Responsive design
- Modern UI/UX

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/zymo-enterprise.git
cd zymo-enterprise
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized production build in the `build` directory.

## Deployment

### Option 1: Deploy to GitHub Pages

1. Update the `homepage` field in `package.json` with your GitHub Pages URL
2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```
3. Deploy:
```bash
npm run deploy
```

### Option 2: Deploy to Netlify

1. Push your code to a Git repository
2. Create a new site on Netlify and connect it to your repository
3. Set the build command to `npm run build`
4. Set the publish directory to `build`
5. Deploy

### Option 3: Deploy to Vercel

1. Push your code to a Git repository
2. Create a new project on Vercel and connect it to your repository
3. Vercel will automatically detect the React app and configure the build settings
4. Deploy

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App
- `npm run deploy` - Deploys to GitHub Pages

## Technologies Used

- React
- React Router
- React Icons
- CSS3

## License

This project is licensed under the MIT License. 