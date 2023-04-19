import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableRow from '@material-ui/core/TableRow';
import CmtDropdownMenu from '../../../../@coremat/CmtDropdownMenu';
import CmtAvatar from '../../../../@coremat/CmtAvatar';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IntlMessages from '@jumbo/utils/IntlMessages';
import { Delete, Edit, MoreHoriz, Visibility } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  titleRoot: {
    marginBottom: 2,
    fontSize: 14,
    letterSpacing: 0.25,
    color: theme.palette.common.dark,
  },
}));

const getRoleActions = user => {
  const actions = [
    {
      action: 'view',
      label: <IntlMessages id="roles.appModule.viewRole" />,
      icon: <Visibility />,
    },
    {
      action: 'edit',
      label: <IntlMessages id="roles.appModule.editRole" />,
      icon: <Edit />,
    },
    {
      action: 'rolAplicaciones',
      label: <IntlMessages id="roles.appModule.aplicacionesRole" />,
      icon: <Edit />,
    },
  ];

  actions.push({
    action: 'delete',
    label: <IntlMessages id="roles.appModule.deleteRole" />,
    icon: <Delete />,
  });
  return actions;
};

const RoleListRow = ({ row, isSelected, onRowClick, onRoleEdit, onRoleDelete, onRoleView, onRoleAplicaciones }) => {
  const classes = useStyles();

  const onRoleMenuClick = menu => {
    if (menu.action === 'view') {
      onRoleView(row);
    } else if (menu.action === 'edit') {
      onRoleEdit(row);
    } else if (menu.action === 'delete') {
      onRoleDelete(row);
    } else if (menu.action === 'rolAplicaciones') {
      onRoleAplicaciones(row);
    }
  };

  const labelId = `enhanced-table-checkbox-${row.rolId}`;
  const isItemSelected = isSelected(row.rolId);
  const roleActions = getRoleActions(row);

  return (
    <TableRow
      hover
      onClick={event => onRowClick(event, row.rolId)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.rolId}
      selected={isItemSelected}>
      <TableCell padding="checkbox">
      </TableCell>
      <TableCell component="th" id={labelId} scope="row" padding="none">
        <Box display="flex" alignItems="center">
          <div>
            <Typography className={classes.titleRoot} component="div" variant="h4">
              {row.rolId}
            </Typography>
          </div>
        </Box>
      </TableCell>
      <TableCell>{row.empresa.empresaNombre}</TableCell>
      <TableCell>{row.rolCodigo}</TableCell>
      <TableCell>{row.rolDescripcion}</TableCell>
      <TableCell>
        {row.rolEstado === 'S' ? `Activo` : 'Inactivo'}
      </TableCell>
      <TableCell align="center" onClick={event => event.stopPropagation()}>
        <CmtDropdownMenu items={roleActions} onItemClick={onRoleMenuClick} TriggerComponent={<MoreHoriz />} />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(RoleListRow);
