import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SamplePage from './Pages/SamplePage';
import Error404 from './Pages/404';
import Login from './Auth/Login';
//import Register from './Auth/Register';
//import ForgotPasswordPage from './Auth/ForgotPassword';
// import Admin from './Admin';
import UsersModule from './Admin/Users';
import RolesModule from './Admin/Roles';
import AplicacionesModule from './Admin/Aplicaciones';
import ProveedoresModule from './Admin/Proveedores';
import CategoryManagersModule from './Admin/CategoryManagers';
import CartasModule from './Pages/Cartas';
import ValidarCartasModule from './Pages/ValidarCartas';
import BuscadorCartasModule from './Pages/BuscadorCartas';


const RestrictedRoute = ({ component: Component, ...rest }) => {
  const { authUser } = useSelector(({ auth }) => auth);
  return (
    <Route
      {...rest}
      render={props =>
        authUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

const Routes = () => {
  const { authUser } = useSelector(({ auth }) => auth);
  const location = useLocation();

  if (location.pathname === '' || location.pathname === '/') {
    return <Redirect to={'/sample-page'} />;
  } else if (authUser && location.pathname === '/signin') {
    return <Redirect to={'/sample-page'} />;
  } 
/*   else if (!authUser){
     return <Redirect to={'/signin'} />;
 }  */

  return (
    <React.Fragment>
      <Switch>
        <RestrictedRoute path="/sample-page" component={SamplePage} />
        <Route path="/signin" component={Login} />
{/*     <Route path="/signup" component={Register} />
        <Route path="/forgot-password" component={ForgotPasswordPage} /> */}
        <RestrictedRoute path="/admin/users" component={UsersModule} />
        <RestrictedRoute path="/admin/aplicaciones" component={AplicacionesModule} />
        <RestrictedRoute path="/admin/roles" component={RolesModule} />
        <RestrictedRoute path="/admin/proveedores" component={ProveedoresModule} />
        <RestrictedRoute path="/admin/categoryManagers" component={CategoryManagersModule} />
        <RestrictedRoute path="/applications/cartas" component={CartasModule} /> 
        <RestrictedRoute path="/applications/validarCartas" component={ValidarCartasModule} /> 
        <RestrictedRoute path="/applications/buscarCartas" component={BuscadorCartasModule} /> 
        <Route component={Error404} />
      </Switch>
    </React.Fragment>
  );
};

export default Routes;
