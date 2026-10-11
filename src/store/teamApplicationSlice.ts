import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, errorMessage } from '../api'
import type { SerializerTeamApplicationDetailResponse, SerializerTeamApplicationUpdateRequest } from '../api/generated/Api'
import { logoutThunk } from './authSlice'

// Открытая заявка команды (страница /team-applications/:id)
interface TeamApplicationState {
  app: SerializerTeamApplicationDetailResponse | null
  loading: boolean
  saving: boolean
  error: string | null
}

const initialState: TeamApplicationState = { app: null, loading: false, saving: false, error: null }

export const fetchTeamApplicationThunk = createAsyncThunk('teamApplication/fetch', async (id: number, { rejectWithValue }) => {
  try {
    return (await api.teamApplications.teamApplicationsDetail(id)).data
  } catch (e) {
    return rejectWithValue(errorMessage(e))
  }
})

// PUT /api/team-applications/:id — поля заявки по теме
export const updateTeamApplicationThunk = createAsyncThunk(
  'teamApplication/update',
  async ({ id, body }: { id: number; body: SerializerTeamApplicationUpdateRequest }, { rejectWithValue }) => {
    try {
      return (await api.teamApplications.teamApplicationsUpdate(id, body)).data
    } catch (e) {
      return rejectWithValue(errorMessage(e))
    }
  },
)

// PUT /api/team-applications/:id/participants/:participant_id — игровой номер (м-м)
export const updateJerseyNumberThunk = createAsyncThunk(
  'teamApplication/updateJerseyNumber',
  async (
    { id, participantId, jerseyNumber }: { id: number; participantId: number; jerseyNumber: number },
    { rejectWithValue },
  ) => {
    try {
      await api.teamApplications.teamApplicationsParticipantsUpdate(id, participantId, { jersey_number: jerseyNumber })
      return (await api.teamApplications.teamApplicationsDetail(id)).data
    } catch (e) {
      return rejectWithValue(errorMessage(e))
    }
  },
)

// DELETE /api/team-applications/:id/participants/:participant_id — убрать участницу (м-м)
export const removeParticipantThunk = createAsyncThunk(
  'teamApplication/removeParticipant',
  async ({ id, participantId }: { id: number; participantId: number }, { rejectWithValue }) => {
    try {
      await api.teamApplications.teamApplicationsParticipantsDelete(id, participantId)
      return (await api.teamApplications.teamApplicationsDetail(id)).data
    } catch (e) {
      return rejectWithValue(errorMessage(e))
    }
  },
)

// PUT /api/team-applications/:id/form — сформировать (расчёт среднего возраста)
export const formTeamApplicationThunk = createAsyncThunk('teamApplication/form', async (id: number, { rejectWithValue }) => {
  try {
    return (await api.teamApplications.teamApplicationsFormUpdate(id)).data
  } catch (e) {
    return rejectWithValue(errorMessage(e))
  }
})

// DELETE /api/team-applications/:id — удалить черновик
export const deleteTeamApplicationThunk = createAsyncThunk('teamApplication/delete', async (id: number, { rejectWithValue }) => {
  try {
    await api.teamApplications.teamApplicationsDelete(id)
    return id
  } catch (e) {
    return rejectWithValue(errorMessage(e))
  }
})

const savingThunks = [updateTeamApplicationThunk, updateJerseyNumberThunk, removeParticipantThunk, formTeamApplicationThunk]

const teamApplicationSlice = createSlice({
  name: 'teamApplication',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamApplicationThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTeamApplicationThunk.fulfilled, (state, action) => {
        state.loading = false
        state.app = action.payload
      })
      .addCase(fetchTeamApplicationThunk.rejected, (state, action) => {
        state.loading = false
        state.app = null
        state.error = action.payload as string
      })
      .addCase(deleteTeamApplicationThunk.fulfilled, () => initialState)
      .addCase(deleteTeamApplicationThunk.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(logoutThunk.fulfilled, () => initialState)
      .addCase(logoutThunk.rejected, () => initialState)
    for (const thunk of savingThunks) {
      builder
        .addCase(thunk.pending, (state) => {
          state.saving = true
          state.error = null
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.saving = false
          state.app = action.payload as SerializerTeamApplicationDetailResponse
        })
        .addCase(thunk.rejected, (state, action) => {
          state.saving = false
          state.error = action.payload as string
        })
    }
  },
})

export default teamApplicationSlice.reducer
