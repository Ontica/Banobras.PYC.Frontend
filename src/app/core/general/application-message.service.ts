/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { EmpObservable } from '../data-types';


export abstract class ApplicationMessageService {


  abstract isOpen(): boolean;

  abstract showError(message: string): EmpObservable<void>;

}
