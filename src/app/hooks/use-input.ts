import { ChangeEvent, useReducer } from "react";

type Action = {
  type: "INPUT" | "BLUR" | "RESET" | "BLUR_SELECT";
  value?: string;
};

type State = {
  value: string;
  isTouched: boolean;
};

const inputStateReducer = (state: State, action: Action): State => {
  if (action.type === "INPUT") {
    return { value: action.value!, isTouched: true };
  }
  if (action.type === "BLUR") {
    return { isTouched: true, value: state.value };
  }

  if (action.type === "BLUR_SELECT") {
    return { isTouched: true, value: action.value! };
  }
  if (action.type === "RESET") {
    return { isTouched: false, value: action.value! };
  } else {
    throw Error();
  }
};

const useInput = (
  validateValue: (value: string) => boolean,
  defaultValue = ""
) => {
  const initialInputState: State = {
    value: defaultValue,
    isTouched: false,
  };
  const [inputState, dispatch] = useReducer(
    inputStateReducer,
    initialInputState
  );

  const valueIsValid = validateValue(inputState.value);
  const hasError = !valueIsValid && inputState.isTouched;
  const inputClasses = hasError ? "form-control invalid" : "form-control";
  const valueChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "INPUT", value: event.target.value });
  };
  const setValueHandler = (value: string) => {
    dispatch({ type: "INPUT", value: value });
  };

  const inputBlurHandler = () => {
    dispatch({ type: "BLUR" });
  };

  const reset = () => {
    dispatch({ type: "RESET", value: defaultValue });
  };

  const inputBlurSelectHandler = (title: string) => () => {
    dispatch({ type: "BLUR_SELECT", value: title });
  };

  return {
    value: inputState.value,
    isValid: valueIsValid,
    hasError,
    hasFocus: inputState.isTouched,
    inputClasses,
    setValueHandler,
    valueChangeHandler,
    inputBlurHandler,
    inputBlurSelectHandler,
    reset,
  };
};

export default useInput;
