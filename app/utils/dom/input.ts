import { triggerEvents } from './triggerEvents'

export const inputSetValue = (input: HTMLInputElement, value: string) => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  nativeInputValueSetter.call(input, value)
  triggerEvents(input, 'input')
}
