import {
  ADD_FILE_CCV,
  GET_FILES_CCV,
  SET_FILE_CCV,
  DELETE_FILE_CCV,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  filesCCV: [],
  currentFileCCV: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_FILES: {
      return {
        ...state,
        filesCCV: action.payload,
      };
    }
    case SET_FILE_CCV: {
      return {
        ...state,
        currentFileCCV: action.payload,
      };
    }
    case ADD_FILE_CCV: {
      return {
        ...state,
        filesCCV: [action.payload, ...state.filesCCV],
      };
    }
    case DELETE_FILE: {
      return {
        ...state,
        filesCCV: state.filesCCV.filter(fileCCV => fileCCV.id !== action.payload),
      };
    }
   default:
      return state;
  }
};
