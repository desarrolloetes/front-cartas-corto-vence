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

const getProveedorActions = user => {
  const actions = [
    {
      action: 'view',
      label: <IntlMessages id="proveedores.appModule.viewProveedor" />,
      icon: <Visibility />,
    },
    {
      action: 'edit',
      label: <IntlMessages id="proveedores.appModule.editProveedor" />,
      icon: <Edit />,
    },
    {
      action: 'provedorCategoryManagers',
      label: <IntlMessages id="proveedores.appModule.provedorCategoryManagers" />,
      icon: <Edit />,
    },    
  ];

  actions.push({
    action: 'delete',
    label: <IntlMessages id="proveedores.appModule.deleteProveedor" />,
    icon: <Delete />,
  });
  return actions;
};

const ProveedorListRow = ({ row, isSelected, onRowClick, onProveedorEdit, onProveedorDelete, onProveedorView, onProveedorCategoryManagers }) => {
  const classes = useStyles();

  const onProveedorMenuClick = menu => {
    if (menu.action === 'view') {
      onProveedorView(row);
    } else if (menu.action === 'edit') {
      onProveedorEdit(row);
    } else if (menu.action === 'delete') {
      onProveedorDelete(row);
    } else if (menu.action === 'provedorCategoryManagers') {
      onProveedorCategoryManagers(row);
    }
  };

  const labelId = `enhanced-table-checkbox-${row.provId}`;
  const isItemSelected = isSelected(row.provId);
  const proveedorActions = getProveedorActions(row);

  return (
    <TableRow
      hover
      onClick={event => onRowClick(event, row.prvId)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.provId}
      selected={isItemSelected}>
      <TableCell padding="checkbox">
      </TableCell>
      <TableCell component="th" id={labelId} scope="row" padding="none">
        <Box display="flex" alignItems="center">
          <div>
            <Typography className={classes.titleRoot} component="div" variant="h4">
              {row.provId}
            </Typography>
          </div>
        </Box>
      </TableCell>
      <TableCell>{row.empresa.empresaNombre}</TableCell>
      <TableCell>{row.provRut}</TableCell>
      <TableCell>{row.provProveedor}</TableCell>
      <TableCell>{row.provCodigoSB}</TableCell> 
      <TableCell>{row.provDescripcionSB}</TableCell> 
      <TableCell>{row.provCodigoPU}</TableCell> 
      <TableCell>{row.provDescripcionPU}</TableCell>       
      <TableCell>{row.provMoneda}</TableCell>     
      <TableCell align="center" onClick={event => event.stopPropagation()}>
        <CmtDropdownMenu items={proveedorActions} onItemClick={onProveedorMenuClick} TriggerComponent={<MoreHoriz />} />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ProveedorListRow);
