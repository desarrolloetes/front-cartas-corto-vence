import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/config';
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
import React from 'react';
import IntlMessages from '@jumbo/utils/IntlMessages';

export const getCategoryManagersByEmpresa = (empresaCodigo = 1,rutProveedor, filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    //const token = localStorage.getItem('token') || '';
    //axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .get(`/ccv/categoryManager/proveedor/${rutProveedor}/?empresaCodigo=${empresaCodigo}&searchTerm=${searchTerm}&filterOptions=${filterOptions}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_CATEGORY_MANAGERS, payload: data.data.categoryManagersDto });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="fetch.categoryManagers.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="fetch.categoryManagers.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const getAllCategoryManagers = (empresaCodigo = 1,filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get(`/ccv/categoryManager?empresaCodigo=${empresaCodigo}&searchTerm=${searchTerm}&filterOptions=${filterOptions}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_CATEGORY_MANAGERS, payload: data.data.categoryManagersDto });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="fetch.categoryManagers.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="fetch.categoryManagers.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const getCategoryByLogin = (empresaCodigo, login, filterOptions = [], searchTerm = null, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get(`/ccv/categoryManager/${login}?empresaCodigo=${empresaCodigo}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_CATEGORY_MANAGER_BY_LOGIN, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="cartas.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="cartas.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const getProveedoresByCategoryManagerId = (empresaCodigo, catId, filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .get(`ccv/categoryManager/proveedores/${catId}?empresaCodigo=${empresaCodigo}&searchTerm=${searchTerm}&filterOptions=${filterOptions}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_CATEGORY_MANAGER_PROVEDORES, payload: data.data.proveedorCategoryManagersDto});
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

export const setCurrentCategoryManager = categoryManager => {
  return dispatch => {
    dispatch({ type: SET_CATEGORY_MANAGER_DETAILS, payload: categoryManager });
  };
};

export const setCategoryManagers = categoryManagers => {
  return dispatch => {
    dispatch({ type: SET_CATEGORY_MANAGERS, payload: categoryManagers });
  };
};

export const setCurrentProveedoresCategoryManager = proveedoresCategoryManager => {
  return dispatch => {
    dispatch({ type: SET_PROVEEDORES_CATEGORY_MANAGER, payload: proveedoresCategoryManager });
  };
};


export const addNewCategoryManager = (categoryManager, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .post('v1/categoryManagers/create', category)
      .then(data => {
        if (data.status === 201) {
          dispatch(fetchSuccess(<IntlMessages id="fetch.categoryManagers.add.success.message" values = {{code:data.data.message}}/>));
          //dispatch({ type: GET_CATEGORY_MANAGERS, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="fetch.categoryManagers.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="fetch.categoryManagers.error.message" values = {{code:error.message}}/>));
      });
  };
};


export const updateCategoryManager = (categoryManagerId, categoryManager, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .patch(`v1/categoryManagers/update?categoryManagerId=${categoryManagerId}`, categoryManager)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="fetch.categoryManagers.update.success.message" values = {{code:data.data.message}}/>));
          //dispatch({ type: EDIT_CATEGORY_MANAGER, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="fetch.categoryManagers.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="fetch.categoryManagers.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const deleteCategoryManager = (categoryManagerId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`v1/categoryManagers/delete?categoryManagerId=${categoryId}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="fetch.categoryManagers.delete.success.message" values = {{code:data.data.message}}/>));
          dispatch({ type: DELETE_CATEGORY_MANAGER, payload: CategoryId });
          if (callbackFun) callbackFun();
        } else {
          dispatch(fetchError(<IntlMessages id="fetch.categoryManagers.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="fetch.categoryManagers.error.message" values = {{code:error.message}}/>));
      });
  };
};
