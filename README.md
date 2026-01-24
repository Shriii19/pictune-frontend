# Pictune Frontend

A modern React-based web application for photo analysis and language detection, built with Vite and styled with Tailwind CSS.

## Features

- 📸 Photo upload and preview
- 🔍 Image analysis with language detection
- 🌐 Multi-language filtering support
- ⚡ Fast development with Vite
- 🎨 Beautiful UI with Tailwind CSS v4
- ✨ Modern React 19 with hooks

## Tech Stack

- **React 19** - Latest React features and improvements
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS v4** - Utility-first CSS framework
- **ESLint** - Code linting and quality assurance

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v16 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Shriii19/pictune-frontend.git
cd pictune-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create `.env.development` for local development:
```env
VITE_API_URL=http://localhost:5000
```

For production deployment, configure the environment variable in your hosting platform (Vercel, Netlify, etc.):
```env
VITE_API_URL=https://your-backend-url.com
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

## Building for Production

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure the environment variable:
   - Add `VITE_API_URL` with your backend URL
4. Deploy!

The `vercel.json` file is already configured for optimal deployment.

### Other Platforms

The app can be deployed to any static hosting platform:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

Make sure to:
1. Set the build command to `npm run build`
2. Set the output directory to `dist`
3. Configure the `VITE_API_URL` environment variable

## Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## Project Structure

```
pictune-frontend/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images, fonts, etc.
│   ├── App.jsx      # Main application component
│   ├── App.css      # Application styles
│   ├── main.jsx     # Application entry point
│   └── index.css    # Global styles
├── index.html       # HTML template
├── vite.config.js   # Vite configuration
├── eslint.config.js # ESLint configuration
└── package.json     # Project dependencies
```

## Features Overview

### Photo Upload
- Drag and drop or click to upload images
- Real-time preview of selected photos
- Support for common image formats

### Language Detection
- Automatic language detection from images
- Filter results by specific languages
- Support for multiple language options

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.
