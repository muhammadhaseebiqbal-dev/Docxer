# Docxer - AI-Powered Code Documentation Generator

A professional, scalable code documentation generator built with FastAPI (backend) and React + Tailwind + ShadCN (frontend). Generate comprehensive Word documents from your code using Google Gemini AI.

## ✨ Features

### Single File Documentation

- Upload any code file (Python, JavaScript, TypeScript, etc.)
- AI-powered analysis and documentation generation
- Professional Word document output
- Real-time processing status

### React Project Documentation

- Upload package.json + main component for comprehensive analysis
- Technology stack overview
- Dependency analysis
- Architecture insights
- Component structure documentation

### Professional Output

- Well-formatted Word documents
- Color-coded headings and sections
- Code syntax highlighting
- Professional styling and layout

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ with pip
- Node.js 16+ with npm
- Google Gemini API key

### Backend Setup

1. **Clone and navigate to the project:**

   ```bash
   git clone <your-repo-url>
   cd Docxer
   ```

2. **Set up Python virtual environment:**

   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Python dependencies:**

   ```bash
   cd api
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Create `.env` file in the `api` directory:

   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

5. **Start the FastAPI server:**

   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to client directory:**

   ```bash
   cd ../client
   ```

2. **Install Node.js dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🎯 Usage Examples

### Single File Documentation

1. Click "Single File Documentation"
2. Upload any code file (`.py`, `.js`, `.tsx`, etc.)
3. Click "Generate Documentation"
4. Monitor progress and download when complete

### React Project Documentation

1. Click "React Project Documentation"
2. Upload your `package.json` file first
3. Upload your main React component (e.g., `App.jsx`)
4. Click "Generate Project Documentation"
5. Download the comprehensive project documentation

## 🔒 Security Features

- Input validation and file size limits
- Secure API key management via environment variables
- CORS protection with specific origins
- File type validation
- Memory-safe processing

## 🧪 Testing

### Test Files Included

- `test_fibonacci.py` - Python example for single file testing
- `test-package.json` - Sample package.json for project testing
- `test-App.js` - Sample React component for project testing

### Manual Testing Steps

1. Start both backend and frontend servers
2. Test single file upload with `test_fibonacci.py`
3. Test project upload with `test-package.json` and `test-App.js`
4. Verify document generation and download functionality

---

*Built with ❤️ using FastAPI, React, and Google Gemini AI*
