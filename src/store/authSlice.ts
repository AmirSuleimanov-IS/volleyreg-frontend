import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, errorMessage, TOKEN_KEY } from '../api'
import type { SerializerUserResponse } from '../api/generated/Api'

// Состояние авторизации: пользователь после входа (null — интерфейс гостя)
interface AuthState {
  user: SerializerUserResponse | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = { user: null, loading: false, error: null }

// Вход: JWT сохраняется в localStorage, пользователь — в Redux
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { login: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.users.usersLoginCreate(credentials)
      localStorage.setItem(TOKEN_KEY, data.access_token!)
      return data.user!
    } catch (e) {
      return rejectWithValue(errorMessage(e))
    }
  },
)

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (body: { login: string; password: string; full_name: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.users.usersRegisterCreate(body)
      return data
    } catch (e) {
      return rejectWithValue(errorMessage(e))
    }
  },
)

// Выход: токен отзывается на бэкенде (чёрный список Redis) и удаляется из localStorage
export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    await api.users.usersLogoutCreate()
  } finally {
    localStorage.removeItem(TOKEN_KEY)
  }
})

// Личный кабинет: смена ФИО и пароля
export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async (body: { full_name?: string; password?: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.users.usersMeUpdate(body)
      return data
    } catch (e) {
      return rejectWithValue(errorMessage(e))
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(logoutThunk.fulfilled, () => initialState)
      .addCase(logoutThunk.rejected, () => initialState)
  },
})

export const { clearAuthError } = authSlice.actions
export default authSlice.reducer
