"use client";
import { useCallback, useReducer } from "react";

export interface FormInputState {
  value: any;
  isValid: boolean;
}

type FormAction =
  | { type: "INPUT_CHANGE"; inputID: string; value: any; isValid: boolean }
  | { type: "SET_DATA"; inputs: { [key: string]: FormInputState }; isFormValid: boolean };

const formReducer = (state: any, action: FormAction) => {
  switch (action.type) {
    case "INPUT_CHANGE": {
      let formIsValid = true;
      const updatedInputs = {
        ...state.inputs,
        [action.inputID]: { value: action.value, isValid: action.isValid },
      };
      for (const inputId in updatedInputs) {
        if (!updatedInputs[inputId].isValid) {
          formIsValid = false;
          break;
        }
      }
      return { ...state, inputs: updatedInputs, isFormValid: formIsValid };
    }
    case "SET_DATA":
      return { inputs: action.inputs, isFormValid: action.isFormValid };
    default:
      return state;
  }
};


export const createFormInputs = (initialValues: { [key: string]: { value: any; isValid?: boolean } }) => {
  const inputs: { [key: string]: FormInputState } = {};
  let isAllValid = true;

  for (const key in initialValues) {
    const item = initialValues[key];
    const isValid = item.isValid !== undefined ? item.isValid : true;
    inputs[key] = { value: item.value, isValid };
    if (!isValid) isAllValid = false;
  }
  return { inputs, isFormValid: isAllValid };
};

export default function useForm(initialValues: { [key: string]: { value: any; isValid?: boolean } }) {
  const initial = createFormInputs(initialValues);
  const [formState, dispatch] = useReducer(formReducer, initial);

  const onInputHandler = useCallback((inputID: string, value: any, isValid: boolean = true) => {
    dispatch({ type: "INPUT_CHANGE", inputID, value, isValid });
  }, []);

  const setFormData = useCallback((newValues: { [key: string]: { value: any; isValid?: boolean } }) => {
    dispatch({ type: "SET_DATA", ...createFormInputs(newValues) });
  }, []);

  return [formState, onInputHandler, setFormData] as const;
}