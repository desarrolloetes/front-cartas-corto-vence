import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/config';
import {
  //ADD_PROVEEDOR,
  DELETE_PROVEEDOR,
  //EDIT_PROVEEDOR,
  GET_PROVEEDORES,
  SET_PROVEEDOR_DETAIL,
  GET_PROVEEDOR_CATEGORY_MANAGERS,
} from '../../@jumbo/constants/ActionTypes';
import React from 'react';
import IntlMessages from '@jumbo/utils/IntlMessages';

export const getProveedores = (empresaCodigo, filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .get(`ccv/proveedores?empresaCodigo=${empresaCodigo}&searchTerm=${searchTerm}&filterOptions=${filterOptions}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_PROVEEDORES, payload: data.data.proveedoresDto});
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="proveedores.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="proveedores.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const getCategoryManagersByProveedorRut = (empresaCodigo, provRut, filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .get(`ccv/proveedores/categoryManagers/${provRut}?empresaCodigo=${empresaCodigo}&searchTerm=${searchTerm}&filterOptions=${filterOptions}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_PROVEEDOR_CATEGORY_MANAGERS, payload: data.data.proveedorCategoryManagersDto});
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="proveedores.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="proveedores.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const setCurrentProveedor = proveedor => {
  return dispatch => {
    dispatch({ type: SET_PROVEEDOR_DETAIL, payload: proveedor });
  };
};

export const addNewProveedor = (proveedor, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .put(`ccv/proveedores?empresaCodigo=${proveedor.provEmpresaId}`, proveedor)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="proveedores.fetch.add.success.message" values = {{code:data.data.id}}/>));
          //dispatch({ type: GET_USERS, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="proveedores.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="proveedores.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const addProveedorCategoryManagers = (empresaCodigo,proveedorCategoryManagers, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .put(`ccv/proveedores/categoryManagers?empresaCodigo=${empresaCodigo}`, JSON.stringify({ proveedorCategoryManagers }))
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          // dispatch({ type: GET_USER_ROLES, payload: [] });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="proveedores.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="proveedores.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};


export const updateProveedor = (proveedorId, proveedor, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .patch(`ccv/proveedores/${proveedorId}?empresaCodigo=${proveedor.provEmpresaId}`, proveedor)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="proveedores.fetch.update.success.message" values = {{code:data.data.id}}/>));
          //dispatch({ type: EDIT_USER, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="proveedores.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="proveedores.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const deleteProveedor = (proveedorId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`ccv/proveedores/${proveedorId}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="proveedores.fetch.delete.success.message" values = {{code:data.data.id}}/>));
          dispatch({ type: DELETE_PROVEEDOR, payload: proveedorId });
          if (callbackFun) callbackFun();
        } else {
          dispatch(fetchError(<IntlMessages id="proveedores.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="aplicacions.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};
