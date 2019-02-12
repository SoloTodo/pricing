import React from 'react'

import PasswordChange from "../views/Pages/PasswordChange";
import StoreList from "../views/Store/StoreList";
import StoreDetail from "../views/Store/StoreDetail";
import StoreDetailUpdateLogs from "../views/Store/StoreDetailUpdateLogs"
import SkuList from "../views/Sku/SkuList"

import ResourceObjectPermission from "../react-utils/components/ResourceObjectPermission";
import RequiredResources from "../react-utils/components/RequiredResources"
import SkuDetail from "../views/Sku/SkuDetail";
import SkuDetailPricingHistory from "../views/Sku/SkuDetailPricingHistory"
import CategoryList from "../views/Category/CategoryList";
import CategoryDetailBrowse from "../views/Category/CategoryDetailBrowse";
import CategoryDetailShareOfShelves from "../views/Category/CategoryDetailShareOfShelves"
import ProductList from "../views/Product/ProductList";
import Page404 from "../views/Pages/Page404"
import ProductDetail from "../views/Product/ProductDetail";
import ProductDetailPricingHistory from "../views/Product/ProductDetailPricingHistory";
import CategoryDetail from "../views/Category/CategoryDetail";
import AlertList from "../views/Alert/AlertList";
import AlertDetail from "../views/Alert/AlertDetail"
import AlertDetailChangeHistory from "../views/Alert/AlertDetailChangeHistory"

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  //{ path: '/', exact: true, name: 'Home', component:Layout },
  { path: '/account/password_change', exact: true, name: 'Cambiar contraseña', component: PasswordChange },
  { path: '/stores', exact: true, name: 'Tiendas', component: StoreList },
  { path: '/stores/:id', exact: true, name: params => ({apiResource: 'stores', apiResourceObjectId: params.id}), render: props => <ResourceObjectPermission match={props.match} resource="stores" component={StoreDetail} />},
  { path: '/stores/:id/update_logs', exact: true, name: 'Registros de actualización', render: props => <RequiredResources resources={['categories']}>
      <ResourceObjectPermission match={props.match} resource="stores" permission="view_store_update_logs" component={StoreDetailUpdateLogs} />
  </RequiredResources>},
  { path: '/skus', exact: true, name:'SKUs', render: props => <RequiredResources resources={['categories', 'stores']}><SkuList/></RequiredResources>},
  { path: '/skus/:id', exact: true, name: params => ({apiResource: 'entities', apiResourceObjectId: params.id}), render: props => <RequiredResources resources={['stores', 'categories', 'users_with_staff_actions']}>
      <ResourceObjectPermission match={props.match} resource="entities" component={SkuDetail}/>
    </RequiredResources>},
  { path: '/skus/:id/pricing_history', exact:true, name:'Historial de precios', render: props => <RequiredResources resources={['stores']}>
      <ResourceObjectPermission match={props.match} resource="entities" component={SkuDetailPricingHistory} />
  </RequiredResources>},
  { path: '/categories', exact: true, name: 'Categorías', render: props => <RequiredResources resources={['categories']}>
      <CategoryList />
  </RequiredResources>},
  { path: '/categories/:id', exact: true, name: params => ({apiResource: 'categories', apiResourceObjectId: params.id}), component: CategoryDetail},
  { path:'/categories/:id/current_prices', exact: true, name: 'Precios actuales', render: props => <RequiredResources resources={['stores', 'countries']}>
      <ResourceObjectPermission permission='view_category_reports' Http404={Page404} match={props.match} resource="categories" component={CategoryDetailBrowse} />
  </RequiredResources>},
  { path:'/categories/:id/share_of_shelves', exact: true, name: 'Share of shelves', render: props => <RequiredResources resources={['stores', 'countries']}>
      <ResourceObjectPermission permission='view_category_share_of_shelves' Http404={Page404} match={props.match} resource="categories" component={CategoryDetailShareOfShelves} />
  </RequiredResources>},
  { path:'/products', exact: true, name: 'Productos', render: props => <RequiredResources resources={['categories']}>
      <ProductList />
  </RequiredResources>},
  { path: '/products/:id', exact: true, name: params => ({apiResource: 'products', apiResourceObjectId: params.id}), render: props => <RequiredResources resources={['categories', 'stores', 'users_with_staff_actions', 'websites']}>
      <ResourceObjectPermission match={props.match} resource="products" component={ProductDetail} />
  </RequiredResources>},
  { path: '/products/:id/pricing_history', exact: true, name: 'Historial de precios', render: props=> <RequiredResources resources={['categories', 'stores', 'countries', 'currencies']}>
      <ResourceObjectPermission match={props.match} resource="products" component={ProductDetailPricingHistory}/>
  </RequiredResources>},
  { path: '/alerts', exact: true, name: 'Alertas', render: props => <RequiredResources resources={['user_alerts', 'stores']}><AlertList/></RequiredResources>},
  { path: '/alerts/:id', exact: true, name: params => ({apiResource: 'user_alerts', apiResourceObjectId: params.id}), render: props => <RequiredResources resources={['stores']}>
      <ResourceObjectPermission Http404={Page404} onDelete='/alerts' match={props.match} resource="user_alerts" component={AlertDetail} />
  </RequiredResources>},
  { path: '/alerts/:id/change_history', exact: true, name: 'Historial de cambios', render:props => <RequiredResources resources={['stores', 'currencies']}>
      <ResourceObjectPermission Http404={Page404} match={props.match} resource="user_alerts" component={AlertDetailChangeHistory} />
  </RequiredResources>}
];

export default routes;
