import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableRow from '@material-ui/core/TableRow';


const UserRolesListRow = ({ row, isSelected, onRowClick, onUserEdit, onUserDelete, onUserView, onUserRoles }) => {

  const labelId = `enhanced-table-checkbox-${row.usroRoleId}`;
  const isItemSelected = isSelected(row.usroRoleId);

  return (
    <TableRow
      hover
      onClick={event => onRowClick(event, row.usroRoleId)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.usroRoleId}
      selected={isItemSelected}>
      <TableCell padding="checkbox">
      </TableCell>
      <TableCell>{row.rol.rolDescripcion}</TableCell>
      <TableCell>
        {row.usrlEstado === 'S' ? 'Asignado' : ''}
      </TableCell>
    </TableRow>
  );
};

export default React.memo(UserRolesListRow);
