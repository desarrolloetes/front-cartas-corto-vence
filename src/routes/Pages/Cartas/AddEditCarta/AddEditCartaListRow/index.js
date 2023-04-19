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
// import { timeFromNow } from '../../../../@jumbo/utils/dateHelper';
// import { Block, CheckCircleOutline, Delete, Edit, Mail, MoreHoriz, Visibility } from '@material-ui/icons';
// import { useDispatch } from 'react-redux';
// import { sentMailToUser, updateUserStatus } from '../../../../redux/actions/Users';
import { TextField } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { alpha } from '@material-ui/core/styles'
import AppSelectBox from '../../../../../@jumbo/components/Common/formElements/AppSelectBox';
/* import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; */


const canjeLabels = [
  { title: 'Si', code: 1 },
  { title: 'No', code: 0 },
]; 

const useStyles = makeStyles(theme => ({
  titleRoot: {
    marginBottom: 2,
    fontSize: 14,
    letterSpacing: 0.25,
    color: theme.palette.common.dark,
  },
}));

const AddEditCartaListRow = ({
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
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.codigoProducto}
      selected={isItemSelected}
    >
      <TableCell padding="checkbox">
        <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }}  onClick={event => onRowClick(event, row.codigoProducto)}/>
      </TableCell>
      <TableCell>{row.codigoProducto}</TableCell>
      <TableCell>{row.descripcion}</TableCell>
      <TableCell>{row.codigoProducto}</TableCell>
      <TableCell>{row.descripcion}</TableCell>
      <TableCell>{row.promedioVentas}</TableCell>
      <TableCell>{row.stockCd}</TableCell>
      <TableCell>
      <TextField
          fullWidth
          defaultValue={''}
          editable="true"
          onChange={e => {
            onRowChange(e.target.value, row.codigoProducto, "lote");
          }}
        />
      </TableCell>
      <TableCell>
      <TextField
          fullWidth
          defaultValue={''}
          editable="true"
          type="number"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
          onChange={e => {
            onRowChange(e.target.value, row.codigoProducto, "cantidadUnitaria");
          }}          
        />
      </TableCell>
      <TableCell>
      <TextField
          fullWidth
          defaultValue={''}
          editable="true"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
          type="number"
          onChange={e => {
             onRowChange(e.target.value, row.codigoProducto, "descuento");
          }}
        />
      </TableCell>
      <TableCell>
        <KeyboardDatePicker
          placeholder="2023/01/01"
          value={selectedDate}
          onChange={date => {
            setSelectedDate(date.format('YYYY-MM-DD') + 'T00:00:00.000-03:00');
            onRowChange(date.format('YYYY-MM-DD') + 'T00:00:00.000-03:00' , row.codigoProducto, "fechaVencimientoLote");
          }}  
          format="yyyy/MM/DD"
          minDate={new Date()}
        />        
      </TableCell>
      <TableCell>
      <TextField
          fullWidth
          defaultValue={''}
          editable="true"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0  }}
          type="number"
          onChange={e => {
            onRowChange(e.target.value, row.codigoProducto, "plazoPagoAdicional");
          }}
        />
      </TableCell>
      <TableCell>
      <AppSelectBox
                      fullWidth
                      data={canjeLabels}
                      valueKey="code"
                      variant="outlined"
                      //labelKey="title"
                      defaultValue={''}
                      //value={selectedTipoCategory}
                      onChange={e => {
                        onRowChange(e.target.value, row.codigoProducto, "canje");
                      }}
                    />          
      </TableCell>
    </TableRow>
  );
};

export default React.memo(AddEditCartaListRow);
