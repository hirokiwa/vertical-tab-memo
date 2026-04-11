import type { PageElements } from './elements'
import type { StateService } from './state-service'

type SetupEditorParameters = {
  pageElements: PageElements
  stateService: StateService
}

const focusEditor = (pageElements: PageElements): void => {
  pageElements.memoInput.focus()
}

const syncEditorState = (pageElements: PageElements, stateService: StateService): void => {
  stateService.syncMemoState({
    memoText: pageElements.memoInput.value,
    faviconIcon: stateService.readCurrentMemoState().faviconIcon,
  })
}

const replaceSelectedText = (pageElements: PageElements, text: string): void => {
  const selectionStart = pageElements.memoInput.selectionStart ?? pageElements.memoInput.value.length
  const selectionEnd = pageElements.memoInput.selectionEnd ?? selectionStart
  pageElements.memoInput.setRangeText(text, selectionStart, selectionEnd, 'end')
}

export const setupEditor = ({ pageElements, stateService }: SetupEditorParameters): void => {
  const onEditorContainerClick = (): void => {
    focusEditor(pageElements)
  }

  const onEditorInput = (): void => {
    syncEditorState(pageElements, stateService)
  }

  const onEditorPaste = (event: ClipboardEvent): void => {
    event.preventDefault()
    replaceSelectedText(pageElements, event.clipboardData?.getData('text/plain') ?? '')
    syncEditorState(pageElements, stateService)
  }

  pageElements.memoEditor.addEventListener('click', onEditorContainerClick)
  pageElements.memoInput.addEventListener('input', onEditorInput)
  pageElements.memoInput.addEventListener('paste', onEditorPaste)
}
