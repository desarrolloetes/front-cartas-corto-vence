import React, { useEffect, useState, ChangeEvent } from 'react';
import { Paper, Table, TableCell, TableContainer, TableRow, Select, Snackbar, Alert } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import AddEditCartaListRow from './AddEditCartaListRow';
import AddEditCartaTableHead from './AddEditCartaTableHead';
import AddEditCartaTableToolbar from './AddEditCartaTableToolbar';
import { getComparator, stableSort } from '../../../../@jumbo/utils/tableHelper';
import { useDispatch, useSelector } from 'react-redux';
import { getProductosOrdenCompraByRutProveedor, getOrdenesCompraByRutProveedor, deleteProductoOrdenCompra } from '../../../../redux/actions/OrdenesCompra';
import { getCategoryManagersByEmpresa, setCurrentCategoryManager, getCategoryByLogin } from '../../../../redux/actions/CategoryManagers';
import { getProductosByCarta } from '../../../../redux/actions/Cartas';
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


const CartaDetailView = ({ open, onCloseDialog }) => {

  const currentCarta = useSelector(({ cartasReducer }) => cartasReducer.currentCarta);
  const productosCarta = useSelector(({ cartasReducer }) => cartasReducer.productosCarta);
  const currentCategoryManager = useSelector(({ categoryManagersReducer }) => categoryManagersReducer.currentCategoryManager);

  //Mensaje de Error con SnackBar

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [snackbarMessage, setSnackbarMessage] = useState(undefined);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Table Data 
  const [productosLote, setProductosLote] = useState([]);
  const [productosCantidadUnitaria, setProductosCantidadUnitaria] = useState([]);
  const [productosDescuento, setProductosDescuento] = useState([]);
  const [productosFechaVencimiento, setProductosFechaVencimiento] = useState([]);
  const [productosPlazoPagoAdicional, setProductosPlazoPagoAdicional] = useState([]);
  const [productosCanje, setProductosCanje] = useState([]);

  const classes = useStyles();

  //Usuario Autorizado  
  const { authUser } = useSelector(({ auth }) => auth);


  //Productos Ordenes Compra 
  const { productosOrdenCompra } = useSelector(({ ordenesCompraReducer }) => ordenesCompraReducer);
  const [productosOrdenCompraFetched, setProductosOrdenCompraFetched] = useState(true);
  const [openConfirmProductosOrdenCompraDialog, setOpenConfirmProductosOrdenCompraDialog] = useState(false);

  //Ordenes Compra  
  const { ordenesCompra } = useSelector(({ ordenesCompraReducer }) => ordenesCompraReducer);
  const debouncedSearchOrdenesCompraTerm = useDebounce(searchOrdenesCompraTerm, 500);
  const [searchOrdenesCompraTerm, setSearchOrdenesCompraTerm] = useState('');
  const [ordenesCompraFetched, setOrdenesCompraFetched] = useState(false);
  const [selectedOrdenCompra, setSelectedOrdenCompra] = useState(null);
  const [productosCartaFetched, setProductosCartaFetched] = useState(false);
  const [categoryCartaFetched, setCategoryCartaFetched] = useState(false);
  //const [selectedOrdenCompraText, setSelectedOrdenCompraText] = useState(null);

  //Category Managers
  const { categoryManagers } = useSelector(({ categoryManagersReducer }) => categoryManagersReducer);
  // const currentCategoryManager = useSelector(({ categoryManagersReducer }) => categoryManagersReducer);
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
  const [productosLoteError, setProductosLoteError] = useState('');
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

  const handleCancelProductosOrdenCompra = () => {
    setOpenConfirmProductosOrdenCompraDialog(false);
  };

  const handleConfirmProductosOrdenCompra = () => {
    //setProductosOrdenCompra( []);
    setCategoryManagerText(null);
    setRutProveedorCategoryManager('');
    setEmailCategoryManager('');
    setComentarioCarta('');
    setSelectedTipoCategory('');

    let checkInputData = true;
    if (selectedOrdenCompra === null) {
      dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.numeroOrden" />));
      checkInputData = false;
    }

    if (checkInputData === true) {
      dispatch(
        getProductosOrdenCompraByRutProveedor(
          authUser.empresaCodigo,
          selectedOrdenCompra,
          authUser.rutEmpresa,
          filterOptions,
          debouncedSearchTerm,
          () => {
            setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
            setProductosOrdenCompraFetched(true);

          },
        ),
      );
    }

    setOpenConfirmProductosOrdenCompraDialog(false);


  };

  const handleOnSubmitOrdenCompraSelectedClick = event => {
    let checkInputData = true;
    if (selectedOrdenCompra === null) {
      dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.numeroOrden" />));
      checkInputData = false;
    }
    if (productosOrdenCompra.length > 0) {
      setOpenConfirmProductosOrdenCompraDialog(true);
      checkInputData = false;
    }
    if (checkInputData === true) {
      dispatch(
        getProductosOrdenCompraByRutProveedor(
          authUser.empresaCodigo,
          selectedOrdenCompra,
          authUser.rutEmpresa,
          filterOptions,
          debouncedSearchTerm,
          () => {
            setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
            setProductosOrdenCompraFetched(true);

          },
        ),
      );

    }
  };

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
        producto.productoId.split(" ").indexOf(id) !== -1
      }
    );
    return arr;
  };



  const handleRowChange = (value, id, column) => {
    //Almacena los datos de lote, cantidad unitaria, decuento, fecha vencimiento, plazo de pago adicional, y canje de los productos para posterior validacion.
    //const selectedIndex = selected.indexOf(id);
    let updatedItemArray = [];
    let newItem = {
      productoId: id,
      value: value,
    };
    if (column === "lote") {
      //respalda datos de lote
      var array = [...productosLote];
      if (array.length !== 0) {
        const filtered = array.filter(producto => {
          return producto.productoId !== id;
        });

        array = filtered;
      }

      // add item actualizado Lote
      if (array.length !== 0) {
        updatedItemArray = [...array, newItem];
      } else {
        updatedItemArray = [newItem];
      }
      setProductosLote(updatedItemArray);
    } else if (column === "cantidadUnitaria") {
      //respalda datos de cantidades unitarias
      var array = [...productosCantidadUnitaria];
      if (array.length !== 0) {
        const filtered = array.filter(producto => {
          return producto.productoId !== id;
        });

        array = filtered;
      }

      // add item actualizado   cantidad unitaria 
      if (array.length !== 0) {
        updatedItemArray = [...array, newItem];
      } else {
        updatedItemArray = [newItem];
      }
      setProductosCantidadUnitaria(updatedItemArray);
    } else if (column === "descuento") {
      //respalda items de descuento
      var array = [...productosDescuento];
      if (array.length !== 0) {
        const filtered = array.filter(producto => {
          return producto.productoId !== id;
        });

        array = filtered;
      }

      // add item actualizado descuento 
      if (array.length !== 0) {
        updatedItemArray = [...array, newItem];
      } else {
        updatedItemArray = [newItem];
      }
      setProductosDescuento(updatedItemArray);
    } else if (column === "fechaVencimientoLote") {
      //respalda items fecha vencimiento
      var array = [...productosFechaVencimiento];
      if (array.length !== 0) {
        const filtered = array.filter(producto => {
          return producto.productoId !== id;
        });

        array = filtered;
      }

      // add item actualizado  fecha vencimiento  
      if (array.length !== 0) {
        updatedItemArray = [...array, newItem];
      } else {
        updatedItemArray = [newItem];
      }
      setProductosFechaVencimiento(updatedItemArray);
    } else if (column === "plazoPagoAdicional") {
      //respalda items plazo pago adicional
      var array = [...productosPlazoPagoAdicional];
      if (array.length !== 0) {
        const filtered = array.filter(producto => {
          return producto.productoId !== id;
        });

        array = filtered;
      }

      // add item actualizado    
      if (array.length !== 0) {
        updatedItemArray = [...array, newItem];
      } else {
        updatedItemArray = [newItem];
      }
      setProductosPlazoPagoAdicional(updatedItemArray);
    } else if (column === "canje") {
      //respalda items asociados a canje
      var array = [...productosCanje];
      if (array.length !== 0) {
        const filtered = array.filter(producto => {
          return producto.productoId !== id;
        });

        array = filtered;
      }

      // add item canje actualizado    
      if (array.length !== 0) {
        updatedItemArray = [...array, newItem];
      } else {
        updatedItemArray = [newItem];
      }
      setProductosCanje(updatedItemArray);
    }

  };

  const onSubmitClick = (e) => {
    //Validaciones previas el registro de una carta corto vence.

    let createOrUpdate = true;
    let erroresDispatch = '';

    //dispatch(fetchError("prueba<br />prueba2"));
    if (!selectedOrdenCompra) {
      setSelectedOrdenCompraError(<IntlMessages id="cartas.editCreate.requiredMessage" />);
      //erroresDispatch = "Seleccione Orden de Compra y Cargue productos al detalle de la carta." 
      //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.numeroOrden" />));
      setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.numeroOrden" />);
      setSnackbarSeverity('error')
      setSnackbarOpen(true);
      createOrUpdate = false;
    } else {
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
      // if (!uploadFile) {
      //   setEmailError(<IntlMessages id="users.appModule.requiredMessage" />);
      //   createOrUpdate = false;
      // }    
      if (!selectedTipoCategory) {
        setSelectedTipoCategoryError(<IntlMessages id="users.appModule.requiredMessage" />);
        //setTimeout(() => {
        //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.tipoCategoryManager" />));
        setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.tipoCategoryManager" />);
        setSnackbarSeverity('error')
        setSnackbarOpen(true);
        //}, 3000);         
        createOrUpdate = false;
      }

      if (!selectedCategoryManager) {
        setSelectedCategoryManagerError(<IntlMessages id="cartas.editCreate.requiredMessage" />);
        //setTimeout(() => {
        //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.categoryManager" />));
        setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.categoryManager" />);
        setSnackbarSeverity('error')
        setSnackbarOpen(true);
        // }, 3000);          
        createOrUpdate = false;
      }

      if (productosOrdenCompra.length === 0) {
        setProductosOrdenCompraError(<IntlMessages id="cartas.editCreate.requiredMessage" />);
        //erroresDispatch = "No existen Productos en el detalle de la Carta. Seleccione Orden de Compra y cargue productos al detalle de la carta." 
        //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.productosOrdenCompra" />));
        setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.productosOrdenCompra" />);
        setSnackbarSeverity('error')
        setSnackbarOpen(true);
        createOrUpdate = false;
      } else {



        // Valida FechaVencimiento (Date)
        if (productosFechaVencimiento.length === 0) {
          //setTimeout(() => {
          //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.productosFechasVencimiento" />));
          setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.productosFechasVencimiento" />);
          setSnackbarSeverity('error')
          setSnackbarOpen(true);
          //}, 1000);             
          createOrUpdate = false;
        } else {

          // Valida Plazo Pago Adicional (Numerico)
          if (productosPlazoPagoAdicional.length === 0) {
            //setTimeout(() => {
            // dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.productosPlazoPagoAdicional" />));
            setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.productosPlazoPagoAdicional" />);
            setSnackbarSeverity('error')
            setSnackbarOpen(true);
            //}, 1000);            

            createOrUpdate = false;
          } else {
            // Valida Canje (Numerico)
            if (productosCanje.length === 0) {
              //setTimeout(() => {
              //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.productosCanjes" />));
              setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.productosCanjes" />);
              setSnackbarSeverity('error')
              setSnackbarOpen(true);
              //}, 1000);              

              createOrUpdate = false;
            } else {
              //Validar que todos los productos tengan ingresados el Canje.
              let validaCanje = false;
              //productosOrdenCompra.forEach((productos) => {
              for (const productos of productosOrdenCompra) {
                let prodId = productos.codigoProducto;
                validaCanje = false;
                //productosLote.forEach((lote) => {
                for (const canje of productosCanje) {
                  if (canje.productoId == prodId) {
                    validaCanje = true;
                    break;
                  }
                }
                //)
                if (!validaCanje) {
                  break;
                }
              }
              //)

              if (!validaCanje) {
                createOrUpdate = false;
                //setTimeout(() => {
                //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.productosCanjes" />));
                setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.productosCanjes" />);
                setSnackbarSeverity('error')
                setSnackbarOpen(true);
                //}, 1000);
              }
            }
            //Validar que todos los productos tengan ingresados el plazo de pago adicioal.
            let validaPlazoPago = false;
            //productosOrdenCompra.forEach((productos) => {
            for (const productos of productosOrdenCompra) {
              let prodId = productos.codigoProducto;
              validaPlazoPago = false;
              //productosLote.forEach((lote) => {
              for (const plazoPago of productosPlazoPagoAdicional) {
                if (plazoPago.productoId == prodId && plazoPago.value != '' && Number(plazoPago.value) >= 0) {
                  validaPlazoPago = true;
                  break;
                }
              }
              //)
              if (!validaPlazoPago) {
                break;
              }
            }
            //)

            if (!validaPlazoPago) {
              createOrUpdate = false;
              //setTimeout(() => {
              //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.productosPlazoPagoAdicional" />));
              setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.productosPlazoPagoAdicional" />);
              setSnackbarSeverity('error')
              setSnackbarOpen(true);
              //}, 1000);
            }
          }
          //Validar que todos los productos tengan ingresada la fecha de vencimiento.
          let validaFechaVencimiento = false;
          //productosOrdenCompra.forEach((productos) => {
          for (const productos of productosOrdenCompra) {
            let prodId = productos.codigoProducto;
            validaFechaVencimiento = false;
            //productosLote.forEach((lote) => {
            for (const fechaVencimiento of productosFechaVencimiento) {
              if (fechaVencimiento.productoId == prodId && fechaVencimiento.value != '') {
                validaFechaVencimiento = true;
                break;
              }
            }
            //)
            if (!validaFechaVencimiento) {
              break;
            }
          }
          //)

          if (!validaFechaVencimiento) {
            createOrUpdate = false;
            //setTimeout(() => {
            //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.productosFechasVencimiento" />));
            setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.productosFechasVencimiento" />);
            setSnackbarSeverity('error')
            setSnackbarOpen(true);
            //}, 1000);
          }
        }
        // Valida Descuento (Numerico)
        if (productosDescuento.length === 0) {
          //setTimeout(() => {
          //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.productosDescuentos" />));
          setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.productosDescuentos" />);
          setSnackbarSeverity('error')
          setSnackbarOpen(true);
          //}, 1000);              
          createOrUpdate = false;
        } else {
          //Validar que todos los productos tengan ingresados los descuentos.
          let validaDescuento = false;
          //productosOrdenCompra.forEach((productos) => {
          for (const productos of productosOrdenCompra) {
            let prodId = productos.codigoProducto;
            validaDescuento = false;
            //productosLote.forEach((lote) => {
            for (const descuento of productosDescuento) {
              if (descuento.productoId == prodId && descuento.value != '' && Number(descuento.value) >= 0) {
                validaDescuento = true;
                break;
              }
            }
            //)
            if (!validaDescuento) {
              break;
            }
          }
          //)

          if (!validaDescuento) {
            createOrUpdate = false;
            //setTimeout(() => {
            //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.productosDescuentos" />));
            setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.productosDescuentos" />);
            setSnackbarSeverity('error')
            setSnackbarOpen(true);
            //}, 1000);
          }
        }
        // Valida Cantidad Unitaria (Numerico)
        if (productosCantidadUnitaria.length === 0) {
          console.log("Ingrese Cantidades Unitarias");
          //setTimeout(() => {
          //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.productosCantidadesUnitarias" />));
          setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.productosCantidadesUnitarias" />);
          setSnackbarSeverity('error')
          setSnackbarOpen(true);
          //}, 1000);            
          createOrUpdate = false;
        } else {
          //Validar que todos los productos tengan ingresada la cantidad Unitaria.
          let validaCantidadUnitaria = false;
          //productosOrdenCompra.forEach((productos) => {
          for (const productos of productosOrdenCompra) {
            let prodId = productos.codigoProducto;
            validaCantidadUnitaria = false;
            //productosLote.forEach((lote) => {
            for (const cantidadUnitaria of productosCantidadUnitaria) {
              if (cantidadUnitaria.productoId == prodId && cantidadUnitaria.value != '' && Number(cantidadUnitaria.value) >= 0) {
                validaCantidadUnitaria = true;
                break;
              }
            }
            //)
            if (!validaCantidadUnitaria) {
              break;
            }
          }
          //)

          if (!validaCantidadUnitaria) {
            createOrUpdate = false;
            //setTimeout(() => {
            //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.productosCantidadesUnitarias" />));
            setSnackbarSeverity('error')
            setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.productosCantidadesUnitarias" />);
            setSnackbarOpen(true);
            //}, 1000);
          }
        }
        // Valida Lote (alfanumerico)
        if (productosLote.length === 0) {
          console.log("Ingrese Lotes");
          //setTimeout(() => {
          //dispatch(fetchError(<IntlMessages id="cartas.editCreate.dataRequired.productosLotes" />));
          setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.productosLotes" />);
          setSnackbarSeverity('error')
          setSnackbarOpen(true);
          //}, 1000);
          createOrUpdate = false;
        } else {
          //Validar que todos los productos tengan ingresado el lote.
          let validaLote = false;
          //productosOrdenCompra.forEach((productos) => {
          for (const productos of productosOrdenCompra) {
            let prodId = productos.codigoProducto;
            validaLote = false;
            //productosLote.forEach((lote) => {
            for (const lote of productosLote) {
              if (lote.productoId == prodId && lote.value != '') {
                validaLote = true;
                break;
              }
            }
            //)
            if (!validaLote) {
              break;
            }
          }
          //)

          if (!validaLote) {
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
        if (!fileCCV) {
          createOrUpdate = false;
          setSnackbarMessage(<IntlMessages id="cartas.editCreate.dataRequired.carta" />);
          setSnackbarSeverity('error')
          setSnackbarOpen(true);
        }
      }


    }
    if (createOrUpdate) {
      onCartaSave();
    }
  };

  const onCartaSave = () => {

    let ccvProductos = [];
    let obj = {};
    for (const productos of productosOrdenCompra) {
      obj['prodOrdenCompra'] = selectedOrdenCompra;
      obj['prodSku'] = Number(productos.codigoProducto);
      obj['prodDescripcion'] = productos.descripcion;
      for (const lote of productosLote) {
        //obj['prodLote']                 =0;                
        if (lote.productoId == productos.codigoProducto) {
          obj['prodLote'] = lote.value;
        }
      }

      for (const cantidadUnitaria of productosCantidadUnitaria) {
        //obj['prodCantidadUnidades']                 =0;                
        if (cantidadUnitaria.productoId == productos.codigoProducto) {
          obj['prodCantidadUnidades'] = Number(cantidadUnitaria.value);
        }
      }

      for (const descuento of productosDescuento) {
        //obj['prodDescuento']                 =0;                
        if (descuento.productoId == productos.codigoProducto) {
          obj['prodDescuento'] = Number(descuento.value);
        }
      }

      for (const fechaVencimiento of productosFechaVencimiento) {
        //obj['prodFechaVence']                 =0;                
        if (fechaVencimiento.productoId == productos.codigoProducto) {
          obj['prodFechaVence'] = fechaVencimiento.value;
        }
      }

      for (const plazoPago of productosPlazoPagoAdicional) {
        //obj['prodDiasPlazoPagoAd']                 =0;                
        if (plazoPago.productoId == productos.codigoProducto) {
          obj['prodDiasPlazoPagoAd'] = Number(plazoPago.value);
        }
      }

      obj['prodPromedioVentas'] = productos.promedioVentas;
      obj['prodStockCd'] = productos.stockCd;

      for (const canje of productosCanje) {
        //obj['prodCanjePorLote']                 =0;                
        if (canje.productoId == productos.codigoProducto) {
          obj['prodCanjePorLote'] = Number(canje.value);
        }
      }

      obj['prodAprobacionParcial'] = 0;
      obj['prodMotivoRechazoParcial'] = '';
      obj['prodVigente'] = 1;//productos.prodVigente;             
      obj['prodEmpresaId'] = 1;

      ccvProductos.push(obj);

    }

    let ocNumero = 0;
    let ocFechaExpiracion = null;
    for (const oc of ordenesCompra) {
      if (oc.numeroOrden == selectedOrdenCompra) {
        ocNumero = oc.numeroOrden;
        ocFechaExpiracion = oc.fechaExpiracion;
        break;
      }
    }

    const ccvCarta = {
      ccvEmpresaId: 1,
      ccvOrdenCompra: ocNumero,
      ccvFechaExpiracion: `${ocFechaExpiracion}`,
      ccvComentario: `${comentarioCarta}`,
      ccvCategoryLoginId: `${authUser.user}`,
      ccvCategoryRutEmpresa: rutProveedorCategoryManager,
      ccvCategoryEmail: `${emailCategoryManager}`,
      ccvCategoryTipo: selectedTipoCategory,
      ccvUsuarioRol: `${authUser.roles[0].usrlRolCodigo}`,
      ccvUsuarioEmail: `${authUser.user}`,
      ccvUsuarioLogin: `${authUser.user}`,
      ccvArchivoLink: '',//'https://webservices.sb.cl/cartas-corto/update/483489de-b4ca-11ea-952c-0a580a8300d8.pdf?api-key=fe1b1fea-982c-43f1-a20b-3bab1b9e8ce1', //`${userStatus}`,
      ccvArchivoNombre: `${fileCCV.name}`,
      ccvArchivoContentType: `${fileCCV.type}`, //'application/pdf', 
      ccvArchivoTamano: `${fileCCV.size}`, //'5000', `${userAddress}`, 
      ccvVigente: 1,
      ccvEstado: 1,
      productos: ccvProductos,
      archivos: [],
    };



    if (currentCarta) {

    } else {
      dispatch(
        addNewCarta(ccvCarta, fileCCV, () => {
          onCloseDialog();
        }),
      );
    }
  };


  const handleProductosOrdenCompraDelete = productosOrdenCompraDeleted => {
    //Borra los datos de lote, cantidad unitaria, decuento, fecha vencimiento, plazo de pago adicional, y canje de los productos eliminados del listado.
    //respalda datos de lote antes de filtrarm los productos borrados
    var array = [...productosLote];
    if (array.length !== 0) {
      const filtered = array.filter(
        //return producto.productoId !== id;
        producto => !productosOrdenCompraDeleted.includes(producto.productoId)
      );

      array = filtered;
    }

    // add item actualizado con Lotes eliminados
    setProductosLote(array);

    //respalda datos de cantidades unitarias antes de filtrarm los productos borrados
    var array = [...productosCantidadUnitaria];
    if (array.length !== 0) {
      const filtered = array.filter(
        producto => !productosOrdenCompraDeleted.includes(producto.productoId)
      );

      array = filtered;
    }

    // add item actualizado   cantidad unitaria 
    setProductosCantidadUnitaria(array);

    //respalda items de descuento antes de filtrarm los productos borrados 
    var array = [...productosDescuento];
    if (array.length !== 0) {
      const filtered = array.filter(
        producto => !productosOrdenCompraDeleted.includes(producto.productoId)
      );

      array = filtered;
    }

    // add item actualizado descuento 
    setProductosDescuento(array);

    //respalda items fecha vencimiento antes de filtrarm los productos borrados
    var array = [...productosFechaVencimiento];
    if (array.length !== 0) {
      const filtered = array.filter(
        producto => !productosOrdenCompraDeleted.includes(producto.productoId)
      );

      array = filtered;
    }

    // add item actualizado  fecha vencimiento  
    setProductosFechaVencimiento(array);

    //respalda items plazo pago adicional antes de filtrar los productos borrados
    var array = [...productosPlazoPagoAdicional];
    if (array.length !== 0) {
      const filtered = array.filter(
        producto => !productosOrdenCompraDeleted.includes(producto.productoId)
      );

      array = filtered;
    }

    // add item actualizado    
    setProductosPlazoPagoAdicional(array);

    //respalda items asociados a canje antes de filtrar los productos borrados
    var array = [...productosCanje];
    if (array.length !== 0) {
      const filtered = array.filter(
        producto => !productosOrdenCompraDeleted.includes(producto.productoId)
      );

      array = filtered;
    }

    // add item canje actualizado    
    setProductosCanje(array);

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


  const isSelected = id => selected.indexOf(id) !== -1;

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot} maxWidth='xl'>
        <DialogTitle className={classes.dialogTitleRoot}>
          <IntlMessages id="cartas.cartaDetailview.label.title" values={{ code: currentCarta.ccvId }} />
        </DialogTitle>
        <DialogContent dividers>
          <div className={classes.root}>
            <Paper className={classes.paper}>
              <Card className={classes.root}>
                <CardHeader className={classes.dialogTitleRoot} title={<IntlMessages id="cartas.cartaDetailview.labelOC.title" values={{ code: currentCarta.ccvOrdenCompra }} />} />
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
                  <AddEditCartaTableToolbar
                    selected={selected}
                    setSelected={setSelected}
                    //onUserAdd={setOpenUserDialog}
                    //filterOptions={filterOptions}
                    //setFilterOptions={setFilterOptions}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onProductoOrdenCompraDelete={handleProductosOrdenCompraDelete}
                  />
                  <TableContainer className={classes.container}>
                    <Table stickyHeader className={classes.table} aria-labelledby="tableTitle" aria-label="sticky enhanced table">
                      <AddEditCartaTableHead
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
                              <AddEditCartaListRow
                                key={index}
                                row={row}
                                onRowClick={handleRowClick}
                                onRowChange={handleRowChange}
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
                      <Grid item xs={12} sm={6}>
                        <TextField
                          // id="comentario"
                          //label={"Text Value"}
                          fullWidth
                          variant="outlined"
                          label={<IntlMessages id="cartas.editCreate.label.comentario" />}
                          //defaultValue={''}
                          value={currentCarta.ccvComentario}
                          editable="false"
                          helperText={comentarioError}
                        />
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
              <IntlMessages id="cartas.detailView.button.close" />
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={openConfirmProductosOrdenCompraDialog}
        title={<IntlMessages id="cartas.editCreate.confirmActualizarUpdateProductos" />}
        content={<IntlMessages id="cartas.editCreate.confirmActualizarUpdateProductoseContent" />}
        onClose={handleCancelProductosOrdenCompra}
        onConfirm={handleConfirmProductosOrdenCompra}
      />
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} message={snackbarMessage} anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }} />

    </React.Fragment>

  );
};

export default CartaDetailView;

CartaDetailView.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func
};
