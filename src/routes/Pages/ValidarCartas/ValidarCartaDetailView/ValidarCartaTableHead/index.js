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
    id: 'productoOrdenCompra',
    numeric: false,
    disablePadding: true,
    label: <IntlMessages id="cartas.appModule.productoOrdenCompraHeader" />,
  },
  {
    id: 'productoFechaDespacho',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="cartas.appModule.productoFechaDespachoHeader" />,
  },
  {
    id: '.productoCodigoSB',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="cartas.appModule.productoCodigoSBHeader" />,
  },
  {
    id: 'productoDescripcion',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="cartas.appModule.productoDescripcionHeader" />,
  },
  {
    id: 'productoPromedioVentas',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="cartas.appModule.productoPromedioVentasHeader" />,
  },
  {
    id: 'productoStockCD',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="cartas.appModule.productoStockCDHeader" />,
  },
  {
    id: 'productoLote',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="cartas.appModule.productoLoteHeader" />,
  },
  {
    id: 'productoCantidadUnitaria',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="cartas.appModule.productoCantidadUnitariaHeader" />,
  },
  {
    id: 'productoDescuento',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="cartas.appModule.productoDescuentoHeader" />,
  },
  {
    id: 'productoFechaVencimientoLote',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="cartas.appModule.productoFechaVencimientoLoteHeader" />,
  },
  {
    id: 'productoPlazoPagoAdicional',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="cartas.appModule.productoPlazoPagoAdicionalHeader" />,
  },
  {
    id: 'productoCanje',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="cartas.appModule.productoCanjeHeader" />,
  },  
  {
    id: 'productoEstado',
    numeric: false,
    disablePadding: false,
    label: <IntlMessages id="cartas.appModule.productoEstadoHeader" />,
  },  
    
];

function ValidarCartaTableHead({ classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }) {
  const onSortOrderChange = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
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
                    <IntlMessages id="cartas.appModule.orderDesc" />
                  ) : (
                    <IntlMessages id="cartas.appModule.orderAsc" />
                  )}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

ValidarCartaTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default React.memo(ValidarCartaTableHead);
