# Photo Editor

A professional-grade photo editing application built with React, TypeScript, and Tailwind CSS. This modern web-based image editor provides intuitive tools for image manipulation and enhancement.

![Photo Editor](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.16-38bdf8.svg)

## ✨ Features

### 🎨 Core Editing Tools
- **Select Tool**: Select and manipulate image regions
- **Crop Tool**: Crop images with various aspect ratios (Free, 1:1, 4:3, 16:9, 3:2)
- **Brightness Adjustment**: Fine-tune image brightness (-100 to +100)
- **Contrast Adjustment**: Enhance or reduce image contrast (-100 to +100)
- **Saturation Control**: Adjust color saturation (0% to 200%)
- **Filters**: Apply preset filters (Grayscale, Sepia, Vintage, Cool, Warm, HDR)
- **Rotate**: Rotate images (90° CW, 90° CCW, 180°, Custom)
- **Flip**: Flip images horizontally or vertically

### 🖼️ Image Management
- Upload images directly from your device
- Download edited images
- Support for various image formats

### 📜 History & Undo/Redo
- Complete action history tracking
- Unlimited undo/redo functionality
- Visual history panel showing all edits

### 📱 Responsive Design
- **Desktop**: Full layout with all panels visible
- **Tablet**: Optimized layout with collapsible panels
- **Mobile**: Streamlined interface with bottom tool selection

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd photo_editor
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🏗️ Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ImageCanvas.tsx      # Main canvas for image display
│   │   ├── ToolPanel.tsx        # Tool selection sidebar
│   │   ├── PropertyPanel.tsx    # Properties/settings panel
│   │   └── HistoryPanel.tsx     # History/undo-redo panel
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles with Tailwind imports
├── index.html           # HTML template
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md           # This file
```

## 🛠️ Technology Stack

- **Framework**: React 19.1.1
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.16
- **Build Tool**: Vite 7.1.7
- **Canvas API**: HTML5 Canvas for image manipulation

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Usage Guide

### Basic Workflow

1. **Upload an Image**
   - Click the "Upload Image" button in the center of the canvas
   - Select an image from your device

2. **Select a Tool**
   - Choose from the tool panel on the left (desktop)
   - Or use the bottom toolbar (mobile)

3. **Adjust Properties**
   - Use the property panel on the right to adjust settings
   - Each tool has specific properties and controls

4. **Track Your Changes**
   - View all actions in the history panel at the bottom
   - Use Undo/Redo buttons to navigate through changes

5. **Download Your Work**
   - Click the "Download" button to save your edited image
   - Image is saved in PNG format

## 🎨 Component Details

### ImageCanvas
- Displays the uploaded image
- Applies real-time filters and adjustments
- Handles image upload and download
- Uses HTML5 Canvas API for rendering

### ToolPanel
- Provides tool selection interface
- Displays tool icons and descriptions
- Includes quick actions (Reset All, Auto Enhance)

### PropertyPanel
- Dynamic property controls based on selected tool
- Sliders for brightness, contrast, and saturation
- Buttons for filters, rotation, and crop ratios

### HistoryPanel
- Displays chronological list of actions
- Undo/Redo functionality with keyboard shortcuts
- Visual indication of current state

## 🔧 Customization

### Adding New Tools
1. Add tool definition in `ToolPanel.tsx`
2. Implement tool logic in `ImageCanvas.tsx`
3. Add property controls in `PropertyPanel.tsx`

### Adding New Filters
1. Update the filters array in `PropertyPanel.tsx`
2. Implement filter algorithm in `ImageCanvas.tsx`

## 🚧 Future Enhancements

- [ ] Layer support
- [ ] Advanced filters and effects
- [ ] Drawing and annotation tools
- [ ] Keyboard shortcuts
- [ ] Save/load project files
- [ ] Batch processing
- [ ] Cloud storage integration
- [ ] Export in multiple formats (JPEG, WebP, etc.)
- [ ] Advanced crop with manual selection
- [ ] Text overlay tool
- [ ] Blur and sharpen tools

## 📝 Development Best Practices

- Make frequent, small commits
- Write descriptive commit messages
- Test on multiple browsers and devices
- Keep components modular and reusable
- Document complex functionality

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

Your Name - Initial work

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite for the blazing-fast build tool

---

Made with ❤️ using React + TypeScript + Tailwind CSS
