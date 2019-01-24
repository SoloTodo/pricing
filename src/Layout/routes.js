import React from 'react'
import Layout from './Layout';
import PasswordChange from "../views/Pages/PasswordChange";
import StoreList from "../views/Pages/StoreList";
import StoreDetail from "../views/Pages/StoreDetail";
import StoreDetailUpdateLogs from "../views/Pages/StoreDetailUpdateLogs"
import ResourceObjectPermission from "../react-utils/components/ResourceObjectPermission";
import RequiredResources from "../react-utils/components/RequiredResources"

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: Layout },
  { path: '/account/password_change', exact: true, name: 'Cambiar contraseña', component: PasswordChange },
  { path: '/stores', exact: true, name: 'Tiendas', component: StoreList },
  { path: '/stores/:id', exact: true, name: 'Detalle', render: props => <ResourceObjectPermission match={props.match} resource="stores" component={StoreDetail} />},
  { path: '/stores/:id/update_logs', exact: true, name: 'Registros de actualización', render: props => <RequiredResources resources={['categories']}>
      <ResourceObjectPermission match={props.match} resource="stores" permission="view_store_update_logs" component={StoreDetailUpdateLogs} />
  </RequiredResources>}
];

export default routes;
