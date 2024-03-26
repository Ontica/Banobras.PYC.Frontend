
/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

export type TOOL_TYPES = 'None' | 'Search' | 'Alerts' ;


export const TOOLS_LIST: TOOL_TYPES[] = ['None', 'Search', 'Alerts'];


export interface Tool {
  toolType: TOOL_TYPES;
  params?: any;
}


export const DefaultTool: Tool = {
  toolType: 'None',
};
