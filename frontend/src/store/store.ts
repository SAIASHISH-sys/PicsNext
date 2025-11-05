import { configureStore } from '@reduxjs/toolkit';
import imageEditorReducer from './imageEditorSlice';

export const store = configureStore({
  reducer: {
    imageEditor: imageEditorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;