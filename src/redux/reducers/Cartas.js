import {
  ADD_CARTA,
  EDIT_CARTA,
  DELETE_CARTA,
  GET_CARTAS,
  GET_PRODUCTOS_CARTA,
  SET_CARTA_DETAILS,
 } from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  cartas: [],
  currentCarta: null,
  productosCarta: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_CARTA: {
      return {
        ...state,
        cartas: [action.payload, ...state.cartas],
      };
    }
    case EDIT_CARTA: {
      return {
        ...state,
        cartas: state.cartas.map(carta => (carta.id === action.payload.id ? action.payload : carta)),
      };
    }
    case DELETE_CARTA: {
      return {
        ...state,
        cartas: state.cartas.filter(carta => carta.id !== action.payload),
      };
    }
    case GET_CARTAS: {
      return {
        ...state,
        cartas: action.payload,
      };
    }   
    case GET_PRODUCTOS_CARTA: {
      return {
        ...state,
        productosCarta: action.payload,
      };
    }        
     case SET_CARTA_DETAILS: {
       return {
         ...state,
         currentCarta: action.payload,
       };
   }    

    default:
      return state;
  }
};
