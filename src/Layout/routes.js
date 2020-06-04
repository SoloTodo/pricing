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
import CategoryDetailHistoricShareOfShelves from "../views/Category/CategoryDetailHistoricShareOfShelves"
import ProductList from "../views/Product/ProductList";
import Page404 from "../views/Pages/Page404"
import ProductDetail from "../views/Product/ProductDetail";
import ProductDetailPricingHistory from "../views/Product/ProductDetailPricingHistory";
import CategoryDetail from "../views/Category/CategoryDetail";
import AlertList from "../views/Alert/AlertList";
import AlertDetail from "../views/Alert/AlertDetail"
import ReportList from "../views/Report/ReportList";
import ReportCurrentPrices from "../views/Report/ReportCurrentPrices";
import ReportStoreAnalysis from "../views/Report/ReportStoreAnalysis";
import ReportWeeklyPrices from "../views/Report/ReportWeeklyPrices";
import ReportPricesHistory from "../views/Report/ReportPricesHistory";
import ReportWebsitesTraffic from "../views/Report/ReportWebsitesTraffic";
import ReportSecPrices from "../views/Report/ReportSecPrices";
import ReportDailyPrices from "../views/Report/ReportDailyPrices";
import ReportWtb from "../views/Report/ReportWtb";
import BannerList from "../views/Banner/BannerList"
import BannerActiveParticipation from "../views/Banner/BannerActiveParticipation";
import BannerHistoricParticipation from "../views/Banner/BannerHistoricParticipation";
import BrandComparisonList from "../views/BrandComparison/BrandComparisonList";
import BrandComparisonDetail from "../views/BrandComparison/BrandComparisonDetail";
import SkuDetailPositionHistory from "../views/Sku/SkuDetailPositionHistory";
import StoreCurrentSkuPositionsReport from "../views/Store/StoreCurrentSkuPositionsReport";
import StoreHistoricSkuPositionsReport from "../views/Store/StoreHistoricSkuPositionsReport";
import KeywordSearchList from "../views/KeywordSearch/KeywordSearchList";
import KeywordSearchDetail from "../views/KeywordSearch/KeywordSearchDetail";
import KeywordSearchUpdateList from "../views/KeywordSearch/KeywordSearchUpdateList";
import KeywordSearchUpdateDetail from "../views/KeywordSearch/KeywordSearchUpdateDetail";
import KeywordSearchActiveReport from "../views/KeywordSearch/KeywordSearchActiveReport";
import ReportSoicosConversion from "../views/Report/ReportSoicosConversion";
import StoreSubscriptionList from "../views/StoreSubscription/StoreSubscriptionList";
import MicrositesList from "../views/Microsites/MicrositesList";
import MicrositeDetail from "../views/Microsites/MicrositeDetail";
import MicrositeEntries from "../views/Microsites/MicrositeEntries";


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  //{ path: '/', exact: true, name: 'Home', component:Layout },
  { path: '/account/password_change', exact: true, name: 'Cambiar contraseña', component: PasswordChange },
  { path: '/stores', exact: true, name: 'Tiendas', component: StoreList },
  { path: '/stores/:id', exact: true, name: params => ({apiResource: 'stores', apiResourceObjectId: params.id}), render: props =>
      <ResourceObjectPermission match={props.match} resource="stores" component={StoreDetail} />},
  { path: '/stores/:id/update_logs', exact: true, name: 'Registros de actualización', render: props => <RequiredResources resources={['categories']}>
      <ResourceObjectPermission match={props.match} resource="stores" permission="view_store_update_logs" component={StoreDetailUpdateLogs} />
    </RequiredResources>},
  { path: '/stores/:id/current_sku_positions', exact: true, name: 'Posicionamiento actual de SKUs', render: props => <RequiredResources resources={['categories', 'brands']}>
      <ResourceObjectPermission match={props.match} resource="stores" permission="view_store_entity_positions" component={StoreCurrentSkuPositionsReport} />
    </RequiredResources>},
  { path: '/stores/:id/historic_sku_positions', exact: true, name: 'Posicionamiento historico de SKUs', render: props => <RequiredResources resources={['categories', 'brands']}>
      <ResourceObjectPermission match={props.match} resource="stores" permission="view_store_entity_positions" component={StoreHistoricSkuPositionsReport} />
    </RequiredResources>},
  { path: '/skus', exact: true, name:'SKUs', render: props => <RequiredResources resources={['categories', 'stores']}><SkuList/></RequiredResources>},
  { path: '/skus/:id', exact: true, name: params => ({apiResource: 'entities', apiResourceObjectId: params.id}), render: props => <RequiredResources resources={['stores', 'categories', 'users_with_staff_actions']}>
      <ResourceObjectPermission match={props.match} resource="entities" component={SkuDetail}/>
    </RequiredResources>},
  { path: '/skus/:id/pricing_history', exact:true, name:'Historial de precios', render: props => <RequiredResources resources={['stores']}>
      <ResourceObjectPermission match={props.match} resource="entities" component={SkuDetailPricingHistory} />
    </RequiredResources>},
  { path: '/skus/:id/position_history', exact:true, name:'Historial de posiciones', render: props => <RequiredResources resources={['stores', 'categories']}>
      <ResourceObjectPermission match={props.match} resource="entities" component={SkuDetailPositionHistory} />
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
  { path:'/categories/:id/historic_share_of_shelves', exact: true, name: 'Share of shelves histórico', render: props => <RequiredResources resources={['stores', 'countries', 'currencies']}>
      <ResourceObjectPermission permission='view_category_share_of_shelves' Http404={Page404} match={props.match} resource="categories" component={CategoryDetailHistoricShareOfShelves} />
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
  { path: '/alerts', exact: true, name: 'Alertas', render: props => <RequiredResources resources={['stores']}><AlertList/></RequiredResources>},
  { path: '/alerts/:id', exact: true, name: params => ({apiResource: 'alerts', apiResourceObjectId: params.id}), render: props => <RequiredResources resources={['stores']}>
      <ResourceObjectPermission Http404={Page404} onDelete='/alerts' match={props.match} resource="alerts" component={AlertDetail} />
    </RequiredResources>},
  // { path: '/alerts/:id/change_history', exact: true, name: 'Historial de cambios', render:props => <RequiredResources resources={['stores', 'currencies']}>
  //    <ResourceObjectPermission Http404={Page404} match={props.match} resource="user_alerts" component={AlertDetailChangeHistory} />
  //  </RequiredResources>},
  { path: '/reports', exact: true, name: 'Reportes', render:props => <RequiredResources resources={['reports']}><ReportList/></RequiredResources>},
  { path: '/reports/current_prices', exact: true, name: 'Precios actuales', render: props => <RequiredResources resources={['categories', 'stores', 'currencies', 'store_types', 'countries']}>
      <ReportCurrentPrices />
    </RequiredResources>},
  { path: '/reports/store_analysis', exact: true, name: 'Análisis de tienda', render: props => <RequiredResources resources={['categories', 'stores']}>
      <ReportStoreAnalysis />
    </RequiredResources>},
  { path: '/reports/weekly_prices', exact: true, name: 'Precios semanales', render: props => <RequiredResources resources={['categories', 'stores']}>
      <ReportWeeklyPrices />
    </RequiredResources>},
  { path: '/reports/prices_history', exact: true, name: 'Precios históricos', render: props => <RequiredResources resources={['categories', 'stores']}>
      <ReportPricesHistory />
    </RequiredResources>},
  { path: '/reports/websites_traffic', exact: true, name: 'Tráfico en sitios', render: props => <RequiredResources resources={['categories', 'stores', 'websites']}>
      <ReportWebsitesTraffic />
    </RequiredResources>},
  { path: '/reports/sec_prices', exact: true, name: 'Precios SEC', render: props => <RequiredResources resources={['categories', 'stores']}>
      <ReportSecPrices />
    </RequiredResources>},
  { path: '/reports/daily_prices', exact: true, name: 'Precios diarios', render: props => <RequiredResources resources={['categories', 'stores']}>
      <ReportDailyPrices />
    </RequiredResources>},
  { path: '/reports/wtb_report', exact: true, name: 'Reporte donde comprar', render: props => <RequiredResources resources={['wtb_brands', 'categories', 'stores', 'currencies', 'store_types', 'countries']}>
      <ReportWtb />
    </RequiredResources>},
  { path: '/reports/soicos_conversions', exact: true, name: 'Reporte conversiones soicos', render: props => <RequiredResources resources={['stores', 'categories', 'websites']}>
      <ReportSoicosConversion />
    </RequiredResources>},
  { path: '/banners', exact:true, name: 'Banners', render: props => <RequiredResources resources={['stores', 'banner_sections', 'brands', 'categories', 'banner_subsection_types']}>
      <BannerList/>
    </RequiredResources>},
  { path: '/banners/active_participation', exact:true, name: 'Active participation', render: props => <RequiredResources resources={['stores', 'brands', 'categories', 'banner_sections', 'banner_subsection_types']}>
      <BannerActiveParticipation/>
    </RequiredResources>},
  { path: '/banners/historic_participation', exact:true, name: 'Historic participation', render: props => <RequiredResources resources={['stores', 'brands', 'categories', 'banner_sections', 'banner_subsection_types']}>
      <BannerHistoricParticipation/>
    </RequiredResources>},
  { path: '/brand_comparisons', exact:true, name:'Comparación de Marcas', render: props => <RequiredResources resources={['categories', 'brands']}>
      <BrandComparisonList/>
    </RequiredResources>},
  { path: '/brand_comparisons/:id', exact: true, name: params => ({apiResource: 'brand_comparisons', apiResourceObjectId: params.id}), render: props => <RequiredResources resources={['stores', 'currencies']}>
      <ResourceObjectPermission Http404={Page404} match={props.match} resource="brand_comparisons" component={BrandComparisonDetail} />
    </RequiredResources>},
  { path: '/keyword_searches', exact:true, name: 'Keyword visibility', render: props => <RequiredResources resources={['stores', 'categories']}>
      <KeywordSearchList/>
    </RequiredResources>},
  { path: '/keyword_searches/active_report', exact: true, name: 'Reporte actual', render: props => <RequiredResources resources={['stores', 'categories', 'brands']}>
      <KeywordSearchActiveReport/>
    </RequiredResources>},
  { path: '/keyword_searches/:id', exact: true, name: params => ({apiResource: 'keyword_searches', apiResourceObjectId: params.id}), render: props =>
      <ResourceObjectPermission match={props.match} resource='keyword_searches' component={KeywordSearchDetail}/> },
  { path: '/keyword_searches/:id/updates', exact:true, name: 'Actualizaciones', render: props =>
      <ResourceObjectPermission match={props.match} resource='keyword_searches' component={KeywordSearchUpdateList}/>},
  { path: '/keyword_search_updates/:id', exact: true, name: params => ({apiResource: 'keyword_search_updates', apiResourceObjectId: params.id}), render: props =>
      <ResourceObjectPermission match={props.match} resource={'keyword_search_updates'} component={KeywordSearchUpdateDetail}/>
  },
  { path: '/store_subscriptions', exact:true, name: 'Suscripciones a Tiendas', render: props => <RequiredResources resources={['stores', 'categories']}>
      <StoreSubscriptionList/>
    </RequiredResources>},
  { path: '/microsites', exact: true, name: 'Sitios', render: props => <RequiredResources resources={['microsite_brands']}>
        <MicrositesList/>
    </RequiredResources>},
  { path: '/microsites/:id', exact: true, name: params =>({apiResource: 'microsite_brands', apiResourceObjectId: params.id}), render: props =>
     <ResourceObjectPermission match={props.match} resource="microsite_brands" component={MicrositeDetail}/>},
  { path: '/microsites/:id/product_entries', exact: true, name: params=>({apiResource: 'microsite_brands', apiResourceObjectId: params.id}), render: props => <RequiredResources resources={['categories']}>
          <ResourceObjectPermission match={props.match} resource="microsite_brands" component={MicrositeEntries}/>
  </RequiredResources>}
];

export default routes;
