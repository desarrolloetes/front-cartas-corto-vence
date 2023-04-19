import {
  ADD_PROVEEDOR,
  DELETE_BULK_PROVEEDORES,
  DELETE_PROVEEDOR,
  EDIT_PROVEEDOR,
  GET_PROVEEDORES,
  SET_PROVEEDOR_DETAIL,
  GET_PROVEEDOR_CATEGORY_MANAGERS,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  proveedores: [],
  currentProveedorCategoryManagers: [],
  currentProveedor: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PROVEEDORES: {
      return {
        ...state,
        proveedores: action.payload,
      };
    }
    case GET_PROVEEDOR_CATEGORY_MANAGERS: {
      return {
        ...state,
        currentProveedorCategoryManagers: action.payload,
      };
    }   
   
    case SET_PROVEEDOR_DETAIL: {
      return {
        ...state,
        currentProveedor: action.payload,
      };
    }
    case ADD_PROVEEDOR: {
      return {
        ...state,
        proveedores: [action.payload, ...state.proveedores],
      };
    }
    case EDIT_PROVEEDOR: {
      return {
        ...state,
        proveedores: state.proveedores.map(proveedor => (proveedor.provId === action.payload.id ? action.payload : proveedor)),
      };
    }
    case DELETE_PROVEEDOR: {
      return {
        ...state,
        proveedores: state.proveedores.filter(proveedor => proveedor.provId !== action.payload),
      };
    }
    case DELETE_BULK_PROVEEDORES: {
      return {
        ...state,
        proveedores: state.proveedores.filter(proveedor => !action.payload.includes(proveedor.provId)),
      };
    }

    default:
      return state;
  }
};
