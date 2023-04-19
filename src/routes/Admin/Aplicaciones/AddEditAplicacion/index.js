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
import { addNewAplicacion, updateAplicacion, getAplicacionesPadre } from '../../../../redux/actions/Aplicaciones';
import { getEmpresas } from '../../../../redux/actions/Empresas';
import { useDebounce } from '../../../../@jumbo/utils/commonHelper';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Paper, Card, CardHeader, CardContent } from '@material-ui/core';

import { Box, TextField } from '@material-ui/core';

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

const statusLabels = [
  { title: 'Activo', slug: 'S' },
  { title: 'Inactivo', slug: 'N' },
];

const AddEditAplicacion = ({ open, onCloseDialog }) => {
  const classes = useStyles();
  const currentAplicacion = useSelector(({ aplicacionesReducer }) => aplicacionesReducer.currentAplicacion);
  const [empresaNombre, setEmpresaNombre] = useState('');
  const [apaNombre, setApaNombre] = useState('');
  if (currentAplicacion) {
    // setEmpresaNombre(currentAplicacion.empresa);
    //  setApaNombre(currentAplicacion.aplicacionPadre);
  }

  const [profile_pic, setProfile_pic] = useState('');

  //aplicacion empresa
  const { empresas } = useSelector(({ empresasReducer }) => empresasReducer);
  const [empresasFetched, setEmpresasFetched] = useState(true);
  const [empresaText, setEmpresaText] = useState('');
  const [empresaError, setEmpresaError] = useState('');
  const [selectedEmpresaError, setSelectedEmpresaError] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const debouncedSearchEmpresaTerm = useDebounce(searchEmpresaTerm, 500);
  const [searchEmpresaTerm, setSearchEmpresaTerm] = useState('');


  //aplicacion padre
  const { aplicacionesPadre } = useSelector(({ aplicacionesReducer }) => aplicacionesReducer);
  const [aplicacionesPadreFetched, setAplicacionesPadreFetched] = useState(true);
  const [aplicacionPadreText, setAplicacionPadreText] = useState('');
  const [aplicacionPadreError, setAplicacionPadreError] = useState('');
  const [selectedAplicacionPadreError, setSelectedAplicacionPadreError] = useState('');
  const [selectedAplicacionPadre, setSelectedAplicacionPadre] = useState('');
  const debouncedSearchAplicacionPadreTerm = useDebounce(searchAplicacionPadreTerm, 500);
  const [searchAplicacionPadreTerm, setSearchAplicacionPadreTerm] = useState('');


  //aplicacion nombre
  const [aplicacionNombre, setAplicacionNombre] = useState('');
  const [aplicacionNombreError, setAplicacionNombreError] = useState('');

  //aplicacion texto ayuda
  const [aplicacionTextoAyuda, setAplicacionTextoAyuda] = useState('');
  const [aplicacionTextoAyudaError, setAplicacionTextoAyudaError] = useState('');

  //aplicacion url
  const [aplicacionUrl, setAplicacionUrl] = useState('');
  const [aplicacionUrlError, setAplicacionUrlError] = useState('');

  //aplicacion status
  const [aplicacionStatus, setAplicacionStatus] = useState('');
  const [aplicacionStatusError, setAplicacionStatusError] = useState('');

  const [filterOptions, setFilterOptions] = React.useState([]);


  //************************Inicio useEffect************************************* */
  useEffect(() => {
    dispatch(
      getEmpresas(filterOptions, debouncedSearchEmpresaTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchEmpresaTerm);
        setEmpresasFetched(true);
      }),
    );
  }, []);

  useEffect(() => {
    dispatch(
      getAplicacionesPadre('', '', () => {
        //setFilterApplied(!!filterOptions.length || !!searchAplicacionPadreTerm);
        setAplicacionesPadreFetched(true);
      }),
    );
  }, []);

  //************************Fin useEffect************************************* */

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setProfile_pic(URL.createObjectURL(acceptedFiles[0]));
    },
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentAplicacion) {
      //console.log({ currentAplicacion });
      //setAppId(currentAplicacion.id);
      setSelectedEmpresa(currentAplicacion.empresaId);
      setSelectedAplicacionPadre(currentAplicacion.apaId);
      setAplicacionNombre(currentAplicacion.nombre);
      setAplicacionTextoAyuda(currentAplicacion.textoAyuda);
      setAplicacionUrl(currentAplicacion.url);
      setAplicacionStatus(currentAplicacion.vigencia);
    }
  }, [currentAplicacion]);

  const onRoleStatusChange = value => {
    setAplicacionStatus(value);
  };


  const onSubmitClick = () => {

    let createOrUpdate = true;

    if (!selectedEmpresa) {
      setEmpresaError(<IntlMessages id="aplicaciones.appModule.requiredMessage" />);
      createOrUpdate = false;
    }

    if (!selectedAplicacionPadre) {
      setAplicacionPadreError(<IntlMessages id="aplicaciones.appModule.requiredMessage" />);
      createOrUpdate = false;
    }

    if (!aplicacionNombre) {
      setAplicacionNombreError(<IntlMessages id="aplicaciones.appModule.requiredMessage" />);
      createOrUpdate = false;
    }
    if (!aplicacionTextoAyuda) {
      setTextoAyudaError(<IntlMessages id="aplicaciones.appModule.requiredMessage" />);
      createOrUpdate = false;
    }

    if (!aplicacionUrl) {
      setAplicacionUrlError(<IntlMessages id="aplicaciones.appModule.requiredMessage" />);
      createOrUpdate = false;
    }
    if (!aplicacionStatus) {
      setRoleStatusError(<IntlMessages id="aplicaciones.appModule.requiredMessage" />);
      createOrUpdate = false;
    }

    if (createOrUpdate) {
      onAplicacionSave();
    }
  };

  const onAplicacionSave = () => {
    const aplicacionDetail = {
      //'appId':,
      'appEmpresaId': selectedEmpresa,
      'appApaId': selectedAplicacionPadre,
      'appNombre': aplicacionNombre,
      'appTextoAyuda': aplicacionTextoAyuda,
      'appUrl': aplicacionUrl,
      'appVigencia': aplicacionStatus,
      'appEnviarUrl': 'N',

    };

    if (currentAplicacion) {
      const aplicacionUpdate = {
        //'appId': aplicacionDetail.appId,
        'appEmpresaId': aplicacionDetail.appEmpresaId,
        'appApaId': aplicacionDetail.appApaId,
        'appNombre': aplicacionDetail.appNombre,
        'appTextoAyuda': aplicacionDetail.appTextoAyuda,
        'appUrl': aplicacionDetail.appUrl,
        'appVigencia': aplicacionDetail.appVigencia,
        'appEnviarUrl': 'N',
      };

      const appIdUpdate = currentAplicacion.id;
      dispatch(
        updateAplicacion(appIdUpdate, aplicacionUpdate, () => {
          onCloseDialog();
        }),
      );
    } else {
      dispatch(
        addNewAplicacion(aplicacionDetail, () => {
          onCloseDialog();
        }),
      );
    }
  };


  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <DialogTitle className={classes.dialogTitleRoot}>
        {currentAplicacion ? (
          <IntlMessages id="aplicaciones.editCreate.form.editTitle" values={{ code: currentAplicacion.id }} />
        ) : (
          <IntlMessages id="aplicaciones.editCreate.form.createTitle" />
        )}
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" mb={{ xs: 6, md: 5 }}>
          <GridContainer>
            <Grid item xs={12} sm={6}>
              <AppSelectBox
                fullWidth
                data={empresas}
                label={<IntlMessages id="aplicaciones.editCreate.label.aplicacionEmpresa" />}
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
              <AppSelectBox
                fullWidth
                data={aplicacionesPadre}
                label={<IntlMessages id="aplicaciones.editCreate.label.aplicacionPadre" />}
                valueKey="apaId"
                variant="outlined"
                labelKey="apaNombre"
                value={selectedAplicacionPadre}
                onChange={e => {
                  setSelectedAplicacionPadre(e.target.value);
                  setSelectedAplicacionPadreError('');
                }}
                helperText={selectedAplicacionPadreError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label={<IntlMessages id="aplicaciones.editCreate.label.aplicacionNombre" />}
                value={aplicacionNombre}
                onChange={e => {
                  setAplicacionNombre(e.target.value);
                  setAplicacionNombreError('');
                }}
                helperText={aplicacionNombreError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label={<IntlMessages id="aplicaciones.editCreate.label.aplicacionUrl" />}
                value={aplicacionUrl}
                onChange={e => {
                  setAplicacionUrl(e.target.value);
                  setAplicacionUrlError('');
                }}
                helperText={aplicacionUrlError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label={<IntlMessages id="aplicaciones.editCreate.label.aplicacionTextoAyuda" />}
                value={aplicacionTextoAyuda}
                onChange={e => {
                  setAplicacionTextoAyuda(e.target.value);
                  setTextoAyudaError('');
                }}
                helperText={aplicacionTextoAyudaError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppSelectBox
                fullWidth
                data={statusLabels}
                label={<IntlMessages id="aplicaciones.editCreate.label.aplicacionStatus" />}
                valueKey="slug"
                variant="outlined"
                labelKey="title"
                value={aplicacionStatus}
                onChange={e => {
                  onRoleStatusChange(e.target.value);
                }}
                helperText={aplicacionStatusError}

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

export default AddEditAplicacion;

AddEditAplicacion.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
