/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export interface Entity<T = string> {
  readonly uid: T;
}


export interface Identifiable<T = string> extends Entity {
  name: string;
}


export const Empty: Identifiable = {
  uid: '',
  name: '',
};


export interface FlexibleIdentifiable {
  id?: number;
  uid?: string;
  code?: string;
  number?: string;
  name?: string;
  fullName?: string;
}


export interface PartitionedType {
  type: string;
}


export class Cache<T> extends Map<string, T> {

}


export interface MediaBase {
  url: string;
  mediaType: string;
}


export const EmptyMediaBase: MediaBase = {
  url: '',
  mediaType: ''
};


export enum MediaType {
  html = 'text/html',
  pdf = 'application/pdf',
}

export interface Quantity {
  unit: Identifiable;
  amount: number;
}

export const EmptyQuantity: Quantity = {
  unit: Empty,
  amount: 0
};


export interface Money {
  currency: Identifiable;
  amount: number;
}


export function isEmpty(instance: Entity): boolean {
  return (!instance || !instance.uid ||
          instance.uid === '' || instance.uid === 'Empty');
}


export function isTypeOf(instance: PartitionedType, typeName: string) {
  if (!instance) {
    return false;
  }
  return (instance.type === typeName);
}


export function isValidMediaBase(media: MediaBase): boolean {
  return (!media || !media.url || !media.mediaType);
}
