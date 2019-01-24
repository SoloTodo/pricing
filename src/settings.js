import {apiSettings} from "./react-utils/settings";

export const settings = {
  ...apiSettings,
  statusDict: {
    1: 'Pendiente',
    2: 'En Proceso',
    3: 'Exitoso',
    4: 'Error'
  }
};