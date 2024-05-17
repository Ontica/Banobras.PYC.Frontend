/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from "@app/core";


export enum BudgetPlanningQueryType {
  All = 'all'
}

export interface BudgetType {
  uid: string;
  name: string;
  budgets: Budget[];
  segmentTypes: BudgetSegmentType[];
}


export interface Budget {
  uid: string;
  name: string;
  year: number;
  type: Identifiable;
}


export interface BudgetSegmentType {
  uid: string;
  name: string;
  parentSegmentType: BudgetSegmentType;
  childrenSegmentType: BudgetSegmentType;
}


export interface BudgetSegmentItem {
  uid: string;
  code: string;
  name: string;
  description: string;
  type: Identifiable;
  children: BudgetSegmentItem[];
}


export interface BudgetPlanningQuery {
  budgetTypeUID: string;
  budgetUID: string;
  budgetView: string;
  segments: BudgetSegmentQuery[];
}


export interface BudgetSegmentQuery {
  segmentUID: string;
  segmentItemsUID: string[];
}
