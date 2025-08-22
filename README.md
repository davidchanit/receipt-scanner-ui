# Receipt Scanner Frontend

A modern React application that allows users to upload receipt images and extract key information using AI-powered analysis. Built with TypeScript, React 19, and modern web technologies.

## 🚀 Features

- **Drag & Drop File Upload**: Intuitive file selection with drag and drop support
- **File Validation**: Supports JPG, JPEG, and PNG files up to 10MB
- **AI-Powered Extraction**: Connects to backend AI service for receipt analysis
- **Real-time Progress**: Animated loading states with step-by-step progress
- **Responsive Design**: Modern, mobile-friendly interface
- **Error Handling**: Comprehensive error messages with troubleshooting tips
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **React 19** - Latest React with hooks and functional components
- **TypeScript** - Type-safe development
- **CSS3** - Modern styling with custom components
- **ESLint + Prettier** - Code quality and formatting
- **Jest + Testing Library** - Unit and integration testing

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Backend API** running (see [Backend README](../receipt-scanner-backend/README.md))

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd receipt-scanner-ui
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001
```

**Note**: The default API URL is `http://localhost:3001` if no environment variable is set.

### 3. Start Development Server

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Reusable UI components
│   ├── LandingPage/    # File upload landing page
│   ├── FilePreview/    # File review and submission
│   ├── ExtractingLoader/ # Loading and progress states
│   ├── ExtractionResults/ # Results display
│   └── ErrorMessage/   # Error handling and display
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx            # Main application component
```

## 🎯 Available Scripts

- **`npm start`** - Start development server
- **`npm run build`** - Build for production
- **`npm test`** - Run test suite
- **`npm run lint`** - Fix linting issues
- **`npm run lint:check`** - Check for linting issues
- **`npm run format`** - Format code with Prettier
- **`npm run format:check`** - Check code formatting
- **`npm run code-quality`** - Run all quality checks

## 🔧 Configuration

### Environment Variables

| Variable            | Description          | Default                 |
| ------------------- | -------------------- | ----------------------- |
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:3001` |

### File Upload Limits

- **Supported Formats**: JPG, JPEG, PNG
- **Maximum Size**: 10MB
- **Validation**: Client-side and server-side validation

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:cov
```

## 🏗️ Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## 🌐 Deployment

The application can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `build/` folder
- **Vercel**: Connect your repository for automatic deployments
- **AWS S3**: Upload the `build/` folder to an S3 bucket
- **GitHub Pages**: Use the `gh-pages` package

## 🔗 API Integration

This frontend connects to the Receipt Scanner Backend API:

- **Base URL**: `http://localhost:3001` (development)
- **Main Endpoint**: `POST /receipt/extract-receipt-details`
- **Health Check**: `GET /receipt/health/check`

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Ensure the backend is running on port 3001
   - Check CORS configuration in backend
   - Verify environment variables

2. **File Upload Issues**
   - Check file format (JPG, JPEG, PNG only)
   - Ensure file size is under 10MB
   - Clear browser cache and try again

3. **Build Errors**
   - Clear `node_modules` and reinstall dependencies
   - Check Node.js version compatibility
   - Verify TypeScript configuration

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and quality checks
5. Submit a pull request

## 📄 License

This project is part of the Sleek Full Stack Engineer assessment.

## 🆘 Support

For technical support or questions:

- Check the troubleshooting section above
- Review the backend documentation
- Contact the development team

---

**Note**: This application requires the Receipt Scanner Backend to be running for full functionality. See the backend README for setup instructions.
