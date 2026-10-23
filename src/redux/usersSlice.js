import { createSlice } from '@reduxjs/toolkit'

const readSavedUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('userbase-saved-users') || '[]')
  } catch {
    return []
  }
}

const initialState = {
  generatedUsers: [],
  savedUsers: readSavedUsers(),
  loading: false,
  error: '',
}

const persistSavedUsers = (users) => {
  try {
    localStorage.setItem('userbase-saved-users', JSON.stringify(users))
  } catch {
    
  }
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    userAdded(state, action) {
      const user = action.payload
      if (!state.generatedUsers.some((item) => item.id === user.id)) {
        state.generatedUsers.push(user)
      }
      state.loading = false
      state.error = ''
    },
    loadingChanged(state, action) {
      state.loading = action.payload
    },
    errorChanged(state, action) {
      state.error = action.payload
      state.loading = false
    },
    userSaved(state, action) {
      const user = action.payload
      if (!state.savedUsers.some((item) => item.id === user.id)) {
        state.savedUsers.push(user)
        persistSavedUsers(state.savedUsers)
      }
    },
    savedUserRemoved(state, action) {
      state.savedUsers = state.savedUsers.filter((user) => user.id !== action.payload)
      persistSavedUsers(state.savedUsers)
    },
    generatedUsersCleared(state) {
      state.generatedUsers = []
      state.error = ''
    },
  },
})

export const {
  userAdded,
  loadingChanged,
  errorChanged,
  userSaved,
  savedUserRemoved,
  generatedUsersCleared,
} = usersSlice.actions

export default usersSlice.reducer