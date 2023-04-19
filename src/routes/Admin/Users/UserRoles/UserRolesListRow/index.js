import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableRow from '@material-ui/core/TableRow';

const UserRolesListRow = ({ row, isSelected, onRowClick, onUserEdit, onUserDelete, onUserView, onUserRoles }) => {

  const labelId = `enhanced-table-checkbox-${row.rol.rolId}`;
  const isItemSelected = isSelected(row.rol.rolCodigo);

  return (
    <TableRow
      hover
      onClick={event => onRowClick(event, row.rol.rolCodigo)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.rol.rolCodigo}
      selected={isItemSelected}>
      <TableCell padding="checkbox">
        <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
      </TableCell>
      <TableCell>{row.rol.rolCodigo}</TableCell>
      <TableCell>{row.rol.rolDescripcion}</TableCell>
      <TableCell>
        {row.usrlEstado === 'S' ? `Asignado` : ''}
      </TableCell>
    </TableRow>
  );
};

export default React.memo(UserRolesListRow);
