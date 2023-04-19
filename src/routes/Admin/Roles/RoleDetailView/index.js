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

const RoleDetailView = ({ open, onCloseDialog }) => {
  const classes = useStyles();
  const { currentRole } = useSelector(({ rolesReducer }) => rolesReducer);
  const { rolId, rolDescripcion, rolCodigo, rolEmpresaId, rolEstado, profile_pic } = currentRole;
  const { empresaNombre } = currentRole.empresa;

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <Box className={classes.userInfoRoot}>
        <Box mr={3} display="flex" alignItems="center">
          <Box className={classes.avatarView} mr={{ xs: 4, md: 6 }}>
            <CmtAvatar size={70} src={profile_pic} alt={rolDescripcion} />
          </Box>
          <Box mt={-2}>
            <Box display="flex" alignItems="center">
              <Typography className={classes.titleRoot}>{`${rolDescripcion}`}</Typography>
            </Box>
          </Box>
        </Box>
        <Box ml="auto" mt={-2} display="flex" alignItems="center">
          <Box ml={1}>
            <Tooltip title={rolEstado}>
              <IconButton aria-label="filter list">
                {rolEstado === 'N' && <Block color="primary" />}
                {rolEstado === 'S' && <CheckCircleOutline color="primary" />}
              </IconButton>
            </Tooltip>
          </Box>
          <Box ml={1}>
            <IconButton onClick={onCloseDialog}>
              <ClearIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box px={6} py={5}>
        <Box mb={5} component="p" color="common.dark">
          {<IntlMessages id="roles.roleDetailview.label.title" />}
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <FingerprintIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {rolId}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <AccountCircleIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {empresaNombre}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <AccountCircleIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {rolCodigo}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <AccountCircleIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {rolDescripcion}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <AccountCircleIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {rolEstado === 'N' && <Block color="primary" />}
            {rolEstado === 'S' && <CheckCircleOutline color="primary" />}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default RoleDetailView;

RoleDetailView.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
