import { SET_ALERT, REMOVE_ALERT } from "../actiontypes/types";
const initialState = [];

export default function (state = initialState, action) {
  //action contain type and payload
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      // copy of current state ...state and update with payload
      return [...state, payload]; // in here payload will be  msg, alertType, id
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
