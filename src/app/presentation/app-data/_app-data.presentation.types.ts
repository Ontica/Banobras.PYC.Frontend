/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

 /* Actions */
import { ActionType as AppStatusStateAction } from './app-status.presentation.handler';
export { ActionType as AppStatusStateAction } from './app-status.presentation.handler';

export type AppStatusActions = AppStatusStateAction;


import { SelectorType as AppStatusStateSelector } from './app-status.presentation.handler';
export { SelectorType as AppStatusStateSelector } from './app-status.presentation.handler';


export type AppStatusSelectors = AppStatusStateSelector;
