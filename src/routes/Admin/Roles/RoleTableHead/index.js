import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import PropTypes from 'prop-types';
import React from 'react';
import IntlMessages from '@jumbo/utils/IntlMessages';

const headCells = [
  {
    id: 'roleId',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="roles.appModule.idHeader" />,
  },
  {
    id: 'roleEmpresa',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="roles.appModule.empresaHeader" />,
  },
  {
    id: 'roleCodigo',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="roles.appModule.codigoHeader" />,
  },
  {
    id: 'roleDescription',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="roles.appModule.roleHeader" />,
  },
  {
    id: 'roleStatus',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="roles.appModule.statusHeader" />,
  },

];

function RoleTableHead({ classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }) {
  const onSortOrderChange = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={onSortOrderChange(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? (
                    <IntlMessages id="roles.appModule.orderDesc" />
                  ) : (
                    <IntlMessages id="roles.appModule.orderAsc" />
                  )}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="center">{<IntlMessages id="roles.appModule.actions" />}</TableCell>
      </TableRow>
    </TableHead>
  );
}

RoleTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default React.memo(RoleTableHead);
