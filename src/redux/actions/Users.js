import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/config';
import {
  //ADD_USER,
  DELETE_USER,
  EDIT_USER,
  GET_USERS,
  SET_USER_DETAILS,
  GET_USER_ROLES,
  GET_USER_APPLICATIONS,
} from '../../@jumbo/constants/ActionTypes';
import React from 'react';
import IntlMessages from '@jumbo/utils/IntlMessages';

export const getUsers = (empresaCodigo, filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .get(`ccv/usuarios?empresaCodigo=${empresaCodigo}&searchTerm=${searchTerm}&filterOptions=${filterOptions}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_USERS, payload: data.data.usuariosDto });
          if (callbackFun) callbackFun(data.data.usuariosDto);
        } else {
          dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const setCurrentUser = user => {
  return dispatch => {
    dispatch({ type: SET_USER_DETAILS, payload: user });
  };
};

export const setCurrentUserRoles = userRoles => {
  return dispatch => {
    dispatch({ type: GET_USER_ROLES, payload: userRoles });
  };
};

export const setCurrentUserApplications = userApplications => {
  return dispatch => {
    dispatch({ type: GET_USER_APPLICATIONS, payload: userApplications });
  };
};


export const addNewUser = (user, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .put(`ccv/usuarios?empresaCodigo=${user.empresaId}`, user)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="user.fetch.add.success.message" />));
          //dispatch({ type: GET_USERS, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const sentMailToUser = () => {
  return dispatch => {
    dispatch(fetchSuccess('Email has been sent to user successfully'));
  };
};

export const updateUser = (userId, user, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .patch(`ccv/usuarios/${userId}?empresaCodigo=${user.empresaId}`, user)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="user.fetch.update.success.message" />));
          //dispatch({ type: EDIT_USER, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const deleteUser = (userId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`ccv/usuarios/${userId}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="user.fetch.delete.success.message" />));
          dispatch({ type: DELETE_USER, payload: userId });
          if (callbackFun) callbackFun();
        } else {
          dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const getUserRoles = (empresaCodigo, userLogin, filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .get(`ccv/roles/usuario/${userLogin}?empresaCodigo=${empresaCodigo}&searchTerm=${searchTerm}&filterOptions=${filterOptions}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_USER_ROLES, payload: data.data.usuarioRolesDto });
          if (callbackFun) callbackFun(data.data.usuarioRolesDto);
        } else {
          dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const getUserApplications = (empresaCodigo,userLogin, filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .get(`ccv/aplicaciones/usuario/${userLogin}?empresaCodigo=${empresaCodigo}`, {
        params: { filterOptions, searchTerm },
      })
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({
            type: GET_USER_APPLICATIONS,
            payload: data.data.usuarioRolesAplicacionesDto,
          });
          if (callbackFun) callbackFun(data.data.usuarioRolesAplicacionesDto);
        } else {
          dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const addUserRoles = (empresaCodigo,usuarioRoles, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .put(`ccv/roles/usuario?empresaCodigo=${empresaCodigo}`, JSON.stringify({ usuarioRoles }))
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          // dispatch({ type: GET_USER_ROLES, payload: [] });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const addUserApplications = (userPurchaseAreas, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .put(`v1/userPurchaseAreas/createUserPurchaseAreas`, JSON.stringify({ userPurchaseAreas }))
      .then(data => {
        if (data.status === 201) {
          dispatch(fetchSuccess());
          // dispatch({ type: GET_USER_ROLES, payload: [] });
          if (callbackFun) callbackFun(data.data.userPurchaseAreas);
        } else {
          dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="user.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

