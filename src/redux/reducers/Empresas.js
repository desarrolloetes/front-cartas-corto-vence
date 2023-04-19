import {
  GET_EMPRESAS,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  empresas: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_EMPRESAS: {
      return {
        ...state,
        empresas: action.payload,
      };
    }
   default:
      return state;
  }
};
