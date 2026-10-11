import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { api, errorMessage } from '../api'
import type { SerializerTeamApplicationResponse } from '../api/generated/Api'
import { logoutThunk } from './authSlice'
import type { RootState } from './index'

// Фильтры списка заявок: статус и диапазон даты формирования — на бэкенде, представитель — на фронтенде
export interface TeamApplicationsFilters {
  status: string
  formedFrom: string
  formedTo: string
  creator: string
}

interface TeamApplicationsState {
  items: SerializerTeamApplicationResponse[]
  filters: TeamApplicationsFilters
  loading: boolean
  error: string | null
}

// сегодняшняя дата по местному времени в формате YYYY-MM-DD
const today = () => new Date().toLocaleDateString('sv-SE')
const initialState = (): TeamApplicationsState => ({
  items: [],
  filters: { status: '', formedFrom: today(), formedTo: today(), creator: '' },
  loading: false,
  error: null,
})

// silent — фоновое обновление (short polling) без анимации загрузки
export const fetchTeamApplicationsThunk = createAsyncThunk(
  'teamApplications/fetch',
  async (_: { silent?: boolean } | undefined, { getState, rejectWithValue }) => {
    const { filters } = (getState() as RootState).teamApplications
    try {
      const { data } = await api.teamApplications.teamApplicationsList({
        status: filters.status || undefined,
        formed_from: filters.formedFrom || undefined,
        formed_to: filters.formedTo || undefined,
      })
      return data
    } catch (e) {
      return rejectWithValue(errorMessage(e))
    }
  },
)

// PUT /api/team-applications/:id/moderate — организатор допускает или отклоняет заявку
export const moderateTeamApplicationThunk = createAsyncThunk(
  'teamApplications/moderate',
  async ({ id, action }: { id: number; action: 'complete' | 'reject' }, { dispatch, rejectWithValue }) => {
    try {
      await api.teamApplications.teamApplicationsModerateUpdate(id, { action })
      await dispatch(fetchTeamApplicationsThunk({ silent: true }))
    } catch (e) {
      return rejectWithValue(errorMessage(e))
    }
  },
)

const teamApplicationsSlice = createSlice({
  name: 'teamApplications',
  initialState,
  reducers: {
    setTeamApplicationsFilters: (state, action: PayloadAction<Partial<TeamApplicationsFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamApplicationsThunk.pending, (state, action) => {
        if (!action.meta.arg?.silent) state.loading = true
        state.error = null
      })
      .addCase(fetchTeamApplicationsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchTeamApplicationsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(moderateTeamApplicationThunk.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // при выходе фильтры пользователя сбрасываются (даже если запрос выхода завершился ошибкой)
      .addCase(logoutThunk.fulfilled, () => initialState())
      .addCase(logoutThunk.rejected, () => initialState())
  },
})

export const { setTeamApplicationsFilters } = teamApplicationsSlice.actions
export default teamApplicationsSlice.reducer
