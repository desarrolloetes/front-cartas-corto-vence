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
import { isValidEmail } from '../../../../@jumbo/utils/commonHelper';
import { addNewUser, updateUser } from '../../../../redux/actions/Users';
import { getEmpresas } from '../../../../redux/actions/Empresas';
import { useDebounce } from '../../../../@jumbo/utils/commonHelper';
import { validate, getCheckDigit, clean } from '../../../../@jumbo/utils/rutValidador';

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
  { title: 'Activo', slug: 1 },
  { title: 'Inactivo', slug: '0' },
];

const userTypeLabels = [
  { title: 'SB', slug: 1 },
  { title: 'Proveedor', slug: 0 },
];

const AddEditUser = ({ open, onCloseDialog }) => {
  const classes = useStyles();
  const currentUser = useSelector(({ usersReducer }) => usersReducer.currentUser);

  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [profile_pic, setProfile_pic] = useState('');
  const [userTaxPayer, setUserTaxPayer] = useState('');
  const [userStatus, setUserStatus] = useState('S');
  const [userPassword, setUserPassword] = useState('');
  const [rutEmpresa, setRutEmpresa] = useState('');
  const [userType, setUserType] = useState('S');
  const [company, setCompany] = useState(1);

  const [firstNameError, setFirstNameError] = useState('');
  const [middleNameError, setMiddleNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [userPasswordError, setUserPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [userTaxPayerError, setUserTaxPayerError] = useState('');
  const [rutEmpresaError, setRutEmpresaError] = useState('');
  const [userStatusError, setUserStatusError] = useState('');
  const [userTypeError, setUserTypeError] = useState('');

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
        //setFilterApplied(!!filterOptions.length || !!debouncedSearchEmpresaTerm);
        setEmpresasFetched(true);
      }),
    );
  }, []);

  useEffect(() => {
    if (currentUser) {
      //console.log({currentUser})
      setUserId(currentUser.id);
      setSelectedEmpresa(currentUser.empresaId)
      setFirstName(currentUser.nombres);
      setMiddleName(currentUser.apaterno);
      setLastName(currentUser.amaterno);
      setUserName(currentUser.login);
      setUserTaxPayer(currentUser.rut + '-' + getCheckDigit(currentUser.rut));
      setEmail(currentUser.email);
      setUserStatus(currentUser.estado);
      setUserPassword(currentUser.clave);
      setUserType(currentUser.tipo);
      setRutEmpresa(currentUser.rutEmpresa + '-' + getCheckDigit('' + currentUser.rutEmpresa));
    }
  }, [currentUser]);

  //************************Fin useEffect************************************* */

  const onUserStatusChange = value => {
    setUserStatus(value);
  };

  const onUserTypeChange = value => {
    setUserType(value);
  };



  const onSubmitClick = () => {

    let createOrUpdate = true;

    if (!selectedEmpresa) {
      setSelectedEmpresaError(<IntlMessages id="users.appModule.requiredMessage" />);
      createOrUpdate = false;
    }
    if (!firstName) {
      setFirstNameError(<IntlMessages id="users.appModule.requiredMessage" />);
      createOrUpdate = false;
    }
    if (!middleName) {
      setMiddleNameError(<IntlMessages id="users.appModule.requiredMessage" />);
      createOrUpdate = false;
    }
    if (!lastName) {
      setLastNameError(<IntlMessages id="users.appModule.requiredMessage" />);
      createOrUpdate = false;
    }
    if (!userName) {
      setUserNameError(<IntlMessages id="users.appModule.requiredMessage" />);
      createOrUpdate = false;
    }
    if (!email) {
      setEmailError(<IntlMessages id="users.appModule.requiredMessage" />);
      createOrUpdate = false;
    }
    if (!isValidEmail(email)) {
      setEmailError(<IntlMessages id="users.appModule.emailNotValid" />);
      createOrUpdate = false;
    }

    if (!userTaxPayer) {
      setUserTaxPayerError(<IntlMessages id="users.appModule.requiredMessage" />);
      createOrUpdate = false;
    } else {
      //validar rut react
      if (!validate(userTaxPayer)) {
        setUserTaxPayerError(<IntlMessages id="users.appModule.rutValidoMessage" />);
        createOrUpdate = false;
      }
    }
    if (!userPassword) {
      setUserPasswordError(<IntlMessages id="users.appModule.requiredMessage" />);
      createOrUpdate = false;
    }

    if (!userType && userType != 0) {
      setUserTypeError(<IntlMessages id="users.appModule.requiredMessage" />);
      createOrUpdate = false;
    } else if (userType === 0) {
      if (!rutEmpresa) {
        setRutEmpresaError(<IntlMessages id="users.appModule.requiredMessage" />);
        createOrUpdate = false;
      } else {
        if (!validate(rutEmpresa)) {
          setRutEmpresaError(<IntlMessages id="users.appModule.rutValidoMessage" />);
          createOrUpdate = false;

        }
      }
    }

    if (!userStatus) {
      setUserStatusError(<IntlMessages id="users.appModule.requiredMessage" />);
      createOrUpdate = false;
    }

    if (createOrUpdate) {
      onUserSave();
    }
  };

  const onUserSave = () => {

    let rutArray = userTaxPayer.split('-', clean(userTaxPayer));
    let rut = rutArray[0];
    let dv = rutArray[1];

    let rutEmpresaArray = rutEmpresa.split('-', clean(rutEmpresa));
    let rutEmp = rutEmpresaArray[0];
    let dvEmpresa = rutEmpresaArray[1];

    const userDetail = {
      //'id':currentUser,
      'login': userName,
      'rut': rut,
      'clave': userPassword,
      'empresaId': selectedEmpresa,
      'tipo': userType,
      'rutEmpresa': rutEmp,
      'nombres': firstName,
      'aPaterno': middleName,
      'aMaterno': lastName,
      'email': email,
      'estado': userStatus,

    };

    if (currentUser) {
      const userUpdate = {
        'login': userDetail.login,
        'rut': userDetail.rut,
        'clave': userDetail.clave,
        'empresaId': userDetail.empresaId,
        'tipo': userDetail.tipo,
        'rutEmpresa': userDetail.rutEmpresa,
        'nombres': userDetail.nombres,
        'aPaterno': userDetail.aPaterno,
        'aMaterno': userDetail.aMaterno,
        'email': userDetail.email,
        'estado': userDetail.estado,
      };

      const userIdUpdate = currentUser.id;
      dispatch(
        updateUser(userIdUpdate, userUpdate, () => {
          onCloseDialog();
        }),
      );
    } else {
      dispatch(
        addNewUser(userDetail, () => {
          onCloseDialog();
        }),
      );
    }
  };

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <DialogTitle className={classes.dialogTitleRoot}>
        {currentUser ? (
          <IntlMessages id="users.editCreate.form.editTitle" values={{ code: currentUser.id }} />
        ) : (
          <IntlMessages id="users.editCreate.form.createTitle" />
        )}
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" mb={{ xs: 6, md: 5 }}>
          <Box {...getRootProps()} mr={{ xs: 0, md: 5 }} mb={{ xs: 3, md: 0 }} className="pointer">
            <input {...getInputProps()} />
            <CmtAvatar size={70} src={profile_pic} />
          </Box>
          <GridContainer>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label={<IntlMessages id="users.editCreate.label.firstName" />}
                value={firstName}
                onChange={e => {
                  setFirstName(e.target.value);
                  setFirstNameError('');
                }}
                helperText={firstNameError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label={<IntlMessages id="users.editCreate.label.middleName" />}
                value={middleName}
                onChange={e => {
                  setMiddleName(e.target.value);
                  setMiddleNameError('');
                }}
                helperText={middleNameError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label={<IntlMessages id="users.editCreate.label.lastName" />}
                value={lastName}
                onChange={e => {
                  setLastName(e.target.value);
                  setLastNameError('');
                }}
                helperText={lastNameError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label={<IntlMessages id="users.editCreate.label.taxPayerId" />}
                value={userTaxPayer}
                onChange={e => {
                  setUserTaxPayer(e.target.value);
                  setUserTaxPayerError('');
                }}
                helperText={userTaxPayerError}
              />
            </Grid>
          </GridContainer>
        </Box>
        <Box mb={{ xs: 6, md: 5 }}>
          <AppTextInput
            fullWidth
            variant="outlined"
            label={<IntlMessages id="users.editCreate.label.userName" />}
            value={userName}
            onChange={e => {
              setUserName(e.target.value);
              setUserNameError('');
            }}
            helperText={userNameError}
          />
        </Box>
        <Box mb={{ xs: 6, md: 5 }}>
          <TextField
            type="password"
            label={<IntlMessages id="users.editCreate.label.password" />}
            fullWidth
            onChange={event => {
              setUserPassword(event.target.value);
              setUserPasswordError('');
            }}
            defaultValue={userPassword}
            // value={password}
            margin="normal"
            variant="outlined"
            className={classes.textFieldRoot}
            //error={password === ""}
            helperText={userPasswordError}
          />
        </Box>
        <Box mb={{ xs: 6, md: 5 }}>
          <AppSelectBox
            fullWidth
            data={empresas}
            label={<IntlMessages id="users.editCreate.label.company" />}
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
        </Box>
        <Box mb={{ xs: 6, md: 5 }}>
          <AppTextInput
            fullWidth
            variant="outlined"
            label={<IntlMessages id="users.editCreate.label.email" />}
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            helperText={emailError}
          />
        </Box>
        <Box mb={{ xs: 6, md: 5 }}>
          <Grid item xs={12} sm={6}>
            <AppSelectBox
              fullWidth
              data={userTypeLabels}
              label={<IntlMessages id="users.editCreate.label.userType" />}
              valueKey="slug"
              variant="outlined"
              labelKey="title"
              value={userType}
              onChange={e => {
                setUserType(e.target.value);
                setUserTypeError('');
              }}
              helperText={userTypeError}
            />
          </Grid>
        </Box>
        <Box mb={{ xs: 6, md: 5 }}>
          <AppTextInput
            fullWidth
            variant="outlined"
            label={<IntlMessages id="users.editCreate.label.rutEmpresa" />}
            value={rutEmpresa}
            onChange={e => {
              setRutEmpresa(e.target.value);
              setRutEmpresaError('');
            }}
            helperText={rutEmpresaError}
          />
        </Box>
        <GridContainer style={{ marginBottom: 12 }}>
        </GridContainer>
        <GridContainer style={{ marginBottom: 12 }}>
          <Grid item xs={12} sm={6}>
            <AppSelectBox
              fullWidth
              data={statusLabels}
              label={<IntlMessages id="users.editCreate.label.status" />}
              valueKey="slug"
              variant="outlined"
              labelKey="title"
              value={userStatus}
              onChange={e => {
                onUserStatusChange(e.target.value);
                setUserStatusError('');
              }}
              helperText={userStatusError}
            />
          </Grid>
        </GridContainer>
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

export default AddEditUser;

AddEditUser.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
