import {
  ADD_APLICACION,
  DELETE_BULK_APLICACIONES,
  DELETE_APLICACION,
  EDIT_APLICACION,
  GET_APLICACIONES,
  SET_APLICACION_DETAIL,
  GET_APLICACIONES_PADRE,
  GET_ROL_APLICACIONES,  
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  aplicaciones: [],
  currentRolAplicaciones: [],
  aplicacionesPadre: [],
  currentAplicacion: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_APLICACIONES: {
      return {
        ...state,
        aplicaciones: action.payload,
      };
    }
    case GET_APLICACIONES_PADRE: {
      return {
        ...state,
        aplicacionesPadre: action.payload,
      };
    }    

    case GET_ROL_APLICACIONES: {
      return {
        ...state,
        currentRolAplicaciones: action.payload,
      };
    }       
    case SET_APLICACION_DETAIL: {
      return {
        ...state,
        currentAplicacion: action.payload,
      };
    }
    case ADD_APLICACION: {
      return {
        ...state,
        aplicaciones: [action.payload, ...state.aplicaciones],
      };
    }
    case EDIT_APLICACION: {
      return {
        ...state,
        aplicaciones: state.aplicaciones.map(aplicacion => (aplicacion.id === action.payload.id ? action.payload : aplicacion)),
      };
    }
    case DELETE_APLICACION: {
      return {
        ...state,
        aplicaciones: state.aplicaciones.filter(aplicacion => aplicacion.id !== action.payload),
      };
    }
    case DELETE_BULK_APLICACIONES: {
      return {
        ...state,
        aplicaciones: state.aplicaciones.filter(aplicacion => !action.payload.includes(aplicacion.id)),
      };
    }

    default:
      return state;
  }
};
