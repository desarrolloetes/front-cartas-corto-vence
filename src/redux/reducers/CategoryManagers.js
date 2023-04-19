import {
  ADD_CATEGORY_MANAGER,
  EDIT_CATEGORY_MANAGER,
  DELETE_CATEGORY_MANAGER,
  GET_CATEGORY_MANAGERS,
  SET_CATEGORY_MANAGER_DETAILS,
  SET_CATEGORY_MANAGERS,
  GET_CATEGORY_MANAGER_BY_LOGIN,
  GET_CATEGORY_MANAGER_PROVEDORES,
  SET_PROVEEDORES_CATEGORY_MANAGER,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  categoryManagers: [],
  currentProveedoresCategoryManager: [],
  currentCategoryManager: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_CATEGORY_MANAGER: {
      return {
        ...state,
        categoryManagers: [action.payload, ...state.categoryManagers],
      };
    }
    case EDIT_CATEGORY_MANAGER: {
      return {
        ...state,
        categoryManagers: state.categoryManagers.map(categoryManagers => (categoryManagers.id === action.payload.id ? action.payload : categoryManagers)),
      };
    }
    case DELETE_CATEGORY_MANAGER: {
      return {
        ...state,
        categoryManagers: state.categoryManagers.filter(categoryManagers => categoryManagers.id !== action.payload),
      };
    }
    case GET_CATEGORY_MANAGERS: {
      return {
        ...state,
        categoryManagers: action.payload,
      };
    }

    case GET_CATEGORY_MANAGER_PROVEDORES: {
      return {
        ...state,
        currentProveedoresCategoryManager: action.payload,
      };
    }    
    
    case GET_CATEGORY_MANAGER_BY_LOGIN: {
      return {
        ...state,
        currentCategoryManager: action.payload,
      };
    }
    case SET_CATEGORY_MANAGER_DETAILS: {
      return {
        ...state,
        currentCategoryManager: action.payload,
      };
    }
    case SET_CATEGORY_MANAGERS: {
      return {
        ...state,
        categoryManagers: action.payload,
      };
    }
      case SET_PROVEEDORES_CATEGORY_MANAGER: {
        return {
          ...state,
          currentProveedoresCategoryManager: action.payload,
        };      
    }

    default:
      return state;
  }
};
