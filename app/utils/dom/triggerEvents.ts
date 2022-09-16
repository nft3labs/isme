export const triggerEvents = (element: HTMLElement, type: string) => {
  const event = new Event(type, { bubbles: true })
  element.dispatchEvent(event)
}
