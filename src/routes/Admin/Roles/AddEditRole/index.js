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
import { addNewRole, updateRole } from '../../../../redux/actions/Roles';
import { useDebounce } from '../../../../@jumbo/utils/commonHelper';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getEmpresas } from '../../../../redux/actions/Empresas';

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


const AddEditRole = ({ open, onCloseDialog }) => {
  const classes = useStyles();
  const currentRole = useSelector(({ rolesReducer }) => rolesReducer.currentRole);

  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleStatus, setRoleStatus] = useState('');
  const [roleStatusError, setRoleStatusError] = useState('');
  const [profile_pic, setProfile_pic] = useState('');
  const [roleNameError, setRoleNameError] = useState('');
  const [roleDescriptionError, setRoleDescriptionError] = useState('');
  //aplicacion empresa
  const { empresas } = useSelector(({ empresasReducer }) => empresasReducer);
  const [empresasFetched, setEmpresasFetched] = useState(true);
  const [empresaText, setEmpresaText] = useState('');
  const [empresaError, setEmpresaError] = useState('');
  const [selectedEmpresaError, setSelectedEmpresaError] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const debouncedSearchEmpresaTerm = useDebounce(searchEmpresaTerm, 500);
  const [searchEmpresaTerm, setSearchEmpresaTerm] = useState('');

  const [filterOptions, setFilterOptions] = React.useState([]);
  const [isFilterApplied, setFilterApplied] = useState(false);


  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setProfile_pic(URL.createObjectURL(acceptedFiles[0]));
    },
  });

  const dispatch = useDispatch();

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
    if (currentRole) {
      //setRoleId(currentRole.roleId);
      setSelectedEmpresa(currentRole.empresa.empresaCodigo)
      setEmpresaText(currentRole.empresa.empresaNombre)
      setRoleName(currentRole.rolCodigo);
      setRoleDescription(currentRole.rolDescripcion);
      setRoleStatus(currentRole.rolEstado);
    }
  }, [currentRole]);


  //************************Fin useEffect************************************* */

  const onRoleStatusChange = value => {
    setRoleStatus(value);
  };


  const onSubmitClick = () => {

    let createOrUpdate = true;

    if (!selectedEmpresa) {
      setSelectedEmpresaError(<IntlMessages id="roles.appModule.requiredMessage" />);
      createOrUpdate = false;
    }
    if (!roleName) {
      setRoleNameError(<IntlMessages id="roles.appModule.requiredMessage" />);
      createOrUpdate = false;
    }
    if (!roleDescription) {
      setRoleDescriptionError(<IntlMessages id="roles.appModule.requiredMessage" />);
      createOrUpdate = false;
    }
    if (!roleStatus) {
      setRoleStatusError(<IntlMessages id="roles.appModule.requiredMessage" />);
      createOrUpdate = false;
    }

    if (createOrUpdate) {
      onRoleSave();
    }
  };

  const onRoleSave = () => {
    const roleDetail = {
      //'rolId': 0,
      'rolCodigo': roleName,
      'rolDescripcion': roleDescription,
      'rolEstado': roleStatus,
      'rolEmpresaId': selectedEmpresa,

    };

    if (currentRole) {
      const roleUpdate = {
        'rolId': currentRole.rolId,
        'rolCodigo': roleDetail.rolCodigo,
        'rolDescripcion': roleDetail.rolDescripcion,
        'rolEstado': roleDetail.rolEstado,
        'rolEmpresaId': roleDetail.rolEmpresaId,
      };

      const roleIdUpdate = currentRole.rolId;
      dispatch(
        updateRole(roleIdUpdate, roleUpdate, () => {
          onCloseDialog();
        }),
      );
    } else {
      dispatch(
        addNewRole(roleDetail, () => {
          onCloseDialog();
        }),
      );
    }
  };

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <DialogTitle className={classes.dialogTitleRoot}>
        {currentRole ? (
          <IntlMessages id="roles.editCreate.form.editTitle" values={{ code: currentRole.rolId }} />
        ) : (
          <IntlMessages id="roles.editCreate.form.createTitle" />
        )}
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" mb={{ xs: 6, md: 5 }}>
          <GridContainer>
            <Grid item xs={12} sm={6}>
              <AppSelectBox
                fullWidth
                data={empresas}
                label={<IntlMessages id="roles.editCreate.label.roleEmpresa" />}
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
                label={<IntlMessages id="roles.editCreate.label.roleName" />}
                value={roleName}
                onChange={e => {
                  setRoleName(e.target.value);
                  setRoleNameError('');
                }}
                helperText={roleNameError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label={<IntlMessages id="roles.editCreate.label.roleDescription" />}
                value={roleDescription}
                onChange={e => {
                  setRoleDescription(e.target.value);
                  setRoleDescriptionError('');
                }}
                helperText={roleDescriptionError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppSelectBox
                fullWidth
                data={statusLabels}
                label={<IntlMessages id="roles.editCreate.label.roleStatus" />}
                valueKey="slug"
                variant="outlined"
                labelKey="title"
                value={roleStatus}
                onChange={e => {
                  onRoleStatusChange(e.target.value);
                  setRoleStatusError('');
                }}
                helperText={roleStatusError}
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

export default AddEditRole;

AddEditRole.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
