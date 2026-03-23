/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ActionType as AppStatusStateAction } from './app-status.presentation.handler';
export { ActionType as AppStatusStateAction } from './app-status.presentation.handler';

import { ActionType as AppAlertsStateAction } from './app-alerts.presentation.handler';
export { ActionType as AppAlertsStateAction } from './app-alerts.presentation.handler';

export type AppDataActions = AppStatusStateAction | AppAlertsStateAction;


import { SelectorType as AppStatusStateSelector } from './app-status.presentation.handler';
export { SelectorType as AppStatusStateSelector } from './app-status.presentation.handler';

import { SelectorType as AppAlertsStateSelector } from './app-alerts.presentation.handler';
export { SelectorType as AppAlertsStateSelector } from './app-alerts.presentation.handler';


export type AppDataSelectors = AppStatusStateSelector | AppAlertsStateSelector;
