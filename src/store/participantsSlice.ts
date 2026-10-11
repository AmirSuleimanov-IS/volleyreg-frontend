import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getParticipant, getParticipants } from '../api/participants'
import type { Participant, ParticipantsFilter } from '../types'
import { logoutThunk } from './authSlice'
import type { RootState } from './index'

// Каталог участниц: фильтр (сохраняется при переходе на другие страницы), список и открытая участница.
// isMock — данные взяты из mock-коллекции, потому что бэкенд недоступен.
interface ParticipantsState {
  filter: ParticipantsFilter
  items: Participant[]
  current: Participant | null
  loading: boolean
  isMock: boolean
}

const initialState: ParticipantsState = {
  filter: { participantName: '', position: '' },
  items: [],
  current: null,
  loading: false,
  isMock: false,
}

// GET /api/participants с текущим фильтром (сгенерированный axios-клиент, при ошибке — mock)
export const fetchParticipantsThunk = createAsyncThunk('participants/fetchList', async (_, { getState }) => {
  const { filter } = (getState() as RootState).participants
  return getParticipants(filter)
})

// GET /api/participants/:id
export const fetchParticipantThunk = createAsyncThunk('participants/fetchOne', async (id: number) => getParticipant(id))

const participantsSlice = createSlice({
  name: 'participants',
  initialState,
  reducers: {
    setParticipantsFilter: (state, action: PayloadAction<ParticipantsFilter>) => {
      state.filter = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParticipantsThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchParticipantsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data
        state.isMock = action.payload.isMock
      })
      .addCase(fetchParticipantThunk.pending, (state) => {
        state.loading = true
        state.current = null
      })
      .addCase(fetchParticipantThunk.fulfilled, (state, action) => {
        state.loading = false
        state.current = action.payload.data ?? null
        state.isMock = action.payload.isMock
      })
      // при выходе фильтры пользователя сбрасываются (даже если запрос выхода завершился ошибкой)
      .addCase(logoutThunk.fulfilled, (state) => {
        state.filter = initialState.filter
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.filter = initialState.filter
      })
  },
})

export const { setParticipantsFilter } = participantsSlice.actions
export default participantsSlice.reducer
