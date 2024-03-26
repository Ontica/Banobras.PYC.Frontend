/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export interface Identity {
  readonly username: string;
  readonly email: string;
  readonly fullname: string;
  readonly name: string;
}


export interface SessionToken {
  readonly accessToken: string;
  readonly expiresIn: number;
  readonly refreshToken: string;
  readonly tokenType: string;
}


export interface PrincipalData {
  readonly identity: Identity;
  permissions: string[];
}


export enum LoginErrorType {
  InvalidUserCredentials = 'SecurityException.InvalidUserCredentials',
  NotActiveUser          = 'SecurityException.NotActiveUser',
  UserPasswordExpired    = 'SecurityException.UserPasswordExpired',
  MustChangePassword     = 'SecurityException.MustChangePassword',
};


export enum LoginErrorActionType {
  ChangePassword = 'ChangePassword',
  None = 'None',
}


export interface LoginErrorAction {
  actionType: LoginErrorActionType;
  message: string;
}


export const FakeSessionToken: SessionToken = {
  accessToken: 'FakeAccessToken',
  expiresIn: 9999999,
  refreshToken: 'FakeRefreshToken',
  tokenType: 'FakeTokenType',
};


export function getFakePrincipalData(user: string): PrincipalData {
  const fakePrincipalData: PrincipalData = {
    identity: {
      username: user,
      email: user,
      fullname: user,
      name: user,
    },
    permissions: [],
  };

  return fakePrincipalData;
}
