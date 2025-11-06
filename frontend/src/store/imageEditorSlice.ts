import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageState {
  brightness: number;
  contrast: number;
  saturation: number;
  cropRatio: string;
  cropArea: CropArea | null;
  filter: string;
  rotation: number;
}

interface ImageEditorState {
  present: ImageState;
  past: ImageState[];
  future: ImageState[];
}

const initialState: ImageEditorState = {
  present: {
    brightness: 0,
    contrast: 0,
    saturation: 100,
    cropRatio: 'free',
    cropArea: null,
    filter: 'none',
    rotation: 0,
  },
  past: [],
  future: [],
};

const imageEditorSlice = createSlice({
  name: 'imageEditor',
  initialState,
  reducers: {
    updateImageState: (state, action: PayloadAction<Partial<ImageState>>) => {
      // Only add to history if there's an actual change
      const hasChanged = Object.keys(action.payload).some(
        key => action.payload[key as keyof ImageState] !== state.present[key as keyof ImageState]
      );

      if (hasChanged) {
        state.past.push(state.present);
        state.present = { ...state.present, ...action.payload };
        state.future = []; // Clear future when a new action is performed
      }
    },
    
    setBrightness: (state, action: PayloadAction<number>) => {
      if (state.present.brightness !== action.payload) {
        state.past.push(state.present);
        state.present = { ...state.present, brightness: action.payload };
        state.future = [];
      }
    },
    
    setContrast: (state, action: PayloadAction<number>) => {
      if (state.present.contrast !== action.payload) {
        state.past.push(state.present);
        state.present = { ...state.present, contrast: action.payload };
        state.future = [];
      }
    },
    
    setSaturation: (state, action: PayloadAction<number>) => {
      if (state.present.saturation !== action.payload) {
        state.past.push(state.present);
        state.present = { ...state.present, saturation: action.payload };
        state.future = [];
      }
    },
    
    setCropRatio: (state, action: PayloadAction<string>) => {
      if (state.present.cropRatio !== action.payload) {
        state.past.push(state.present);
        state.present = { ...state.present, cropRatio: action.payload };
        state.future = [];
      }
    },
    
    setCropArea: (state, action: PayloadAction<CropArea | null>) => {
      const hasChanged = JSON.stringify(state.present.cropArea) !== JSON.stringify(action.payload);
      if (hasChanged) {
        state.past.push(state.present);
        state.present = { ...state.present, cropArea: action.payload };
        state.future = [];
      }
    },
    
    applyCrop: (state) => {
      // When crop is applied, reset the crop area but keep it in history
      if (state.present.cropArea) {
        state.past.push(state.present);
        state.present = { ...state.present, cropArea: null };
        state.future = [];
      }
    },
    
    setFilter: (state, action: PayloadAction<string>) => {
      if (state.present.filter !== action.payload) {
        state.past.push(state.present);
        state.present = { ...state.present, filter: action.payload };
        state.future = [];
      }
    },
    
    setRotation: (state, action: PayloadAction<number>) => {
      if (state.present.rotation !== action.payload) {
        state.past.push(state.present);
        state.present = { ...state.present, rotation: action.payload };
        state.future = [];
      }
    },
    
    undo: (state) => {
      if (state.past.length > 0) {
        const previous = state.past[state.past.length - 1];
        state.future.unshift(state.present);
        state.present = previous;
        state.past = state.past.slice(0, -1);
      }
    },
    
    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future[0];
        state.past.push(state.present);
        state.present = next;
        state.future = state.future.slice(1);
      }
    },
    
    resetImageState: (state) => {
      state.past.push(state.present);
      state.present = initialState.present;
      state.future = [];
    },
    
    clearHistory: (state) => {
      state.past = [];
      state.future = [];
    },
  },
});

export const {
  updateImageState,
  setBrightness,
  setContrast,
  setSaturation,
  setCropRatio,
  setCropArea,
  applyCrop,
  setFilter,
  setRotation,
  undo,
  redo,
  resetImageState,
  clearHistory,
} = imageEditorSlice.actions;

export default imageEditorSlice.reducer;
