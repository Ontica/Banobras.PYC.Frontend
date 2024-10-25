/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


/* Selectors */

import { SelectorType as BudgetingStateSelector } from './budgeting.presentation.handler';
export { SelectorType as BudgetingStateSelector } from './budgeting.presentation.handler';

import { SelectorType as CataloguesStateSelector } from './catalogues.presentation.handler';
export { SelectorType as CataloguesStateSelector } from './catalogues.presentation.handler';

import { SelectorType as PaymentsStateSelector } from './payments.presentation.handler';
export { SelectorType as PaymentsStateSelector } from './payments.presentation.handler';

import { SelectorType as ProductsStateSelector } from './products.presentation.handler';
export { SelectorType as ProductsStateSelector } from './products.presentation.handler';

import { SelectorType as RequestsStateSelector } from './requests.presentation.handler';
export { SelectorType as RequestsStateSelector } from './requests.presentation.handler';

export type PYCSelectors = BudgetingStateSelector |
                           CataloguesStateSelector |
                           PaymentsStateSelector |
                           ProductsStateSelector |
                           RequestsStateSelector;
