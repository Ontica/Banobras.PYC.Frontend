
/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { PERMISSIONS } from './permissions-config';


export type TOOL_TYPES = 'None' | 'Search' | 'Alerts' ;


export const TOOLS_LIST: TOOL_TYPES[] = ['None', 'Search', 'Alerts'];


export interface Tool {
  toolType: TOOL_TYPES;
  params?: any;
}


export const DefaultTool: Tool = {
  toolType: 'None',
};


export const SEARCH_TOOL_PERMISSIONS: PERMISSIONS[] = [
  PERMISSIONS.TOOL_CONCEPTOS_PRESUPUESTALES,
  PERMISSIONS.TOOL_MOVIMIENTOS_FLUJO_EFECTIVO_POR_AUXILIAR,
  PERMISSIONS.TOOL_MOVIMIENTOS_SISTEMA_CREDITOS,
  PERMISSIONS.TOOL_NUMEROS_VERIFICACION,
];
