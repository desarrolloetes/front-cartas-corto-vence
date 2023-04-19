import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableRow from '@material-ui/core/TableRow';

const RoleAplicacionesListRow = ({ row, isSelected, onRowClick, onUserEdit, onUserDelete, onUserView, onUserRoles }) => {

  const labelId = `enhanced-table-checkbox-${row.roaAppId}`;
  const isItemSelected = isSelected(row.roaAppId);

  return (
    <TableRow
      hover
      onClick={event => onRowClick(event, row.roaAppId)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.roaAppId}
      selected={isItemSelected}>
      <TableCell padding="checkbox">
        <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
      </TableCell>
      <TableCell>{row.roaAppId}</TableCell>
      <TableCell>{row.aplicacion.nombre}</TableCell>
      <TableCell>
        {row.roaVigencia === 'S' ? `Asignado` : ''}
      </TableCell>
    </TableRow>
  );
};

export default React.memo(RoleAplicacionesListRow);
