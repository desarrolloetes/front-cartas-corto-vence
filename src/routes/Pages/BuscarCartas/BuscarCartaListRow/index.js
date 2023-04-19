import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableRow from '@material-ui/core/TableRow';
import CmtDropdownMenu from '../../../../@coremat/CmtDropdownMenu';
import CmtAvatar from '../../../../@coremat/CmtAvatar';
import { format } from 'date-fns'
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

const getCartaActions = carta => {
  const actions = [
    {
      action: 'validate',
      label: <IntlMessages id="validarCartas.appModule.validateCarta" />,
      icon: <Edit />,
    },
     {
      action: 'view',
      label: <IntlMessages id="validarCartas.appModule.viewCarta" />,
      icon: <Visibility />,
    }, 
  ];

/*   actions.push({
    action: 'delete',
    label: <IntlMessages id="cartas.appModule.deleteCarta" />,
    icon: <Delete />,
  }); */
  return actions;
};

const ValidarCartaListRow = ({ row, isSelected, onRowClick, onCartaEdit, onCartaDelete, onCartaView }) => {
  const classes = useStyles();

  const onCartaMenuClick = menu => {
    if (menu.action === 'validate') {
      onCartaView(row);
    }
     else if (menu.action === 'view') {
      onCartaEdit(row); 
     }
  };

  const labelId = `enhanced-table-checkbox-${row.ccvId}`;
  const isItemSelected = isSelected(row.ccvId);
  const cartasActions = getCartaActions(row);

  return (
    <TableRow
      hover
      onClick={event => onRowClick(event, row.ccvId)}
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.ccvId}
      selected={isItemSelected}>
       <TableCell component="th" id={labelId} scope="row" padding="none">
        <Box display="flex" alignItems="center">
     
          <div>
            <Typography className={classes.titleRoot} component="div" variant="h4">
              {'[' + row.ccvId + ']' }
            </Typography>
          </div>
        </Box>
      </TableCell> 
      <TableCell>{ row.ccvOrdenCompra                          }</TableCell>
      <TableCell>{ new Date(row.ccvFechaExpiracion).toLocaleDateString()}</TableCell>
      <TableCell>{ row.ccvCategoryLoginId                      }</TableCell>
      <TableCell>{ row.ccvCategoryRutEmpresa                           }</TableCell>
      <TableCell>
        {row.ccvEstado === 1 ? 'Recepcionada' : (row.ccvEstado === 2 ? 'Aprobada' : (row.ccvEstado === 3 ? 'Rechazada' : 'Aprobada Parcial'))}  
      </TableCell>
      <TableCell align="center" onClick={event => event.stopPropagation()}>
        <CmtDropdownMenu items={cartasActions} onItemClick={onCartaMenuClick} TriggerComponent={<MoreHoriz />} />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ValidarCartaListRow);
