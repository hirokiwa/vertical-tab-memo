export const getRequiredElementById = <T extends HTMLElement>(elementId: string): T => {
  const element = document.getElementById(elementId)
  if (element === null) {
    throw new Error(`Required element is missing: ${elementId}`)
  }
  return element as T
}
