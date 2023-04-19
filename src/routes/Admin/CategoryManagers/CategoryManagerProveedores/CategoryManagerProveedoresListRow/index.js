import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableRow from '@material-ui/core/TableRow';

const CategoryManagersProveedoresListRow = ({ row, isSelected, onRowClick, onUserEdit, onUserDelete, onUserView, onUserRoles }) => {

  const labelId = `enhanced-table-checkbox-${row.ctpPrvRut}`;
  const isItemSelected = isSelected(row.ctpPrvRut);

  return (
    <TableRow
      hover
      onClick={event => onRowClick(event, row.ctpPrvRut)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.ctpPrvRut}
      selected={isItemSelected}>
      <TableCell padding="checkbox">
        <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
      </TableCell>
      <TableCell>{row.proveedor.provRut}</TableCell>
      <TableCell>{row.proveedor.provProveedor}</TableCell>
      <TableCell>
        {row.ctpEstado === 'S' ? `Asignado` : ''}
      </TableCell>
    </TableRow>
  );
};

export default React.memo(CategoryManagersProveedoresListRow);
