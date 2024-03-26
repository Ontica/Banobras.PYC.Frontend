/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Cryptography } from './cryptography';

import { HttpHandler } from '../http/http-handler';

import { SessionToken, PrincipalData } from './security-types';


interface ExternalSessionToken {
  readonly access_token: string;
  readonly expires_in: number;
  readonly refresh_token: string;
  readonly token_type: string;
}


export interface Credentials {
  userID: string;
  password: string;
}


interface NewCredentials {
  userID: string;
  currentPassword: string;
  newPassword: string;
}


@Injectable()
export class SecurityDataService {


  constructor(private httpHandler: HttpHandler) { }


  async createLoginSession(userID: string, userPassword: string): Promise<SessionToken> {
    const credentials: Credentials = {
      userID,
      password: ''
    };

    const token = await
      this.httpHandler.post<string>('v3/security/login-token', credentials)
                      .firstValue();

    credentials.password = this.encryptUserPassword(userPassword, token);

    return this.httpHandler.post<ExternalSessionToken>('v3/security/login', credentials)
                           .firstValue()
                           .then(x => this.mapToSessionToken(x));
  }


  async getPrincipalData(): Promise<PrincipalData> {
    return this.httpHandler.get<PrincipalData>('v3/security/principal')
                           .firstValue();
  }



  async changePassword(userID: string, currentPassword: string, newPassword: string): Promise<void> {
    const credentials: NewCredentials = {
      userID,
      currentPassword: '',
      newPassword: '',
    };

    const token = await
      this.httpHandler.post<string>('v4/onepoint/security/management/new-credentials-token', credentials)
        .firstValue();

    credentials.currentPassword = this.encryptUserPassword(currentPassword, token);

    credentials.newPassword = Cryptography.encryptAES2(newPassword, token);

    return this.httpHandler.post<void>('v4/onepoint/security/management/update-my-credentials', credentials)
                           .firstValue();
  }


  async closeSession(): Promise<void> {
    return this.httpHandler.post<void>('v3/security/logout')
                           .firstValue();
  }


  private mapToSessionToken(source: ExternalSessionToken): SessionToken {
    return {
      accessToken: source.access_token,
      expiresIn: source.expires_in,
      refreshToken: source.refresh_token,
      tokenType: source.token_type
    };
  }


  private encryptUserPassword(userPassword: string, token: string): string {
    const encryptedPassword = Cryptography.createHash(userPassword);

    return Cryptography.createHash(encryptedPassword + token);
  }

}
