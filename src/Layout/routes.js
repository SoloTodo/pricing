import Layout from './Layout';
import PasswordChange from "../views/Pages/PasswordChange";

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: Layout },
  { path: '/account/password_change', exact:true, name: 'Cambiar Contraseña', component: PasswordChange }
];

export default routes;
