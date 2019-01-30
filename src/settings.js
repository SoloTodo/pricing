import {apiSettings} from "./react-utils/settings";

export const settings = {
  ...apiSettings,
  categoryBrowsePurposeId: 1,
    usdCurrencyUrl: apiSettings.endpoint + 'currencies/4/',
  clpCurrencyUrl: apiSettings.endpoint + 'currencies/1/',
  statusDict: {
    1: 'Pendiente',
    2: 'En Proceso',
    3: 'Exitoso',
    4: 'Error'
  }
};