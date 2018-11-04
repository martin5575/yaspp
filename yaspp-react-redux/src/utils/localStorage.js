const SERIALIZED_STATE_KEY = 'yaspp_state'

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(SERIALIZED_STATE_KEY)
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(SERIALIZED_STATE_KEY, serializedState)
  } catch (error) {
    console.error(error)
  }
}