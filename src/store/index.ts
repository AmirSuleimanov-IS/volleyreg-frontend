import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import draftReducer from './draftSlice'
import participantsReducer from './participantsSlice'
import teamApplicationReducer from './teamApplicationSlice'
import teamApplicationsReducer from './teamApplicationsSlice'

// Хранилище Redux Toolkit: thunk-middleware подключается configureStore по умолчанию
export const store = configureStore({
  reducer: {
    auth: authReducer,
    draft: draftReducer,
    participants: participantsReducer,
    teamApplication: teamApplicationReducer,
    teamApplications: teamApplicationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
