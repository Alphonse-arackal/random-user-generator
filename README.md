# Userbase — Random User Profile Generator

A minimal, responsive React app built with Tailwind CSS and Redux Toolkit.

## Features
- Fetch a random user from `https://randomuser.me/api/`
- Append profiles to the generated user list
- Show serial number, photo, full name, email, gender, and country
- Save profiles with duplicate prevention by unique user ID
- View saved profiles on a separate page and remove them
- Clear all generated user cards
- Persist saved profiles in browser local storage
- Responsive layout and API error handling

## Run locally
Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Production build
```bash
npm run build
npm run preview
```

## Folder structure
```text
src/
  redux/
    store.js
    usersSlice.js
  App.jsx
  main.jsx
  index.css
```

## Styling
Tailwind CSS v4 is configured through `@tailwindcss/vite`; most layout, spacing, colour, and responsive styling uses Tailwind utility classes. `src/index.css` only imports Tailwind and contains a few global defaults.
