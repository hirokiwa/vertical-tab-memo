import type { PageElements } from './elements'
import type { StateService } from './state-service'

type SetupFormParameters = {
  pageElements: PageElements
  stateService: StateService
}

export const setupForm = ({ pageElements, stateService }: SetupFormParameters): void => {
  const onMemoInput = (): void => {
    stateService.syncMemoState({
      memoText: pageElements.memoInput.value,
      faviconIcon: stateService.readCurrentMemoState().faviconIcon,
    })
  }

  const onMemoSubmit = (event: Event): void => {
    event.preventDefault()
    onMemoInput()
  }

  pageElements.memoForm.addEventListener('submit', onMemoSubmit)
  pageElements.memoInput.addEventListener('input', onMemoInput)
}
