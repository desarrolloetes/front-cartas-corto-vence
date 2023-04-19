import { GET_ORDENES_COMPRA_BY_RUT_PROVEEDOR, GET_PRODUCTOS_ORDEN_COMPRA_BY_RUT_PROVEEDOR, SET_PRODUCTOS_ORDEN_COMPRA, DELETE_PRODUCTO_ORDEN_COMPRA,DELETE_BULK_PRODUCTOS_ORDEN_COMPRA  } from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  ordenesCompra: [],
  productosOrdenCompra: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ORDENES_COMPRA_BY_RUT_PROVEEDOR: {
      return {
        ...state,
        ordenesCompra: action.payload,
      };
    }

    case GET_PRODUCTOS_ORDEN_COMPRA_BY_RUT_PROVEEDOR: {
      return {
        ...state,
        productosOrdenCompra: action.payload,
      };
    }

    case SET_PRODUCTOS_ORDEN_COMPRA: {
      return {
        ...state,
        productosOrdenCompra: action.payload,
      };
    }    
    case DELETE_PRODUCTO_ORDEN_COMPRA: {
      return {
        ...state,
        productosOrdenCompra: state.productosOrdenCompra.filter(productosOrdenCompra => productosOrdenCompra.codigoProducto !== action.payload),
      };
    }

    case DELETE_BULK_PRODUCTOS_ORDEN_COMPRA: {
      return {
        ...state,
        productosOrdenCompra: state.productosOrdenCompra.filter(productosOrdenCompra => !action.payload.includes(productosOrdenCompra.codigoProducto)),
      };
    }

    default:
      return state;
  }
};
