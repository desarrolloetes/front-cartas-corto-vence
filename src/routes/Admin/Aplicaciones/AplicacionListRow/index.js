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

const getAplicacionActions = user => {
  const actions = [
    {
      action: 'view',
      label: <IntlMessages id="aplicaciones.appModule.viewAplicacion" />,
      icon: <Visibility />,
    },
    {
      action: 'edit',
      label: <IntlMessages id="aplicaciones.appModule.editAplicacion" />,
      icon: <Edit />,
    },
  ];

  actions.push({
    action: 'delete',
    label: <IntlMessages id="aplicaciones.appModule.deleteAplicacion" />,
    icon: <Delete />,
  });
  return actions;
};

const AplicacionListRow = ({ row, isSelected, onRowClick, onAplicacionEdit, onAplicacionDelete, onAplicacionView }) => {
  const classes = useStyles();

  const onAplicacionMenuClick = menu => {
    if (menu.action === 'view') {
      onAplicacionView(row);
    } else if (menu.action === 'edit') {
      onAplicacionEdit(row);
    } else if (menu.action === 'delete') {
      onAplicacionDelete(row);
    }
  };

  const labelId = `enhanced-table-checkbox-${row.id}`;
  const isItemSelected = isSelected(row.id);
  const Actions = getAplicacionActions(row);

  return (
    <TableRow
      hover
      onClick={event => onRowClick(event, row.id)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.id}
      selected={isItemSelected}>
      <TableCell padding="checkbox">
      </TableCell>
      <TableCell component="th" id={labelId} scope="row" padding="none">
        <Box display="flex" alignItems="center">
          <div>
            <Typography className={classes.titleRoot} component="div" variant="h4">
              {row.id}
            </Typography>
          </div>
        </Box>
      </TableCell>
      <TableCell>{row.empresa.empresaNombre}</TableCell>
      <TableCell>{row.aplicacionPadre.apaNombre}</TableCell>
      <TableCell>{row.nombre}</TableCell>
      <TableCell>{row.url}</TableCell>
      <TableCell>
        {row.vigencia === 'S' ? `Activo` : 'Inactivo'}
      </TableCell>
      <TableCell align="center" onClick={event => event.stopPropagation()}>
        <CmtDropdownMenu items={Actions} onItemClick={onAplicacionMenuClick} TriggerComponent={<MoreHoriz />} />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(AplicacionListRow);
