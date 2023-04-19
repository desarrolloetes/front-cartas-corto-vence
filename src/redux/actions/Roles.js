import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/config';
import {
  ADD_ROLE,
  DELETE_ROLE,
  EDIT_ROLE,
  GET_ROLES,
  SET_ROLE_DETAILS,
} from '../../@jumbo/constants/ActionTypes';
import React from 'react';
import IntlMessages from '@jumbo/utils/IntlMessages';

export const getRoles = (empresaCodigo, filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .get(`ccv/roles?empresaCodigo=${empresaCodigo}&searchTerm=${searchTerm}&filterOptions=${filterOptions}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_ROLES, payload: data.data.rolesDto });
          if (callbackFun) callbackFun(data.data.rolesDto);
        } else {
          dispatch(fetchError(<IntlMessages id="roles.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="roles.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const setCurrentRole = role => {
  return dispatch => {
    dispatch({ type: SET_ROLE_DETAILS, payload: role });
  };
};

export const addNewRole = (role, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .put(`ccv/roles?empresaCodigo=${role.rolEmpresaId}`, role)
      .then(data => {
        if (data.data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="roles.fetch.add.success.message" values = {{code:data.data.id}}/>));
          //dispatch({ type: GET_USERS, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="roles.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="roles.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const updateRole = (roleId, role, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .patch(`ccv/roles/${roleId}?empresaCodigo=${role.rolEmpresaId}`, role)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="roles.fetch.update.success.message" values = {{code:data.data.id}}/>));
          //dispatch({ type: EDIT_USER, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="roles.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="roles.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const updateRoleStatus = (data, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put('ccv/roles/update-status', data)
      .then(response => {
        if (response.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="roles.fetch.update.status.success.message" values = {{code:data.data.id}}/>));
          dispatch({ type: EDIT_USER, payload: response.data });
          if (callbackFun) callbackFun(response.data);
        } else {
          dispatch(fetchError(<IntlMessages id="roles.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="roles.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
}; 


export const deleteRole = (roleId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`ccv/roles/${roleId}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="roles.fetch.delete.success.message" values = {{code:data.data.id}}/>));
          dispatch({ type: DELETE_ROLE, payload: roleId });
          if (callbackFun) callbackFun();
        } else {
          dispatch(fetchError(<IntlMessages id="roles.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="roles.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};
