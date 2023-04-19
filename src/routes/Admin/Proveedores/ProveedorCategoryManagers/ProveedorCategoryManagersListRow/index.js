import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableRow from '@material-ui/core/TableRow';

const ProveedorCategoryManagersListRow = ({ row, isSelected, onRowClick, onUserEdit, onUserDelete, onUserView, onUserRoles }) => {

  const labelId = `enhanced-table-checkbox-${row.ctpCodigoCm}`;
  const isItemSelected = isSelected(row.ctpCodigoCm);

  return (
    <TableRow
      hover
      onClick={event => onRowClick(event, row.ctpCodigoCm)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.ctpCodigoCm}
      selected={isItemSelected}>
      <TableCell padding="checkbox">
        <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
      </TableCell>
      <TableCell>{row.category.usrRut}</TableCell>
      <TableCell>{row.category.usrLogin}</TableCell>
      <TableCell>
        {row.ctpEstado === 'S' ? `Asignado` : ''}
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ProveedorCategoryManagersListRow);
