# PicsNext - Modern Photo Editor

A powerful, web-based photo editing application built with React, TypeScript, and Vite. PicsNext offers a comprehensive suite of image editing tools with a sleek, dark-themed UI inspired by modern design tools.

![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff?logo=vite)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.10.1-764abc?logo=redux)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.16-38bdf8?logo=tailwindcss)

## ✨ Features.

### 🎨 Image Adjustments
- **Brightness Control**: -100 to +100 range
- **Contrast Control**: -100 to +100 range
- **Saturation Control**: 0% to 200% range
- **Blur Effect**: 0% to 100% with canvas-based rendering

### 🖼️ Preset Filters
- **Grayscale**: Classic black & white conversion
- **Sepia**: Warm vintage tone
- **Vintage**: Aged photo effect with reduced contrast
- **Cool**: Blue-toned temperature adjustment
- **Warm**: Red/yellow-toned temperature boost
- **HDR**: Enhanced saturation with S-curve contrast

### ✂️ Crop Tool
- Interactive crop area with drag & resize
- Aspect ratio constraints (Free, 1:1, 4:3, 16:9, 3:2)
- Visual crop overlay with rule of thirds grid
- Resize handles for precise adjustments

### 🔄 Rotation
- 90° Clockwise
- 90° Counter-clockwise
- 180° flip
- Reset to original orientation

### ⚡ Advanced Features
- **Undo/Redo**: Full history tracking with Redux
- **Zoom & Pan**: 10% to 800% zoom with smooth panning
- **Performance Monitoring**: Real-time FPS, memory, and render time tracking
- **Reset to Original**: One-click restoration to default state
- **Image Download**: Export edited images as PNG

## 🏗️ Tech Stack

### Core
- **React 19.1.1** - UI framework
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.1.7** - Lightning-fast build tool

### State Management
- **Redux Toolkit 2.10.1** - Centralized state with undo/redo
- **React Redux 9.2.0** - React bindings for Redux

### Styling
- **TailwindCSS 4.1.16** - Utility-first CSS framework
- **Custom Dark Theme** - Modern, professional color scheme

### Image Processing
- **Canvas API** - Core image manipulation
- **Fabric.js 6.9.0** - Advanced canvas operations (ready for future enhancements)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ImageCanvas.tsx       # Main canvas with zoom/pan
│   │   ├── ToolPanel.tsx         # Left sidebar tool selector
│   │   ├── PropertyPanel.tsx     # Right sidebar with controls
│   │   ├── HistoryPanel.tsx      # Undo/redo history
│   │   └── PerformanceMonitor.tsx # Dev performance metrics
│   ├── hooks/
│   │   ├── useImageLoader.ts          # Image loading & management
│   │   ├── useImageFilters.ts         # Brightness/contrast/saturation
│   │   ├── useImageBlur.ts            # Blur effect rendering
│   │   ├── useImagePresetFilters.ts   # Grayscale/Sepia/Vintage/etc
│   │   ├── useImageCrop.ts            # Crop functionality
│   │   └── usePerformanceMetrics.ts   # Performance tracking
│   ├── store/
│   │   ├── store.ts              # Redux store configuration
│   │   ├── imageEditorSlice.ts   # Image state & actions
│   │   └── hooks.ts              # Typed Redux hooks
│   ├── App.tsx                   # Main app layout
│   └── main.tsx                  # Entry point
├── public/                       # Static assets
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SAIASHISH-sys/PicsNext.git
   cd PicsNext/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 🎮 Usage

1. **Upload an Image**: Click "Upload Image" or drag & drop
2. **Select a Tool**: Click tools in the left sidebar
3. **Adjust Properties**: Use sliders and controls in the right panel
4. **Apply Effects**: Changes are applied in real-time
5. **Undo/Redo**: Use history buttons in the top toolbar
6. **Download**: Export your edited image

### Keyboard Shortcuts
- `Ctrl+Z` / `Cmd+Z` - Undo
- `Ctrl+Y` / `Cmd+Y` - Redo
- `Ctrl+Wheel` - Zoom in/out
- `Drag` - Pan the canvas

## 🧩 Custom Hooks

### Image Processing Hooks
- `useImageLoader` - Handles image file loading and validation
- `useImageFilters` - Applies brightness, contrast, and saturation
- `useImageBlur` - Canvas-based blur effect
- `useImagePresetFilters` - Six preset filter effects
- `useImageCrop` - Interactive cropping with aspect ratios

### Utility Hooks
- `usePerformanceMetrics` - Tracks FPS and render performance

## 🔧 Redux State Structure

```typescript
interface ImageState {
  brightness: number;      // -100 to 100
  contrast: number;        // -100 to 100
  saturation: number;      // 0 to 200
  blur: number;            // 0 to 100
  filter: string;          // 'none' | 'Grayscale' | 'Sepia' | etc.
  rotation: number;        // 0 | 90 | 180 | 270
  cropRatio: string;       // 'free' | '1:1' | '4:3' | '16:9' | '3:2'
  cropArea: CropArea | null;
}

interface ImageEditorState {
  present: ImageState;
  past: ImageState[];     // Undo history
  future: ImageState[];   // Redo history
}
```

## 🎨 Rendering Pipeline

```
Image Load → Rotation → Basic Filters → Preset Filters → Blur → Canvas Display
```

1. **Rotation**: Applied to base image
2. **Basic Filters**: Brightness, contrast, saturation (pixel-level)
3. **Preset Filters**: Grayscale, sepia, etc. (pixel-level)
4. **Blur**: CSS filter-based blur effect
5. **Crop Overlay**: Visual crop selection (non-destructive until applied)

## 🧪 Development

### Linting
```bash
npm run lint
```

### Type Checking
```bash
tsc --noEmit
```

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**SAIASHISH-sys**
- GitHub: [@SAIASHISH-sys](https://github.com/SAIASHISH-sys)
- Repository: [PicsNext](https://github.com/SAIASHISH-sys/PicsNext)

## 🙏 Acknowledgments

- React Team for the amazing framework
- Redux Team for state management
- Tailwind CSS for the utility-first CSS
- Vite for the blazing-fast build tool
- Fabric.js for advanced canvas capabilities

---

Built with ❤️ using React, TypeScript, and modern web technologies.

