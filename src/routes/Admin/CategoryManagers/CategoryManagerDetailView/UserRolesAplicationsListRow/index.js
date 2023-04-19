import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableRow from '@material-ui/core/TableRow';

const UserRolesListRow = ({ row, isSelected, onRowClick, onUserEdit, onUserDelete, onUserView, onUserRoles }) => {
  const labelId = `enhanced-table-checkbox-${row.urpAppId}`;
  const isItemSelected = isSelected(row.urpAppId);

  return (
    <TableRow
      hover
      onClick={event => onRowClick(event, row.urpAppId)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.urpAppId}
      selected={isItemSelected}>
      <TableCell padding="checkbox">
      </TableCell>
      <TableCell>{row.aplicacion.nombre}</TableCell>
      <TableCell>
        {row.urpVigencia === '0' ? `No Vigente` : 'Vigente'}
      </TableCell>
    </TableRow>
  );
};

export default React.memo(UserRolesListRow);
