/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable, Empty } from '@app/core';


export interface AccountabilityDescriptor {
  uid: string;
  partyRelationTypeName: string;
  commissionerName: string;
  roleName: string;
  responsibleName: string;
  code: string;
  description: string;
  startDate: DateString;
  endDate: DateString;
}


export interface Accountability {
  uid: string;
  commissioner: Identifiable;
  partyRelationType: Identifiable;
  responsible: Identifiable;
  role: Identifiable;
  code: string;
  description: string;
  tags: string[];
  startDate: DateString;
  endDate: DateString;
}


export interface PartyRelationFields {
  commissionerUID: string;
  partyRelationTypeUID: string;
  roleUID: string;
  responsibleUID: string;
  code: string;
  description: string;
  tags: string[];
  startDate: DateString;
}


export interface StructureForEditAccountabilities {
  uid: string;
  name: string;
  partyRelationCategories: PartyRelationType[];
}


export interface PartyRelationType {
  uid: string;
  name: string;
  roles: PartyRole[];
}


export interface PartyRole {
  uid: string;
  name: string;
  requiresCode: boolean;
}


export const EmptyAccountability: Accountability = {
  uid: '',
  commissioner: Empty,
  partyRelationType: Empty,
  role: Empty,
  responsible: Empty,
  code: '',
  description: '',
  tags: [],
  startDate: '',
  endDate: '',
}
