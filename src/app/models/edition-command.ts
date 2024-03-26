/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from "@app/core";


export interface EditionCommand {
  type: string;
  dryRun: boolean;
  payload: any;
  isValid?: boolean;
}


export interface EditionResult {
  command: EditionCommand;
  commited: boolean;
  outcome: any;
  message: string;
  actions: string[];
  issues: string[];
  warnings: string[];
}


export interface Positioning {
  rule: PositioningRule;
  offsetUID?: string;
  position?: number;
}


export enum PositioningRule {
  AtStart = 'AtStart',
  BeforeOffset = 'BeforeOffset',
  AfterOffset = 'AfterOffset',
  AtEnd = 'AtEnd',
  ByPositionValue = 'ByPositionValue',
}


export const PositioningRuleList: Identifiable[] = [
  { uid: PositioningRule.AtStart,         name: 'Al principio' },
  { uid: PositioningRule.BeforeOffset,    name: 'Antes de' },
  { uid: PositioningRule.AfterOffset,     name: 'Despues de' },
  { uid: PositioningRule.AtEnd,           name: 'Al final' },
  { uid: PositioningRule.ByPositionValue, name: 'En posición' },
];
