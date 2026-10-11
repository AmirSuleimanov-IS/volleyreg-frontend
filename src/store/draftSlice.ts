import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, errorMessage } from '../api'
import { logoutThunk } from './authSlice'
import { deleteTeamApplicationThunk, formTeamApplicationThunk } from './teamApplicationSlice'

// Черновик заявки представителя (иконка «корзины»): id и количество участниц
interface DraftState {
  draftId: number | null
  count: number
  addingId: number | null
  error: string | null
}

const initialState: DraftState = { draftId: null, count: 0, addingId: null, error: null }

export const fetchDraftThunk = createAsyncThunk('draft/fetch', async () => {
  const { data } = await api.teamApplications.teamApplicationsDraftList()
  return data
})

export const addToDraftThunk = createAsyncThunk('draft/add', async (participantId: number, { rejectWithValue }) => {
  try {
    const { data } = await api.teamApplications.teamApplicationsDraftParticipantsCreate(participantId)
    return data
  } catch (e) {
    return rejectWithValue(errorMessage(e))
  }
})

const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDraftThunk.fulfilled, (state, action) => {
        state.draftId = action.payload.team_application_id ?? null
        state.count = action.payload.participants_count ?? 0
      })
      .addCase(addToDraftThunk.pending, (state, action) => {
        state.addingId = action.meta.arg
        state.error = null
      })
      .addCase(addToDraftThunk.fulfilled, (state, action) => {
        state.addingId = null
        state.draftId = action.payload.team_application_id ?? null
        state.count = action.payload.participants_count ?? 0
      })
      .addCase(addToDraftThunk.rejected, (state, action) => {
        state.addingId = null
        state.error = action.payload as string
      })
      // после формирования или удаления черновика корзина пуста
      .addCase(formTeamApplicationThunk.fulfilled, () => initialState)
      .addCase(deleteTeamApplicationThunk.fulfilled, () => initialState)
      // при выходе содержимое конструктора заявки сбрасывается
      .addCase(logoutThunk.fulfilled, () => initialState)
      .addCase(logoutThunk.rejected, () => initialState)
  },
})

export default draftSlice.reducer
