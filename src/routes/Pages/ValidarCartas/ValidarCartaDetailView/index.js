import React, { useEffect, useState, ChangeEvent } from 'react';
import { Paper, Table, TableCell, TableContainer, TableRow, Select, Snackbar, Alert } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import ValidarCartaListRow from './ValidarCartaListRow';
import ValidarCartaTableHead from './ValidarCartaTableHead';
import ValidarCartaTableToolbar from './ValidarCartaTableToolbar';
import { getComparator, stableSort } from '../../../../@jumbo/utils/tableHelper';
import { useDispatch, useSelector } from 'react-redux';
import { getProductosOrdenCompraByRutProveedor, getOrdenesCompraByRutProveedor, deleteProductoOrdenCompra } from '../../../../redux/actions/OrdenesCompra';
import { getCategoryManagersByEmpresa, setCurrentCategoryManager, getCategoryByLogin } from '../../../../redux/actions/CategoryManagers';
import { getProductosByCarta, validarCarta } from '../../../../redux/actions/Cartas';
import { uploadFile } from '../../../../redux/actions/FileUpload';
import { addNewCarta } from '../../../../redux/actions/Cartas';
import { useDebounce } from '../../../../@jumbo/utils/commonHelper';
import useStyles from './index.style';
import NoRecordFound from './NoRecordFound';
import IntlMessages from '@jumbo/utils/IntlMessages';
import { downloadFile } from '@jumbo/utils/fileHelper';
import GridContainer from '../../../../@jumbo/components/GridContainer';
import Grid from '@material-ui/core/Grid';
import { Box, TextField } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { fetchError } from '../../../../redux/actions';
import ExportButton from '../../../../components/ExportButton';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import AppSelectBox from '../../../../@jumbo/components/Common/formElements/AppSelectBox';
import ConfirmDialog from '../../../../@jumbo/components/Common/ConfirmDialog';
import AppTextInput from '../../../../@jumbo/components/Common/formElements/AppTextInput';
import GetAppIcon from "@material-ui/icons/GetApp";


const tipoCategoryLabels = [
  { title: 'Pharma', code: '1' },
  { title: 'Consumo', code: '2' },
];

