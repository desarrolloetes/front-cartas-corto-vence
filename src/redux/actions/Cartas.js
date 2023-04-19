import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/config';
import {
  ADD_CARTA,
  EDIT_CARTA,
  DELETE_CARTA,  
  GET_CARTAS,
  GET_PRODUCTOS_CARTA,
  SET_CARTA_DETAILS,
  //DELETE_BULK_CARTAS,
} from '../../@jumbo/constants/ActionTypes';
import React from 'react';
import IntlMessages from '@jumbo/utils/IntlMessages';


export const getCartas = (empresaCodigo=1,rutProveedor, filterOptions = [], searchTerm = '',login = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get(`ccv/carta/proveedor/${rutProveedor}?empresaCodigo=${empresaCodigo}&searchTerm=${searchTerm}&filterOptions=${filterOptions}&login=${login}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_CARTAS, payload: data.data });
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

export const getCartasByCategoryManager = (empresaCodigo = 1,login = null, filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get(`ccv/carta/categoryManager/${login}?empresaCodigo=${empresaCodigo}&searchTerm=${searchTerm}&filterOptions=${filterOptions}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_CARTAS, payload: data.data });
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

export const getProductosByCarta = (empresaCodigo = 1, ccvId, filterOptions = [], searchTerm = null, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get(`/ccv/carta/productos/ccv/${ccvId}?empresaCodigo=${empresaCodigo}&searchTerm=${searchTerm}&filterOptions=${filterOptions}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_PRODUCTOS_CARTA, payload: data.data });
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

export const setCurrentCarta = carta => {
  return dispatch => {
    dispatch({ type: SET_CARTA_DETAILS, payload: carta });
  };
};

export const addNewCarta = (carta, file, callbackFun) => {
  let formData = new FormData();
  formData.append("file", file);

  formData.append('cartaDTO',
  new Blob([JSON.stringify(carta)], { 
    type: 'application/json'
  }));  
  return dispatch => {
    dispatch(fetchStart());
    axios
      .post('ccv/carta', formData
        ,
       {
        headers: {
        "Content-Type": "multipart/form-data",
      }}   
      )
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="cartas.fetch.add.success.message" values = {{code:data.data.message}} />));
          //dispatch({ type: GET_CARTAS, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          //console.log('status no es 200');
          dispatch(fetchError(<IntlMessages id="cartas.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="cartas.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};


export const validarCarta = (cartaId, carta, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put(`ccv/carta/validar/${cartaId}`,  carta )
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="cartas.fetch.validar.success.message" values = {{code:data.data.message}} />));
          //dispatch({ type: EDIT_CARTA, payload: data.data });
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


export const updateCarta = (cartaId, carta, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .patch(`v1/cartas/update?cartaId=${cartaId}`, carta)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="cartas.fetch.update.success.message" values = {{code:data.data.message}} />));
          //dispatch({ type: EDIT_CARTA, payload: data.data });
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

export const updateCartaStatus = (data, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put('/cartas/update-status', data)
      .then(response => {
        if (response.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="cartas.fetch.update.statusSuccess.message" values = {{code:data.data.message}}/>));
          dispatch({ type: EDIT_CARTA, payload: response.data });
          if (callbackFun) callbackFun(response.data);
        } else {
          dispatch(fetchError(<IntlMessages id="cartas.fetch.error.message" values = {{code:data.data.message}} />));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="cartas.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
}; 

export const deleteCarta = (cartaId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`ccv/carta/${cartaId}`)
      .then(data => {
        if (data.data.status === 200) {
          dispatch(fetchSuccess(<IntlMessages id="cartas.fetch.delete.success.message" values = {{code:data.data.message}}/>));
          dispatch({ type: DELETE_CARTA, payload: cartaId });
          if (callbackFun) callbackFun();
        } else {
          dispatch(fetchError(<IntlMessages id="cartas.fetch.error.message" values = {{code:data.data.message}}/>));
        }
      })
      .catch(error => {
        dispatch(fetchError(<IntlMessages id="cartas.fetch.error.message" values = {{code:error.message}}/>));
      });
  };
};
