import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/config';
import { GET_ORDENES_COMPRA_BY_RUT_PROVEEDOR, GET_PRODUCTOS_ORDEN_COMPRA_BY_RUT_PROVEEDOR, SET_PRODUCTOS_ORDEN_COMPRA, DELETE_PRODUCTO_ORDEN_COMPRA, DELETE_BULK_PRODUCTOS_ORDEN_COMPRA } from '../../@jumbo/constants/ActionTypes';
import React from 'react';
import IntlMessages from '@jumbo/utils/IntlMessages';

export const getOrdenesCompraByRutProveedor = (empresaCodigo,rutProveedor, filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get(`/ccv/oc/proveedor/${rutProveedor}?empresaCodigo=${empresaCodigo}&searchTerm=${searchTerm}&filterOptions=${filterOptions}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_ORDENES_COMPRA_BY_RUT_PROVEEDOR, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="cartas.fetch.ordenesCompra.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="cartas.fetch.ordenesCompra.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const getProductosOrdenCompraByRutProveedor = (empresaCodigo,numeroOrdenCompra, rutProveedor,filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get(`/ccv/oc/productos/ordenCompra/${numeroOrdenCompra}/proveedor/${rutProveedor}?empresaCodigo=${empresaCodigo}&searchTerm=${searchTerm}&filterOptions=${filterOptions}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_PRODUCTOS_ORDEN_COMPRA_BY_RUT_PROVEEDOR, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="cartas.fetch.ordenesCompra.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="cartas.fetch.ordenesCompra.error.message" values = {{code:error.message}}/>));
      });
  };
};


export const setProductosOrdenCompra = productosOrdenCompra => {
  return dispatch => {
    dispatch({ type: SET_PRODUCTOS_ORDEN_COMPRA, payload: productosOrdenCompra });
  };
};


export const deleteProductoOrdenCompra = productoOrdenCompra => {
  return dispatch => {
    dispatch({ type: DELETE_PRODUCTO_ORDEN_COMPRA, payload: productoOrdenCompra });
  };
};

export const deleteBulkProductoOrdenCompra = productosOrdenCompra => {
  return dispatch => {
    dispatch({ type: DELETE_BULK_PRODUCTOS_ORDEN_COMPRA, payload: productosOrdenCompra });
  };
};
