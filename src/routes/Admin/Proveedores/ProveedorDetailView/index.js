import React from 'react';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import CmtAvatar from '../../../../@coremat/CmtAvatar';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import ClearIcon from '@material-ui/icons/Clear';
import EmailIcon from '@material-ui/icons/Email';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import PhoneIcon from '@material-ui/icons/Phone';
import useStyles from './index.style';
import { Block, CheckCircleOutline } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';
import IntlMessages from '../../../../@jumbo/utils/IntlMessages';

const monedaLabels = [
  { title: 'CLP', slug: 'CLP' },
  { title: 'USD', slug: 'USD' },
];

const ProveedorDetailView = ({ open, onCloseDialog }) => {
  const classes = useStyles();
  const { currentProveedor } = useSelector(({ proveedoresReducer }) => proveedoresReducer);

  const { provId, provRut, provDV, provCodigoSB, provEmpresaId, provCodigoPU, provDescripcionSB, provDescripcionPU, provProveedor, provMoneda, profile_pic } = currentProveedor;
  const { empresaNombre } = currentProveedor.empresa;


  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <Box className={classes.userInfoRoot}>
        <Box mr={3} display="flex" alignItems="center">
          <Box className={classes.avatarView} mr={{ xs: 4, md: 6 }}>
            <CmtAvatar size={70} src={profile_pic} alt={provProveedor} />
          </Box>
          <Box mt={-2}>
            <Box display="flex" alignItems="center">
              <Typography className={classes.titleRoot}>{`${provProveedor}`}</Typography>
            </Box>
          </Box>
        </Box>
        <Box ml="auto" mt={-2} display="flex" alignItems="center">
          <Box ml={1}>
            <IconButton onClick={onCloseDialog}>
              <ClearIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box px={6} py={5}>
        <Box mb={5} component="p" color="common.dark">
          {<IntlMessages id="proveedores.aplicacionDetailview.label.title" />}
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <FingerprintIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {provId}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <AccountCircleIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {provProveedor}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <AccountCircleIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {provRut + '-' + provDV}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <AccountCircleIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {provCodigoSB}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <AccountCircleIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {provDescripcionSB}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <AccountCircleIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {provCodigoPU}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <AccountCircleIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {provDescripcionPU}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <AccountCircleIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {provMoneda}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ProveedorDetailView;

ProveedorDetailView.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
