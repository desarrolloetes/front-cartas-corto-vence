import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import GridContainer from '../../../../@jumbo/components/GridContainer';
import Grid from '@material-ui/core/Grid';
import AppTextInput from '../../../../@jumbo/components/Common/formElements/AppTextInput';
import CmtAvatar from '../../../../@coremat/CmtAvatar';
import { useDropzone } from 'react-dropzone';
import Button from '@material-ui/core/Button';
import AppSelectBox from '../../../../@jumbo/components/Common/formElements/AppSelectBox';
import IntlMessages from '../../../../@jumbo/utils/IntlMessages';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { addNewProveedor, updateProveedor } from '../../../../redux/actions/Proveedores';
import { getEmpresas } from '../../../../redux/actions/Empresas';
import { useDebounce } from '../../../../@jumbo/utils/commonHelper';
import { validate, getCheckDigit, clean } from '../../../../@jumbo/utils/rutValidador';

import { Box } from '@material-ui/core';
import { split } from 'lodash';

const useStyles = makeStyles(theme => ({
  dialogRoot: {
    position: 'relative',
  },
  dialogTitleRoot: {
    '& .MuiTypography-h6': {
      fontSize: 16,
      color: theme.palette.common.dark,
    },
  },
}));

const monedasLabels = [
  { title: 'CLP', slug: 'CLP' },
  { title: 'USD', slug: 'USD' },
];


