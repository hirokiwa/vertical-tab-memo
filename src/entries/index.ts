import { initializePage } from '../features/memo/bootstrap'
import { readPageConfig } from '../features/memo/page-config'
import { readMemoStateFromSearch } from '../lib/memo'

initializePage(readMemoStateFromSearch(window.location.search), readPageConfig())
