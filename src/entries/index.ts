import '../styles/app.css'
import { initializePage } from '../features/memo/bootstrap'
import { readMemoStateFromSearch } from '../lib/memo'

initializePage(readMemoStateFromSearch(window.location.search))
