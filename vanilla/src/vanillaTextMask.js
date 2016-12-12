import createTextMaskInputElement from '../../core/src/createTextMaskInputElement.js'
import throttle from 'lodash.throttle'

export function maskInput(textMaskConfig) {
  const {inputElement} = textMaskConfig
  const textMaskInputElement = createTextMaskInputElement(textMaskConfig)
  const inputHandler = ({target: {value}}) => textMaskInputElement.update(value)

  // There are 2 problems in Android browsers:
  // 1. When `input` event is triggered the `selectionStart` value is still not updated.
  //    As a workaround we wrap the event handler in setTimeout.
  // 2. Also, sometimes (actually, quite often) Android triggers `input` event twice.
  //    As a workaround we wrap the handler in _.throttle function, so that first call occurs
  //    immediately (after setTimeout), and any other calls are forbidden for next 300 milliseconds.
  // Note, that this occurs only for text inputs, not for tel.
  const isAndroid = navigator.userAgent.match(/Android (\d+)/)
  const isOldAndroid = isAndroid && isAndroid[1] < 5
  const isTelInput = inputElement.getAttribute('type') === 'tel'

  inputElement.addEventListener(
    'input',
    isOldAndroid && !isTelInput ?
      throttle(e => setTimeout(() => inputHandler(e)), 300, { trailing: false }) :
      inputHandler
  )

  textMaskInputElement.update(inputElement.value)

  return {
    textMaskInputElement,

    destroy() {
      inputElement.removeEventListener('input', inputHandler)
    }
  }
}

export default maskInput
export {default as conformToMask} from '../../core/src/conformToMask.js'
