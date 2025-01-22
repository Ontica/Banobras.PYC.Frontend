/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { PERMISSIONS } from '@app/main-layout';


type ControlPanelOptionType = 'ChangePassword' |
                              'OperationsLog';


export interface ControlPanelOption {
  title: string;
  description: string;
  actionTitle: string;
  type: ControlPanelOptionType;
  permission: PERMISSIONS;
}


export const ControlPanelOptionList: ControlPanelOption[] = [
  {
    title: 'Cambiar contraseña',
    description: 'Herramienta para actualizar la contraseña de la cuenta de acceso.',
    actionTitle: 'Cambiar',
    type: 'ChangePassword',
    permission: PERMISSIONS.FEATURE_CAMBIAR_PASSWORD,
  },
  {
    title: 'Bitácoras de operación',
    description: 'Herramienta de generación y exportación de bitácoras de operación.',
    actionTitle: 'Generar',
    type: 'OperationsLog',
    permission: PERMISSIONS.FEATURE_BITACORAS_OPERACION,
  },
];
