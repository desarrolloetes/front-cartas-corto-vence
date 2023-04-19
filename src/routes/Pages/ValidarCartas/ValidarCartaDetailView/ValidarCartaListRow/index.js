import React, { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableRow from '@material-ui/core/TableRow';
import CmtDropdownMenu from '../../../../../@coremat/CmtDropdownMenu';
import CmtAvatar from '../../../../../@coremat/CmtAvatar';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IntlMessages from '@jumbo/utils/IntlMessages';
import { Delete, Edit, MoreHoriz, Visibility } from '@material-ui/icons';
import { TextField } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { alpha } from '@material-ui/core/styles'
import AppSelectBox from '../../../../../@jumbo/components/Common/formElements/AppSelectBox';
import { format } from 'date-fns'
import moment from 'moment';


const optionLabels = [
  { title: 'Aprobado', code: 0 },
  { title: 'Rechazado - Muy Corto Vencimiento', code: 1 },
  { title: 'Rechazado - Bajo Descuento', code: 2 },
  { title: 'Rechazado - Sin Canje', code: 3 },
  { title: 'Rechazado - Stock Suficiente', code: 4 },
  { title: 'Rechazado - Otros', code: 5 },
]; 

const useStyles = makeStyles(theme => ({
  titleRoot: {
    marginBottom: 2,
    fontSize: 14,
    letterSpacing: 0.25,
    color: theme.palette.common.dark,
  },
}));

const ValidarCartaListRow = ({
  row,
  isSelected,
  onRowClick,
  onRowChange,
  onCartaProductoDelete,
}) => {
  const classes = useStyles();

  const labelId = `enhanced-table-checkbox-${row.codigoProducto}`;
  const isItemSelected = isSelected(row.codigoProducto);

  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <TableRow  
      hover
      onChange={event => onRowChange(event, row.codigoProducto)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.codigoProducto}
      selected={isItemSelected}
    >
      <TableCell>{row.prodSku}</TableCell>
      <TableCell>{row.prodDescripcion}</TableCell>
      <TableCell>{row.prodSku}</TableCell>
      <TableCell>{row.prodDescripcion}</TableCell>
      <TableCell>{row.prodPromedioVentas}</TableCell>
      <TableCell>{row.prodStockCd}</TableCell>
      <TableCell>{row.prodLote}</TableCell>
      <TableCell>{row.prodCantidadUnidades}</TableCell>
      <TableCell>{row.prodDescuento}</TableCell>
      <TableCell>{moment(row.prodFechaVence).format('MM/DD/YYYY') }</TableCell>
      <TableCell>{row.prodDiasPlazoPagoAd}</TableCell>
      <TableCell>{row.prodCanjePorLote}</TableCell>
      <AppSelectBox
                      fullWidth
                      data={optionLabels}
                      //label={<IntlMessages id="cartas.editCreate.label.tipoCategoryManager" />}
                      valueKey="code"
                      variant="outlined"
                      //labelKey="title"
                      defaultValue={''}
                      //value={selectedTipoCategory}
                      onChange={e => {
                        onRowChange(e.target.value, row.prodId, "validacionCM");
                      }}
                    />        
    </TableRow>
  );
};

export default React.memo(ValidarCartaListRow);
