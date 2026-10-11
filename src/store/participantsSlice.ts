import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ParticipantsFilter } from '../types'
import { logoutThunk } from './authSlice'

// Фильтр списка участников хранится в Redux: при переходе на другие страницы и обратно значение сохраняется
interface ParticipantsState {
  filter: ParticipantsFilter
}

const initialState: ParticipantsState = { filter: { participantName: '', position: '' } }

const participantsSlice = createSlice({
  name: 'participants',
  initialState,
  reducers: {
    setParticipantsFilter: (state, action: PayloadAction<ParticipantsFilter>) => {
      state.filter = action.payload
    },
  },
  extraReducers: (builder) => {
    // при выходе фильтры пользователя сбрасываются
    builder.addCase(logoutThunk.fulfilled, () => initialState)
  },
})

export const { setParticipantsFilter } = participantsSlice.actions
export default participantsSlice.reducer
