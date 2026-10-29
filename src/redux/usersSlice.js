import { createSlice } from '@reduxjs/toolkit'

// Retrieves previously saved profiles from Local Storage when the app starts
// Returns an empty array if reading fails.

const readSavedUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('userbase-saved-users') || '[]')
  } catch {
    return []
  }
}

// defines starting datas

const initialState = {
  generatedUsers: [],
  savedUsers: readSavedUsers(),
  loading: false,
  error: '',
}

// Saves the updated profiles to Local Storage so they remain after refreshing the page.

const persistSavedUsers = (users) => {
  try {
    localStorage.setItem('userbase-saved-users', JSON.stringify(users))
  } catch {
    
  }
}

// Creates the Redux slice that manages user-related data and defines how that data changes.

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {

// Adds a newly generated profile to generatedUsers,
//  prevents duplicate IDs
//  resets loading and error states.

    userAdded(state, action) {
      const user = action.payload
      if (!state.generatedUsers.some((item) => item.id === user.id)) {
        state.generatedUsers.push(user)
      }
      state.loading = false
      state.error = ''
    },

    // Updates the loading status when fetching a user.
    loadingChanged(state, action) {
      state.loading = action.payload
    },

    // Stores an error message and stops the loading indicator.
    errorChanged(state, action) {
      state.error = action.payload
      state.loading = false
    },

    // Adds a profile to savedUsers if it isn't already saved, then updates Local Storage.
    userSaved(state, action) {
      const user = action.payload
      if (!state.savedUsers.some((item) => item.id === user.id)) {
        state.savedUsers.push(user)
        persistSavedUsers(state.savedUsers)
      }
    },

    // Removes a profile from savedUsers using its ID and updates Local Storage.
    savedUserRemoved(state, action) {
      state.savedUsers = state.savedUsers.filter((user) => user.id !== action.payload)
      persistSavedUsers(state.savedUsers)
    },

    // Clears all generated profiles and the error message without deleting saved profiles.
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
