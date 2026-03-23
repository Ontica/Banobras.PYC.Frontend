/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { MainLayoutActions, MainLayoutSelectors } from './main-layout/_main-layout.presentation.types';
export * from './main-layout/_main-layout.presentation.types';

import { AppDataActions, AppDataSelectors } from './app-data/_app-data.presentation.types';
export * from './app-data/_app-data.presentation.types';

import { SMSelectors } from './security-management/_security.management.presentation.types';
export * from './security-management/_security.management.presentation.types';

import { PYCActions, PYCSelectors } from './pyc/_pyc.presentation.types';
export * from './pyc/_pyc.presentation.types';


/* Exportation types */

export type ActionType = MainLayoutActions | AppDataActions | PYCActions;

export type CommandType = '';

export type StateEffect = '';

export type StateSelector = MainLayoutSelectors | AppDataSelectors | SMSelectors | PYCSelectors;
