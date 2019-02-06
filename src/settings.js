import {apiSettings} from "./react-utils/settings";

export const settings = {
  ...apiSettings,
  defaults: {
    countries: 1
  },
  categoryBrowsePurposeId: 1,
  categoryTemplateDetailPurposeId: 1,
  ownWebsiteId: 1,
  mobileNetworkOperatorId: 3,
  usdCurrencyUrl: apiSettings.endpoint + 'currencies/4/',
  clpCurrencyUrl: apiSettings.endpoint + 'currencies/1/',
  statusDict: {
    1: 'Pendiente',
    2: 'En Proceso',
    3: 'Exitoso',
    4: 'Error'
  }
};