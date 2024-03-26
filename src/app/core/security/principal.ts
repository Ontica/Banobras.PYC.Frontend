/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { SessionToken, Identity } from './security-types';


export class Principal {

  constructor(public readonly sessionToken: SessionToken,
              public readonly identity: Identity,
              public readonly permissions: string[],
              public readonly defaultRoute: string) { }


  static get empty(): Principal {
    return new Principal(undefined, undefined, undefined, undefined);
  }


  get isAuthenticated(): boolean {
    return (!!this.sessionToken);
  }

}
