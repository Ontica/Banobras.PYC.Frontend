/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { PERMISSIONS } from '@app/main-layout';


type ControlPanelOptionType = 'ChangePassword' |
                              'OperationsLog' |
                              'BudgetPlanningPeriods' |
                              'PayrollsIntegration';


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
    title: 'Períodos de planeación presupuestal',
    description: 'Controla los períodos de carga del presupuesto planeado del gasto corriente y del programa financiero.',
    actionTitle: 'Administrar',
    type: 'BudgetPlanningPeriods',
    permission: PERMISSIONS.FEATURE_PERIODOS_DE_PLANEACION_PRESUPUESTAL,
  },
  {
    title: 'Bitácoras de operación',
    description: 'Herramienta de generación y exportación de bitácoras de operación.',
    actionTitle: 'Generar',
    type: 'OperationsLog',
    permission: PERMISSIONS.FEATURE_BITACORAS_OPERACION,
  },
  {
    title: 'Enlace con Nómina',
    description: 'Herramienta para exportar nóminas a archivos Excel para actualizar el gasto corriente ejercido del Capitulo 1000.',
    actionTitle: 'Exportar',
    type: 'PayrollsIntegration',
    permission: PERMISSIONS.FEATURE_NOMINAS_INTEGRACION_SIAL,
  },
];