const ValidarCartaDetailView = ({ open, onCloseDialog }) => {

  const currentCarta = useSelector(({ cartasReducer }) => cartasReducer.currentCarta);
  const productosCarta = useSelector(({ cartasReducer }) => cartasReducer.productosCarta);
  const currentCategoryManager = useSelector(({ categoryManagersReducer }) => categoryManagersReducer.currentCategoryManager);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [snackbarMessage, setSnackbarMessage] = useState(undefined);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Table Data 
  const [productosValidacion, setProductosValidacion] = useState([]);

  const classes = useStyles();

  //Usuario Autorizado  
  const { authUser } = useSelector(({ auth }) => auth);


  //Productos Ordenes Compra 
  const { productosOrdenCompra } = useSelector(({ ordenesCompraReducer }) => ordenesCompraReducer);
  const [productosOrdenCompraFetched, setProductosOrdenCompraFetched] = useState(true);
  const [openConfirmSaveCartaDialog, setOpenConfirmSaveCartaDialog] = useState(false);

  //Ordenes Compra  
  const { ordenesCompra } = useSelector(({ ordenesCompraReducer }) => ordenesCompraReducer);
  const debouncedSearchOrdenesCompraTerm = useDebounce(searchOrdenesCompraTerm, 500);
  const [searchOrdenesCompraTerm, setSearchOrdenesCompraTerm] = useState('');
  const [ordenesCompraFetched, setOrdenesCompraFetched] = useState(false);
  const [selectedOrdenCompra, setSelectedOrdenCompra] = useState(null);
  const [productosCartaFetched, setProductosCartaFetched] = useState(false);
  const [categoryCartaFetched, setCategoryCartaFetched] = useState(false);

  //Category Managers
  const { categoryManagers } = useSelector(({ categoryManagersReducer }) => categoryManagersReducer);
  //const currentCategoryManager = useSelector(({ categoryManagersReducer }) => categoryManagersReducer);
  const [selectedCategoryManager, setSelectedCategoryManager] = useState(null);
  const debouncedSearchCategoryManagersTerm = useDebounce(searchCategoryManagersTerm, 500);
  const [searchCategoryManagersTerm, setSearchCategoryManagersTerm] = useState('');
  const [categoryManagersFetched, setCategoryManagersFetched] = useState(false);
  const [categoryManagerText, setCategoryManagerText] = useState(null);

  //Otros Datos - Rut Proveedor
  const [rutProveedorCategoryManager, setRutProveedorCategoryManager] = useState('');
  const [rutProveedorCategoryManagerError, setRutProveedorCategoryManagerError] = useState('');

  //Otros Datos - Email Category Manager
  const [emailCategoryManager, setEmailCategoryManager] = useState('');
  const [emailCategoryManagerError, setEmailCategoryManagerError] = useState('');

  //Tipo Category
  const [tipoCategoryText, setTipoCategoryText] = useState('');
  const [selectedTipoCategory, setSelectedTipoCategory] = useState('');

  // Upload Carta Corto Vence
  const [fileCCV, setFileCCV] = useState(null);
  const [filename, setFilename] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileContentType, setFileContentType] = useState('');

  // Comentario Carta
  const [comentarioCarta, setComentarioCarta] = useState('');

  const [orderBy, setOrderBy] = React.useState('name');
  const [order, setOrder] = React.useState('asc');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);

  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);


  const dispatch = useDispatch();

  //Errores
  //Filtro Orden de Compra
  const [selectedOrdenCompraError, setSelectedOrdenCompraError] = useState('');
  //Errores - Productos Orden de Compra
  const [productosOrdenCompraError, setProductosOrdenCompraError] = useState('');
  const [productosValidacionError, setProductosValidacionError] = useState('');
  const [productosCantidadUnitariaError, setProductosCantidadUnitariaError] = useState('');
  const [productosDescuentoError, setProductosDescuentoError] = useState('');
  const [productosFechaVencimientoError, setProductosFechaVencimientoError] = useState('');
  const [productosPlazoPagoAdicionalError, setProductosPlazoPagoAdicionalError] = useState('');
  const [productosCanjeError, setProductosCanjeError] = useState('');
  //Category Manager
  const [selectedCategoryManagerError, setSelectedCategoryManagerError] = useState('');
  //Tipo Category Manager
  const [selectedTipoCategoryError, setSelectedTipoCategoryError] = useState('');
  // Upload -- Archivo adjunto carta.
  const [uploadError, setUploadError] = useState('');
  // Comentario
  const [comentarioError, setComentarioError] = useState('');


  useEffect(() => {
    dispatch(
      getProductosByCarta(authUser.empresaCodigo, currentCarta.ccvId, filterOptions, debouncedSearchOrdenesCompraTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchOrdenesCompraTerm);
        setProductosCartaFetched(true);
      }),
    );

    dispatch(
      getCategoryByLogin(authUser.empresaCodigo, currentCarta.ccvCategoryLoginId, filterOptions, debouncedSearchOrdenesCompraTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchOrdenesCompraTerm);
        setCategoryCartaFetched(true);
      }),
    );
  }, []);


  const cargarProductos = () => {

  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = productosOrdenCompra.map(n => n.codigoProducto);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //const isSelected = id => selected.indexOf(id) !== -1;
  const handleRowClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const filterByProductId = (arr, id) => {
    return arr.filter(producto => producto.productoId !== id)
  }

  const filterById = (arr, id) => {
    // Avoid filter for empty string
    if (!id) {
      return arr;
    }

    const filteredCars = arr.filter(
      (producto) => {
        console.log(producto.productoId);
        producto.productoId.split(" ").indexOf(id) !== -1
      }
    );
    return arr;
  };



  const handleRowChange = (value, id, column) => {
    //Almacena los datos de lote, cantidad unitaria, decuento, fecha vencimiento, plazo de pago adicional, y canje de los productos para posterior validacion.
    let updatedItemArray = [];
    let newItem = {
      productoId: id,
      value: value,
    };
    if (column === "validacionCM") {
      //respalda datos de lote
      var array = [...productosValidacion];
      if (array.length !== 0) {
        const filtered = array.filter(producto => {
          return producto.prodId !== id;
        });

        array = filtered;
      }

      // add item actualizado Lote
      if (array.length !== 0) {
        updatedItemArray = [...array, newItem];
      } else {
        updatedItemArray = [newItem];
      }
      setProductosValidacion(updatedItemArray);
    }
  };

  const onSubmitClick = (e) => {
    //Validaciones previas el registro de una carta corto vence.

    let createOrUpdate = true;
    let erroresDispatch = '';


    if (!comentarioCarta) {
      setComentarioError(<IntlMessages id="users.appModule.requiredMessage" />);
      //setTimeout(() => {
      //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.comentario" />));
      setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.comentario" />);
      setSnackbarSeverity('error')
      setSnackbarOpen(true);
      //}, 2000);         
      createOrUpdate = false;
    }
    // Valida aprobacion o rechazo de productos (alfanumerico)
    if (productosValidacion.length === 0) {
      //setTimeout(() => {
      //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.productosLotes" />));
      setSnackbarMessage(<IntlMessages id="validarCartas.editCreate.dataRequired.productos" />);
      setSnackbarSeverity('error')
      setSnackbarOpen(true);
      //}, 1000);
      createOrUpdate = false;
    } else {
      //revisa que todos los productos tengan ingresada la validacion.
      let validaProducto = false;
      let estadoFinal = false;
      for (const productos of productosCarta) {
        let prodId = productos.prodId;
        for (const item of productosValidacion) {
          if (item.productoId === prodId) {
            validaProducto = true;
            break;
          }
        }
        //)
        if (!validaProducto) {
          break;
        }
      }
      //)

      if (!validaProducto) {
        createOrUpdate = false;
        //setTimeout(() => {
        //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.productosLotes" />));
        setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.productosLotes" />);
        setSnackbarSeverity('error')
        setSnackbarOpen(true);
        //}, 1000);
      }

    }

    // Valida pdf Carta (alfanumerico)
    /*       if (!fileCCV) {
            createOrUpdate = false;
            setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.carta" />);
            setSnackbarSeverity('error')
            setSnackbarOpen(true);
          } */
    /*  } */
    if (createOrUpdate) {
      setOpenConfirmSaveCartaDialog(true)
      //onCartaSave();
    }
  };

  const onCartaSave = () => {

    let ccvProductos = [];
    let obj = {};
    for (const productos of productosCarta) {
      obj = {};
      obj['prodEmpresaId'] = 1;
      obj['prodOrdenCompra'] = currentCarta.ccvOrdenCompra;
      obj['prodCcvId'] = Number(currentCarta.ccvId);
      obj['prodId'] = productos.prodId;
      for (const item of productosValidacion) {
        //obj['prodLote']                 =0;                
        if (item.productoId === productos.prodId) {
          if (item.value === 0) {
            obj['prodAprobacionParcial'] = 2;
            obj['prodMotivoRechazoParcial'] = 'APROBADO';
          } else if (item.value === 1) {
            obj['prodAprobacionParcial'] = 3;
            obj['prodMotivoRechazoParcial'] = 'MUY CORTO VENCIMIENTO';
          } else if (item.value === 2) {
            obj['prodAprobacionParcial'] = 3;
            obj['prodMotivoRechazoParcial'] = 'BAJO DESCUENTO';
          } else if (item.value === 3) {
            obj['prodAprobacionParcial'] = 3;
            obj['prodMotivoRechazoParcial'] = 'SIN CANJE';
          } else if (item.value === 4) {
            obj['prodAprobacionParcial'] = 3;
            obj['prodMotivoRechazoParcial'] = 'STOCK SUFICIENTE';
          } else if (item.value === 5) {
            obj['prodAprobacionParcial'] = 3;
            obj['prodMotivoRechazoParcial'] = 'OTROS';
          }
        }
      }

      ccvProductos.push(obj);

    }

    //Determina el estado de la carta
    let estadoFinalAprobado = false;
    let estadoFinalRechazado = false;
    let estadoFinal = 0;
    for (const item of productosValidacion) {
      if (item.value === 0) {
        estadoFinalAprobado = true;
      }
      if (item.value > 0) {
        estadoFinalRechazado = true;
      }
    }

    if (estadoFinalAprobado === true && estadoFinalRechazado === false) {
      estadoFinal = 2;
    } else if (estadoFinalAprobado === false && estadoFinalRechazado === true) {
      estadoFinal = 3;
    } else if (estadoFinalAprobado === true && estadoFinalRechazado === true) {
      estadoFinal = 4;
    }

    const ccvCarta = {
      ccvId: currentCarta.ccvId,
      ccvEmpresaId: 1,
      ccvComentario: `${currentCarta.ccvComentario + ' ' + comentarioCarta}`,
      ccvEstado: estadoFinal,
      ccvCategoryLoginId: authUser.user,
      productos: ccvProductos,
    };



    if (ccvCarta) {
      dispatch(
        validarCarta(currentCarta.ccvId, ccvCarta, () => {
          onCloseDialog();
        }),
      );
    }
  };


  const handleProductosOrdenCompraDelete = productosOrdenCompraDeleted => {
    //Borra los datos de lote, cantidad unitaria, decuento, fecha vencimiento, plazo de pago adicional, y canje de los productos eliminados del listado.
    //respalda datos de lote antes de filtrarm los productos borrados
  };

  const handleFileUpload = (e) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const { name, size, type } = file;
    setFileCCV(file);
    setFilename(name);
    setFileSize(size);
    setFileContentType(type);
  };

  const handleCancelSaveCarta = () => {
    setOpenConfirmSaveCartaDialog(false);
  };

  const handleConfirmSaveCarta = () => {
    setOpenConfirmSaveCartaDialog(false);
    onCartaSave();
  }


  const isSelected = id => selected.indexOf(id) !== -1;

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot} maxWidth='xl'>
        <DialogTitle className={classes.dialogTitleRoot}>
          <IntlMessages id="validarCartas.cartaDetailview.label.title" values={{ code: currentCarta.ccvId }} />
        </DialogTitle>
        <DialogContent dividers>
          <div className={classes.root}>
            <Paper className={classes.paper}>
              <Card className={classes.root}>
                <CardHeader className={classes.dialogTitleRoot} title={<IntlMessages id="validarCartas.cartaDetailview.labelOC.title" values={{ code: currentCarta.ccvOrdenCompra }} />} />
                <CardContent>
                  <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" mb={{ xs: 6, md: 5 }}>
                    <GridContainer spacing={2}>
                      <Grid item xs={12} sm={12} >
                        <TextField
                          fullWidth
                          variant="outlined"
                          label={<IntlMessages id="cartas.editCreate.label.estadoCarta" />}
                          value={currentCarta.ccvEstado === 1 ? 'Recepcionada' : (currentCarta.ccvEstado === 2 ? 'Aprobada' : (currentCarta.ccvEstado === 3 ? 'Rechazada' : 'Aprobada Parcial'))}
                          editable="false"
                        />
                      </Grid>
                    </GridContainer>
                  </Box>
                </CardContent>
              </Card>
            </Paper>
            <Paper className={classes.paper}>
              <Card className={classes.root}>
                <CardHeader className={classes.dialogTitleRoot} title="Detalles de la Carta" />
                <CardContent>
                  <ValidarCartaTableToolbar
                    selected={selected}
                    setSelected={setSelected}
                    //onUserAdd={setOpenUserDialog}
                    //filterOptions={filterOptions}
                    //setFilterOptions={setFilterOptions}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  //onProductoOrdenCompraDelete={handleProductosOrdenCompraDelete}
                  />
                  <TableContainer className={classes.container}>
                    <Table stickyHeader className={classes.table} aria-labelledby="tableTitle" aria-label="sticky enhanced table">
                      <ValidarCartaTableHead
                        classes={classes}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={productosCarta.length}
                      />
                      <TableBody>
                        {!!productosCarta.length ? (
                          stableSort(productosCarta, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                              <ValidarCartaListRow
                                key={index}
                                row={row}
                                onRowClick={handleRowClick}
                                onRowChange={handleRowChange}
                                //onCartaProductoDelete={handleProductoOrdenCompraDelete}
                                isSelected={isSelected}
                              />
                            ))
                        ) : (
                          <TableRow style={{ height: 53 * 6 }}>
                            <TableCell colSpan={14} rowSpan={10}>
                              {isFilterApplied ? (
                                <NoRecordFound>
                                  {<IntlMessages id="cartas.appModule.filterNoRecordsFound" />}
                                </NoRecordFound>
                              ) : (
                                <NoRecordFound>
                                  {productosOrdenCompraFetched ? (
                                    <IntlMessages id="cartas.appModule.noRecordsFound" />
                                  ) : (
                                    <IntlMessages id="cartas.appModule.loadingReport" />
                                  )}
                                </NoRecordFound>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 20, 50]}
                    component="div"
                    count={productosOrdenCompra.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                  />
                </CardContent>
              </Card>
            </Paper>
            <Paper className={classes.paper}>
              <Card className={classes.root}>
                <CardHeader className={classes.dialogTitleRoot} title="Otros Datos" />
                <CardContent>
                  <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" mb={{ xs: 6, md: 5 }}>
                    <GridContainer>
                      <Grid item xs={12} sm={6}>

                        {!!currentCategoryManager ? (
                          <TextField
                            fullWidth
                            variant="outlined"
                            label={<IntlMessages id="cartas.editCreate.label.categoryManager" />}
                            value={(currentCategoryManager.nombres != null ? currentCategoryManager.nombres : '') + ' ' + (currentCategoryManager.aPaterno != null ? currentCategoryManager.aPaterno : '') + ' ' + (currentCategoryManager.aMaterno != null ? currentCategoryManager.aMaterno : '')}
                            editable="false"
                          />
                        ) : (

                          <TextField
                            fullWidth
                            variant="outlined"
                            label={<IntlMessages id="cartas.editCreate.label.categoryManager" />}
                            value=""
                            editable="false"
                          />
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          label={<IntlMessages id="cartas.editCreate.label.rutProveedor" />}
                          value={currentCarta.ccvCategoryRutEmpresa}
                          editable="false"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          label={<IntlMessages id="cartas.editCreate.label.emailCategoryManager" />}
                          value={currentCarta.ccvCategoryEmail}
                          editable="false"

                        />

                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          label={<IntlMessages id="cartas.editCreate.label.tipoCategoryManager" />}
                          value={currentCarta.ccvCategoryTipo === 1 ? 'Pharma' : 'Consumo'}
                          editable="false"

                        />

                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          // id="comentario"
                          //label={"Text Value"}
                          fullWidth
                          variant="outlined"
                          label={<IntlMessages id="validarCartas.editCreate.label.comentarioProveedor" />}
                          //defaultValue={''}
                          value={currentCarta.ccvComentario}
                          editable="false"
                          helperText={comentarioError}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          // id="comentario"
                          //label={"Text Value"}
                          fullWidth
                          variant="outlined"
                          label={<IntlMessages id="validarCartas.editCreate.label.comentarioCategoryManager" />}
                          //defaultValue={''}
                          value={comentarioCarta}
                          editable="true"
                          helperText={comentarioError}
                          onChange={(event) => {
                            setComentarioCarta(event.target.value);
                            setComentarioError('');
                          }}
                        // ref={node => (this.inputNode = node)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {(currentCarta.ccvArchivoLink != null && currentCarta.ccvArchivoLink != '') ? (
                          <>
                            <Button variant='contained' component="label" startIcon={<GetAppIcon />}>
                              <a href={currentCarta.ccvArchivoLink} target="_blank" download>
                                Descargar Carta Corto Vence
                              </a>
                            </Button>
                            <Box>
                            </Box>
                            <Box>{filename}</Box>
                          </>
                        ) : (
                          <TextField
                            // id="comentario"
                            label={<IntlMessages id="validarCartas.cartaDetailview.label.sincronizacion" />}
                            fullWidth
                            variant="outlined"
                            //defaultValue={''}
                            value=''
                            editable="false"
                          />
                        )}

                      </Grid>
                    </GridContainer>
                  </Box>
                </CardContent>
              </Card>
            </Paper>
          </div>
          <Box display="flex" justifyContent="flex-end" mb={4}>
            <Button onClick={onCloseDialog}>
              {/*  Cancelar */}
              <IntlMessages id="validarCartas.detailView.button.close" />
            </Button>
            <Box ml={2}>
              <Button variant="contained" color="primary" onClick={onSubmitClick}>
                <IntlMessages id="validarCartas.editCreate.button.create" />
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={openConfirmSaveCartaDialog}
        title={<IntlMessages id="validarCartas.editCreate.confirmSaveCarta" />}
        content={<IntlMessages id="validarCartas.editCreate.confirmSaveCartaContent" />}
        onClose={handleCancelSaveCarta}
        onConfirm={handleConfirmSaveCarta}
      />
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} message={snackbarMessage} anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }} />

    </React.Fragment>

  );
};

export default ValidarCartaDetailView;

ValidarCartaDetailView.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func
};
