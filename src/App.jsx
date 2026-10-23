import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BookmarkCheck,
  Check,
  Mail,
  MapPin,
  Plus,
  RefreshCw,
  Trash2,
  UsersRound,
  UserRound,
  AlertCircle,
  Bookmark,
} from 'lucide-react'
import {
  errorChanged,
  generatedUsersCleared,
  loadingChanged,
  savedUserRemoved,
  userAdded,
  userSaved,
} from './redux/usersSlice'

function normalizeUser(raw) {
  return {
    id: raw.login.uuid,
    picture: raw.picture.large,
    thumbnail: raw.picture.thumbnail,
    name: `${raw.name.first} ${raw.name.last}`,
    email: raw.email,
    gender: raw.gender,
    country: raw.location.country,
  }
}

function UserCard({ user, index, isSaved, onSave }) {
  return (
    <article className="grid grid-cols-[28px_64px_minmax(0,1fr)] items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[30px_76px_minmax(0,1fr)_auto] sm:gap-4 sm:p-5">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
        {index + 1}
      </span>
      <img className="h-16 w-16 rounded-lg bg-slate-100 object-cover sm:h-[76px] sm:w-[76px]" src={user.picture} alt={`${user.name} profile`} />
      <div className="min-w-0">
        <h3 className="mb-2 truncate text-sm font-semibold text-slate-900 sm:text-base">{user.name}</h3>
        <p className="mb-1 flex min-w-0 items-center gap-2 text-xs text-slate-500 sm:text-sm">
          <Mail size={15} className="shrink-0" /><span className="truncate">{user.email}</span>
        </p>
        <p className="mb-1 flex items-center gap-2 text-xs capitalize text-slate-500 sm:text-sm">
          <UserRound size={15} className="shrink-0" />
          {user.gender}
        </p>
        <p className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm"><MapPin size={15} className="shrink-0" /><span className="truncate">{user.country}</span></p>
      </div>
      <button
        onClick={() => onSave(user)}
        disabled={isSaved}
        className={`col-start-2 col-end-4 mt-1 inline-flex w-fit items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold sm:col-auto sm:mt-0 ${isSaved ? 'cursor-default border border-emerald-200 bg-emerald-50 text-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
      >
        {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
        {isSaved ? 'Saved' : 'Save'}
      </button>
    </article>
  )
}

function SavedProfileCard({ user, onRemove }) {
  return (
    <article className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
      <img className="h-14 w-14 shrink-0 rounded-lg bg-slate-100 object-cover" src={user.thumbnail || user.picture} alt={`${user.name} profile`} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-900">{user.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500"><MapPin size={13} />{user.country}</p>
      </div>
      <button onClick={() => onRemove(user.id)} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-rose-200 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 sm:px-3">
        <Trash2 size={14} /> <span className="hidden sm:inline">Remove</span>
      </button>
    </article>
  )
}

function EmptyState({ saved = false, onGenerate }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 px-5 py-14 text-center">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500">
        {saved ? <BookmarkCheck size={22} /> : <UsersRound size={22} />}
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{saved ? 'No saved profiles yet' : 'No users generated yet'}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {saved ? 'Save a profile from the generated users page and it will show up here.' : 'Generate your first random profile to get started.'}
      </p>
      {saved && <button onClick={onGenerate} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Generate users</button>}
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch()
  const { generatedUsers, savedUsers, loading, error } = useSelector((state) => state.users)
  const [page, setPage] = useState('generated')

  const generateUser = async () => {
    dispatch(loadingChanged(true))
    dispatch(errorChanged(''))
    try {
      const response = await fetch('https://randomuser.me/api/')
      if (!response.ok) throw new Error('Request failed')
      const data = await response.json()
      if (!data.results?.[0]) throw new Error('No user returned')
      dispatch(userAdded(normalizeUser(data.results[0])))
    } catch {
      dispatch(errorChanged('Could not fetch a user. Check your connection and try again.'))
    }
  }

  const saveUser = (user) => dispatch(userSaved(user))
  const removeUser = (id) => dispatch(savedUserRemoved(id))

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 md:flex">
      <aside className="flex w-full flex-col border-b border-slate-200 bg-white p-4 md:fixed md:inset-y-0 md:w-60 md:border-b-0 md:border-r md:p-5">
        <div className="mb-5 flex items-center gap-3 md:mb-10">
          

        </div>
        <nav className="flex gap-2 md:flex-col" aria-label="Main navigation">
          <button onClick={() => setPage('generated')} className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium md:flex-none ${page === 'generated' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <UsersRound size={18} /> Generate Users
          </button>
          <button onClick={() => setPage('saved')} className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium md:flex-none ${page === 'saved' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <BookmarkCheck size={18} /> Saved Profiles
            <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs text-slate-600">{savedUsers.length}</span>
          </button>
        </nav>

      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 md:ml-60 md:p-9 lg:p-10">
        <header className="mb-6">
         <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Random User Profile Generator</h1>
        </header>

        {page === 'generated' ? (
          <>
            <section className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
              <button onClick={generateUser} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={17} />}
                {loading ? 'Generating…' : 'Generate Random User'}
              </button>
              <button onClick={() => dispatch(generatedUsersCleared())} disabled={generatedUsers.length === 0} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                <Trash2 size={16} /> Clear Users
              </button>

            </section>

            {error && <div role="alert" className="mb-5 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"><AlertCircle size={17} className="mt-0.5 shrink-0" />{error}</div>}

            <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Generated Users</h2>

                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{generatedUsers.length} users</span>
              </div>
              {generatedUsers.length === 0 ? <EmptyState /> : (
                <div className="grid gap-3">
                  {generatedUsers.map((user, index) => (
                    <UserCard key={user.id} user={user} index={index} isSaved={savedUsers.some((saved) => saved.id === user.id)} onSave={saveUser} />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Saved Profiles</h2>

              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{savedUsers.length} saved</span>
            </div>
            {savedUsers.length === 0 ? <EmptyState saved onGenerate={() => setPage('generated')} /> : (
              <div className="grid gap-3">
                {savedUsers.map((user) => <SavedProfileCard key={user.id} user={user} onRemove={removeUser} />)}
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  )
}