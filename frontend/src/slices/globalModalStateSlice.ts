import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface GlobalModalState {
  isOpen: boolean;
  type: "createTask" | "createProject" | null;
}

const initialState: GlobalModalState = {
    isOpen: false,
    type: null
}


export const globalModalState = createSlice({
  name: 'globalModalState',
  initialState,
  reducers: {
   setGlobalModalState: (state, action: PayloadAction<GlobalModalState>) => {
    state.isOpen = action.payload.isOpen;
    state.type = action.payload.type;
   },
    resetGlobalModalState: (state) => {
      state.isOpen = false;
      state.type = null;
    },
    
    
  },
})

// Action creators are generated for each case reducer function
export const { setGlobalModalState, resetGlobalModalState } = globalModalState.actions

export default globalModalState.reducer