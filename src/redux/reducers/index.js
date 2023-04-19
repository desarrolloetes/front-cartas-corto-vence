import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import Common from './Common';
import Auth from './Auth';
import Users from './Users';
import Roles from './Roles';
import Cartas from './Cartas';
import OrdenesCompra from './OrdenesCompra';
import CategoryManagers from './CategoryManagers';
import Proveedores from './Proveedores';
import Aplicaciones from './Aplicaciones';
import Empresas from './Empresas';

export default history =>
  combineReducers({
    router: connectRouter(history),
    common: Common,
    auth: Auth,
    usersReducer: Users,
    rolesReducer: Roles,
    cartasReducer: Cartas,
    ordenesCompraReducer: OrdenesCompra,
    categoryManagersReducer: CategoryManagers,
    proveedoresReducer: Proveedores,
    aplicacionesReducer: Aplicaciones,
    empresasReducer: Empresas
  });
