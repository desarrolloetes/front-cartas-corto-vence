import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/config';
import {
  ADD_APLICACION,
  DELETE_APLICACION,
  EDIT_APLICACION,
  GET_APLICACIONES,
  SET_APLICACION_DETAIL,
  GET_APLICACIONES_PADRE,
  GET_ROL_APLICACIONES,
} from '../../@jumbo/constants/ActionTypes';
import React from 'react';
import IntlMessages from '@jumbo/utils/IntlMessages';

export const getAplicaciones = (empresaCodigo, filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .get(`ccv/aplicaciones?empresaCodigo=${empresaCodigo}&searchTerm=${searchTerm}&filterOptions=${filterOptions}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_APLICACIONES, payload: data.data.aplicacionesDto});
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="aplicaciones.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="aplicaciones.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const getAplicacionesByRol = (empresaCodigo, rolId, filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .get(`ccv/aplicaciones/rol/${rolId}?empresaCodigo=${empresaCodigo}&searchTerm=${searchTerm}&filterOptions=${filterOptions}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_ROL_APLICACIONES, payload: data.data.rolAplicacionesDto});
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="aplicaciones.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="aplicaciones.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const getAplicacionesPadre = (empresaCodigo, filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .get(`ccv/aplicacionesPadre?empresaCodigo=${empresaCodigo}&searchTerm=&filterOptions=`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_APLICACIONES_PADRE, payload: data.data.aplicacionesPadreDto});
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="aplicaciones.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="aplicaciones.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const setCurrentAplicacion = aplicacion => {
  return dispatch => {
    dispatch({ type: SET_APLICACION_DETAIL, payload: aplicacion });
  };
};

export const addNewAplicacion = (aplicacion, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .put(`ccv/aplicaciones?empresaCodigo=${aplicacion.appEmpresaId}`, aplicacion)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="aplicaciones.fetch.add.success.message" values = {{code:data.data.id}}/>));
          //dispatch({ type: GET_USERS, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="aplicaciones.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="aplicaciones.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const addRolAplicaciones = (empresaCodigo,rolAplicaciones, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .put(`ccv/aplicaciones/rol?empresaCodigo=${empresaCodigo}`, JSON.stringify({ rolAplicaciones }))
      .then(data => {
        //console.log(data.status);
        if (data.status === 200) {
          dispatch(fetchSuccess());
          // dispatch({ type: GET_USER_ROLES, payload: [] });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="aplicaciones.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="aplicaciones.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};

export const updateAplicacion = (aplicacionId, aplicacion, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .patch(`ccv/aplicaciones/${aplicacionId}?empresaCodigo=${aplicacion.appEmpresaId}`, aplicacion)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="aplicaciones.fetch.update.success.message" values = {{code:data.data.id}}/>));
          //dispatch({ type: EDIT_USER, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="aplicaciones.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="aplicaciones.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};


export const deleteAplicacion = (aplicacionId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`ccv/aplicaciones/${aplicacionId}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="aplicaciones.fetch.delete.success.message" values = {{code:data.data.id}}/>));
          dispatch({ type: DELETE_APLICACION, payload: aplicacionId });
          if (callbackFun) callbackFun();
        } else {
          dispatch(fetchError(<IntlMessages id="aplicaciones.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="aplicacions.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};
