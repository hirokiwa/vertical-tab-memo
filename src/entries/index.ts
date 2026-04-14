import { initializePage } from '../features/memo/initialize-page'
import { readPageConfig } from '../features/memo/page-config'
import { readMemoStateFromSearch, shouldFocusMemoInputFromSearch } from '../lib/memo'

initializePage(readMemoStateFromSearch(window.location.search), readPageConfig(), shouldFocusMemoInputFromSearch(window.location.search))
