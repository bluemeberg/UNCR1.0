//

import {TypeDog} from '../../data/test/TypeDog';
import {DogActions, GET_DOG_SUCCESS} from '../../actions/test/dog';

export type TypeDogReducer = {
  currentDog: TypeDog | null;
};

const initialState: TypeDogReducer = {
  currentDog: null,
};

export const dogReducer = (state = initialState, action: DogActions) => {
  if (action.type === 'GET_DOG_SUCCESS') {
    return {
      ...state,
      currentDog: action.data,
    };
  }
  return {
    ...state,
  };
};