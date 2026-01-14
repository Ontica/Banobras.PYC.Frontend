/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { IntegrationsDataService } from '@app/data-services';

import { buildExplorerHint, EmptyPayrollsQuery, EntityStatus, PayrollDescriptor,
         PayrollsQuery } from '@app/models';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';

import { PayrollsFilterEventType } from './payrolls-filter.component';

import { PayrollsTableEventType } from './payrolls-table.component';


export enum PayrollsModalEventType {
  CLOSE_MODAL_CLICKED = 'PayrollsModalComponent.Event.CloseModalClicked',
}

@Component({
  selector: 'emp-pyc-payrolls-modal',
  templateUrl: './payrolls-modal.component.html',
})
export class PayrollsModalComponent {

  @Output() closeEvent = new EventEmitter<EventInfo>();

  hint = 'Seleccionar los filtros';

  submitted = false;

  isLoading = false;

  queryExecuted = false;

  query: PayrollsQuery = Object.assign({}, EmptyPayrollsQuery);

  dataList: PayrollDescriptor[] = [];

  selectedData: PayrollDescriptor = null;

  displayExportModal = false;

  fileUrl = '';


  constructor(private integrationsData: IntegrationsDataService,
              private messageBox: MessageBoxService) { }


  onCloseButtonClicked() {
    this.closeEvent.emit();
  }


  @SkipIf('submitted')
  onPayrollsFilterEvent(event: EventInfo) {
    switch (event.type as PayrollsFilterEventType) {
      case PayrollsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearData(event.payload.query as PayrollsQuery);
        this.searchPayrolls();
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPayrollsTableEvent(event: EventInfo) {
    switch (event.type as PayrollsTableEventType) {
      case PayrollsTableEventType.DELETE_CLICKED:
        Assertion.assertValue(event.payload.payroll, 'event.payload.payroll');
        Assertion.assertValue(event.payload.payroll.uid, 'event.payload.payroll.uid');
        this.deletePayroll(event.payload.payroll.uid);
        return;
      case PayrollsTableEventType.RESTORE_CLICKED:
        Assertion.assertValue(event.payload.payroll, 'event.payload.payroll');
        Assertion.assertValue(event.payload.payroll.uid, 'event.payload.payroll.uid');
        this.restorePayroll(event.payload.payroll.uid);
        return;
      case PayrollsTableEventType.EXPORT_CLICKED:
        Assertion.assertValue(event.payload.payroll, 'event.payload.payroll');
        Assertion.assertValue(event.payload.payroll.uid, 'event.payload.payroll.uid');
        this.selectedData = event.payload.payroll;
        this.setDisplayExportModal(true);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event: EventInfo) {
    switch (event.type as ExportReportModalEventType) {
      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.selectedData = null;
        this.setDisplayExportModal(false);
        return;
      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        if (this.isLoading || this.submitted) {
          return;
        }
        this.exportPayrolls(this.selectedData.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchPayrolls() {
    this.isLoading = true;

    this.integrationsData.searchPayrolls(this.query)
      .firstValue()
      .then(x => this.setDataList(x))
      .finally(() => this.isLoading = false);
  }


  private exportPayrolls(payrollUID: string) {
    this.integrationsData.exportPayroll(payrollUID)
      .firstValue()
      .then(x => this.fileUrl = x.url);
  }


  private deletePayroll(payrollUID: string) {
    this.submitted = true;

    this.integrationsData.updatePayrollStatus(payrollUID, EntityStatus.Deleted)
      .firstValue()
      .then(x => this.resolveDeletePayroll(x))
      .finally(() => this.submitted = false);
  }



  private restorePayroll(payrollUID: string) {
    this.submitted = true;

    this.integrationsData.updatePayrollStatus(payrollUID, EntityStatus.Pending)
      .firstValue()
      .then(x => this.resolveRestorePayroll(x))
      .finally(() => this.submitted = false);
  }


  private setDataList(data: PayrollDescriptor[], queryExecuted = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
    this.setText();
  }


  private setQueryAndClearData(query: PayrollsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
  }


  private setText() {
    this.hint = buildExplorerHint(this.queryExecuted, this.dataList.length);
  }


  private setDisplayExportModal(display: boolean) {
    this.displayExportModal = display;
    this.fileUrl = '';
  }


  private resolveDeletePayroll(payroll: PayrollDescriptor) {
    this.refreshDataList(payroll);
    this.messageBox.show('Se eliminó la nómina seleccionada.', 'Eliminar nómina');
  }


  private resolveRestorePayroll(payroll: PayrollDescriptor) {
    this.refreshDataList(payroll);
    this.messageBox.show('Se restauró el estado de la nómina seleccionada a pendiente.',
      'Restaurar a estado pendiente');
  }


  private refreshDataList(payroll: PayrollDescriptor) {
    const shouldExclude = payroll.statusName === 'Eliminado' &&
      !this.dataList.some(x => x.statusName === 'Eliminado');

    const dataListNew = shouldExclude ?
      this.dataList.filter(x => x.uid !== payroll.uid) :
      ArrayLibrary.insertItemTop(this.dataList, payroll, 'uid');

    this.setDataList(dataListNew);
  }

}
