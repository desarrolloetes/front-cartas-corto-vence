import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/config';
import {
  ADD_FILE_CCV,
  GET_FILES_CCV,
  SET_FILE_CCV,
  DELETE_FILE_CCV,
} from '../../@jumbo/constants/ActionTypes';
import React from 'react';
import IntlMessages from '@jumbo/utils/IntlMessages';

export const getFiles = (filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get('ccv/getFiles', { params: { filterOptions, searchTerm } })
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_FILES_CCV, payload: data.data.files });
          if (callbackFun) callbackFun(data.data.files);
        } else {
          dispatch(fetchError(<IntlMessages id="files.fetch.error.message" />));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="files.fetch.error.message" />));
      });
  };
};

export const setCurrentFile = file => {
  return dispatch => {
    dispatch({ type: SET_FILE_CCV, payload: file });
  };
};

export const uploadFile = (file, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .post('https://httpbin.org/post', file, 
    )
      .then(data => {
        if (data.status === 201) {
          dispatch(fetchSuccess(<IntlMessages id="files.fetch.add.success.message" />));
          //dispatch({ type: GET_FILES, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError(<IntlMessages id="files.fetch.error.message" />));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="files.fetch.error.message" />));
      });
  };
};

export const deleteFile = (ccvId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`ccv/delete?ccvId=${ccvId}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="files.fetch.delete.success.message" />));
          dispatch({ type: DELETE_FILE_CCV, payload: ccvId });
          if (callbackFun) callbackFun();
        } else {
          dispatch(fetchError(<IntlMessages id="files.fetch.error.message" />));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="files.fetch.error.message" />));
      });
  };
};