const AddEditProveedor = ({ open, onCloseDialog }) => {
  const classes = useStyles();
  const currentProveedor = useSelector(({ proveedoresReducer }) => proveedoresReducer.currentProveedor);

  const [provProveedor, setProvProveedor] = useState('');
  const [provRut, setProvRut] = useState('');
  const [provDV, setProvDV] = useState('');
  const [provCodigoSB, setProvCodigoSB] = useState('');
  const [provDescripcionSB, setProvDescripcionSB] = useState('');
  const [provCodigoPU, setProvCodigoPU] = useState('');
  const [provDescripcionPU, setProvDescripcionPU] = useState('');
  const [provMonedaSelected, setProvMonedaSelected] = useState('');


  const [provProveedorError, setProvProveedorError] = useState('');
  const [provRutError, setProvRutError] = useState('');
  const [provRutValidoError, setProvRutValidoError] = useState('');
  const [provDVError, setProvDVError] = useState('');
  const [provCodigoSBError, setProvCodigoSBError] = useState('');
  const [provDescripcionSBError, setProvDescripcionSBError] = useState('');
  const [provCodigoPUError, setProvCodigoPUError] = useState('');
  const [provDescripcionPUError, setProvDescripcionPUError] = useState('');
  const [provMonedaSelectedError, setProvMonedaSelectedError] = useState('');

  const [profile_pic, setProfile_pic] = useState('');

  // empresa
  const { empresas } = useSelector(({ empresasReducer }) => empresasReducer);
  const [empresasFetched, setEmpresasFetched] = useState(true);
  const [selectedEmpresaError, setSelectedEmpresaError] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const [searchEmpresaTerm, setSearchEmpresaTerm] = useState('');
  const debouncedSearchEmpresaTerm = useDebounce(searchEmpresaTerm, 500);

  const [filterOptions, setFilterOptions] = React.useState([]);


  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setProfile_pic(URL.createObjectURL(acceptedFiles[0]));
    },
  });

  //************************Inicio useEffect************************************* */
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getEmpresas(filterOptions, debouncedSearchEmpresaTerm, () => {
        //setFilterApplied(!!filterOptions.length || !!debouncedSearchEmpresaTerm);
        setEmpresasFetched(true);
      }),
    );
  }, []);

  useEffect(() => {
    if (currentProveedor) {
      //setProvId(currentProveedor.provId);
      setSelectedEmpresa(currentProveedor.empresa.empresaCodigo);
      setProvRut(currentProveedor.provRut + '-' + currentProveedor.provDV);
      setProvProveedor(currentProveedor.provProveedor);
      setProvCodigoSB(currentProveedor.provCodigoSB);
      setProvDescripcionSB(currentProveedor.provDescripcionSB);
      setProvCodigoPU(currentProveedor.provCodigoPU);
      setProvDescripcionPU(currentProveedor.provDescripcionPU);
      setProvMonedaSelected(currentProveedor.provMoneda);
    }
  }, [currentProveedor]);


  //************************Fin useEffect************************************* */


  const onProveedorMonedasChange = value => {
    setProvMonedaSelected(value);
  };


  const onSubmitClick = () => {

    let createOrUpdate = true;
    if (!selectedEmpresa) {
      setSelectedEmpresaError(<IntlMessages id="proveedores.appModule.requiredMessage" />);
      createOrUpdate = false;
    }
    if (!provRut) {
      setProvRutError(<IntlMessages id="proveedores.appModule.requiredMessage" />);
      createOrUpdate = false;
    } else {
      //validar rut react
      if (!validate(provRut)) {
        setProvRutError(<IntlMessages id="proveedores.appModule.rutValidoMessage" />);
        createOrUpdate = false;

      }
    }
    if (!provProveedor) {
      setProvProveedorError(<IntlMessages id="proveedores.appModule.requiredMessage" />);
      createOrUpdate = false;
    }
    if (!provCodigoSB) {
      setProvCodigoSBError(<IntlMessages id="proveedores.appModule.requiredMessage" />);
      createOrUpdate = false;
    }
    if (!provDescripcionSB) {
      setProvDescripcionSBError(<IntlMessages id="proveedores.appModule.requiredMessage" />);
      createOrUpdate = false;
    }

    if (!provCodigoPU) {
      setProvCodigoPUError(<IntlMessages id="proveedores.appModule.requiredMessage" />);
      createOrUpdate = false;
    }
    if (!provDescripcionPU) {
      setProvDescripcionPUError(<IntlMessages id="proveedores.appModule.requiredMessage" />);
      createOrUpdate = false;
    }

    if (!provMonedaSelected) {
      setProvMonedaSelectedError(<IntlMessages id="proveedores.appModule.requiredMessage" />);
      createOrUpdate = false;
    }


    if (createOrUpdate) {
      onProveedorSave();
    }
  };

  const onProveedorSave = () => {

    let rutArray = provRut.split('-', clean(provRut));
    let rut = rutArray[0];
    let dv = rutArray[1];
    const proveedorDetail = {
      //'provId'           :provId         ,
      'provEmpresaId': selectedEmpresa,
      'provRut': rut,
      'provCodigoSB': provCodigoSB,
      'provCodigoPU': provCodigoPU,
      'provDescripcionSB': provDescripcionSB,
      'provDescripcionPU': provDescripcionPU,
      'provDV': dv,
      'provProveedor': provProveedor,
      'provMoneda': provMonedaSelected,

    };

    if (currentProveedor) {
      const proveedorUpdate = {
        //'provId'           :provId         ,
        'provEmpresaId': proveedorDetail.provEmpresaId,
        'provRut': proveedorDetail.provRut,
        'provCodigoSB': proveedorDetail.provCodigoSB,
        'provCodigoPU': proveedorDetail.provCodigoPU,
        'provDescripcionSB': proveedorDetail.provDescripcionSB,
        'provDescripcionPU': proveedorDetail.provDescripcionPU,
        'provDV': proveedorDetail.provDV,
        'provProveedor': proveedorDetail.provProveedor,
        'provMoneda': proveedorDetail.provMoneda,
      };

      const provIdUpdate = currentProveedor.provId;
      dispatch(
        updateProveedor(provIdUpdate, proveedorUpdate, () => {
          onCloseDialog();
        }),
      );
    } else {
      dispatch(
        addNewProveedor(proveedorDetail, () => {
          onCloseDialog();
        }),
      );
    }
  };

  // const isPhonesMultiple = phones.length > 1;

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <DialogTitle className={classes.dialogTitleRoot}>
        {currentProveedor ? (
          <IntlMessages id="proveedores.editCreate.form.editTitle" values={{ code: currentProveedor.provId }} />
        ) : (
          <IntlMessages id="proveedores.editCreate.form.createTitle" />
        )}
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" mb={{ xs: 6, md: 5 }}>

          <GridContainer>
            <Grid item xs={12} sm={6}>
              <AppSelectBox
                fullWidth
                data={empresas}
                label={<IntlMessages id="proveedores.editCreate.label.provEmpresaHeader" />}
                valueKey="empresaCodigo"
                variant="outlined"
                labelKey="empresaNombre"
                value={selectedEmpresa}
                onChange={e => {
                  setSelectedEmpresa(e.target.value);
                  setSelectedEmpresaError('');
                }}
                helperText={selectedEmpresaError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label={<IntlMessages id="proveedores.editCreate.label.provRutHeader" />}
                value={provRut}
                onChange={e => {
                  setProvRut(e.target.value);
                  setProvRutError('');
                  setProvRutValidoError('');
                }}
                helperText={provRutError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label={<IntlMessages id="proveedores.editCreate.label.provProveedorHeader" />}
                value={provProveedor}
                onChange={e => {
                  setProvProveedor(e.target.value);
                  setProvProveedorError('');
                }}
                helperText={provProveedorError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label={<IntlMessages id="proveedores.editCreate.label.provCodigoSBHeader" />}
                value={provCodigoSB}
                onChange={e => {
                  setProvCodigoSB(e.target.value);
                  setProvCodigoSBError('');
                }}
                helperText={provCodigoSBError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label={<IntlMessages id="proveedores.editCreate.label.provDescripcionSBHeader" />}
                value={provDescripcionSB}
                onChange={e => {
                  setProvDescripcionSB(e.target.value);
                  setProvDescripcionSBError('');
                }}
                helperText={provDescripcionSBError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label={<IntlMessages id="proveedores.editCreate.label.provCodigoPUHeader" />}
                value={provCodigoPU}
                onChange={e => {
                  setProvCodigoPU(e.target.value);
                  setProvCodigoPUError('');
                }}
                helperText={provCodigoPUError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label={<IntlMessages id="proveedores.editCreate.label.provDescripcionPUHeader" />}
                value={provDescripcionPU}
                onChange={e => {
                  setProvDescripcionPU(e.target.value);
                  setProvDescripcionPUError('');
                }}
                helperText={provDescripcionPUError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppSelectBox
                fullWidth
                data={monedasLabels}
                label={<IntlMessages id="proveedores.editCreate.label.provMonedaHeader" />}
                valueKey="slug"
                variant="outlined"
                labelKey="title"
                value={provMonedaSelected}
                onChange={e => {
                  onProveedorMonedasChange(e.target.value);
                  setProvMonedaSelectedError('');
                }}
                helperText={provMonedaSelectedError}
              />
            </Grid>
          </GridContainer>
        </Box>
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <Button onClick={onCloseDialog}>Cancel</Button>
          <Box ml={2}>
            <Button variant="contained" color="primary" onClick={onSubmitClick}>
              Save
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditProveedor;

AddEditProveedor.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
