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

const getUserActions = user => {
  const actions = [

    {
      action: 'proveedores',
      label: <IntlMessages id="users.proveedores.label.title" />,
      icon: <Edit />,
    },

  ];

  return actions;
};

const CategoryManagerListRow = ({
  row,
  isSelected,
  onRowClick,
  onUserEdit,
  onUserDelete,
  onUserView,
  onUserCategoryManagerProveedores,
}) => {
  const classes = useStyles();

  const onUserMenuClick = menu => {

    if (menu.action === 'proveedores') {
      onUserCategoryManagerProveedores(row);
    } else if (menu.action === 'delete') {
      onUserDelete(
        row,
      );
    }
  };

  const labelId = `enhanced-table-checkbox-${row.userId}`;
  const isItemSelected = isSelected(row.userId);
  const userActions = getUserActions(row);

  return (
    <TableRow
      hover
      onClick={event => onRowClick(event, row.userId)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.userId}
      selected={isItemSelected}>
      <TableCell padding="checkbox">
      </TableCell>
      <TableCell>{row.id}</TableCell>
      <TableCell>{row.empresa.empresaNombre}</TableCell>
      <TableCell>{row.login}</TableCell>
      <TableCell>{row.rutEmpresa}</TableCell>
      <TableCell>{row.nombres}</TableCell>
      <TableCell>{row.email}</TableCell>
      <TableCell>
        {row.estado === 1 ? `Activo` : 'Inactivo'}
      </TableCell>
      <TableCell align="center" onClick={event => event.stopPropagation()}>
        <CmtDropdownMenu items={userActions} onItemClick={onUserMenuClick} TriggerComponent={<MoreHoriz />} />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(CategoryManagerListRow);
