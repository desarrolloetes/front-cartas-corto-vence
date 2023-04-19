import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/config';
import {
  GET_EMPRESAS
} from '../../@jumbo/constants/ActionTypes';
import React from 'react';
import IntlMessages from '@jumbo/utils/IntlMessages';

export const getEmpresas = (filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const token = localStorage.getItem('token') || '';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .get(`ccv/empresas?searchTerm=${searchTerm}&filterOptions=${filterOptions}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_EMPRESAS, payload: data.data.empresasDto});
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="empresas.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="empresas.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};
