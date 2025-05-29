/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EmpObservable, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { CashFlowProjectionsDataService } from '@app/data-services';

import { CashFlowProjection, CashFlowProjectionEntryDescriptor, CashFlowProjectionEntryFields,
         EmptyCashFlowProjection, EmptyCashFlowProjectionEntry, TransactionEntryType,
         CashFlowProjectionEntryByYearFields, CashFlowProjectionGroupedEntryData,
         EmptyCashFlowProjectionGroupedEntryData, CashFlowProjectionEntryBase, EmptyCashFlowProjectionEntryBase,
         CashFlowProjectionEntryBaseDescriptor, CashFlowProjectionEntryByYearDescriptor } from '@app/models';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

import { ProjectionEntriesControlsEventType } from './projection-entries-controls.component';

import { ProjectionEntriesTableEventType } from './projection-entries-table.component';

import { ProjectionEntryEditorEventType } from './projection-entry-editor.component';


export enum ProjectionEntriesEditionEventType {
  UPDATED = 'CashFlowProjectionEntriesEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-cf-projection-entries-edition',
  templateUrl: './projection-entries-edition.component.html',
})
export class CashFlowProjectionEntriesEditionComponent implements OnChanges {

  @Input() projection: CashFlowProjection = EmptyCashFlowProjection;

  @Input() entries: CashFlowProjectionEntryDescriptor[] = [];

  @Input() groupedEntries: CashFlowProjectionGroupedEntryData = Object.assign({}, EmptyCashFlowProjectionGroupedEntryData);

  @Input() canEdit = false;

  @Output() projectionEntriesEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayEntryEditor = false;

  selectedEntry: CashFlowProjectionEntryBase = EmptyCashFlowProjectionEntryBase;

  filter = '';

  displayAllEntries = false;


  constructor(private projectionsData: CashFlowProjectionsDataService,
              private messageBox: MessageBoxService) { }


  ngOnChanges(){
    this.filter = '';
    this.setSelectedEntry(EmptyCashFlowProjectionEntry);
  }


  onEntriesControlsEvent(event: EventInfo) {
    switch (event.type as ProjectionEntriesControlsEventType) {
      case ProjectionEntriesControlsEventType.FILTER_CHANGED:
        this.filter = event.payload.filter as string;
        return;
      case ProjectionEntriesControlsEventType.CHECK_ALL_ENTRIES_CHANGED:
        this.displayAllEntries = event.payload.displayAllEntries as boolean;
        return;
      case ProjectionEntriesControlsEventType.AUTOMATIC_GENERATION_BUTTON_CLICKED:
        this.messageBox.showInDevelopment('Generación automática');
        return;
      case ProjectionEntriesControlsEventType.CREATE_ENTRY_BUTTON_CLICKED:
        this.setSelectedEntry(EmptyCashFlowProjectionEntry, true);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  @SkipIf('submitted')
  onEntryEditorEvent(event: EventInfo) {
    switch (event.type as ProjectionEntryEditorEventType) {
      case ProjectionEntryEditorEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedEntry(EmptyCashFlowProjectionEntry);
        return;
      case ProjectionEntryEditorEventType.CREATE_ENTRY:
        Assertion.assertValue(event.payload.entryType, 'event.payload.entryType');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.handleCreateEntry(event.payload.entryType, this.projection.uid, event.payload.dataFields);
        return;
      case ProjectionEntryEditorEventType.UPDATE_ENTRY:
        Assertion.assertValue(event.payload.entryType, 'event.payload.entryType');
        Assertion.assertValue(event.payload.entryUID, 'event.payload.entryUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.handleUpdateEntry(event.payload.entryType, this.projection.uid, event.payload.entryUID, event.payload.dataFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onEntriesTableEvent(event: EventInfo) {
    switch (event.type as ProjectionEntriesTableEventType) {
      case ProjectionEntriesTableEventType.SELECT_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.handleGetEntry(TransactionEntryType.Monthly, this.projection.uid, event.payload.entry.uid);
        return;
      case ProjectionEntriesTableEventType.REMOVE_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.confirmRemoveEntry(TransactionEntryType.Monthly,
          event.payload.entry as CashFlowProjectionEntryBaseDescriptor);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onEntriesGroupedTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.handleGetEntry(TransactionEntryType.Annually, this.projection.uid, event.payload.entry.uid);
        return;
      case DataTableEventType.DELETE_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.confirmRemoveEntry(TransactionEntryType.Annually,
          event.payload.entry as CashFlowProjectionEntryBaseDescriptor);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private handleGetEntry(type: TransactionEntryType, projectionUID: string, entryUID: string) {
    let observable = null;
    switch (type) {
      case TransactionEntryType.Monthly:
        observable = this.projectionsData.getProjectionEntry(projectionUID, entryUID)
        break;
      case TransactionEntryType.Annually:
        observable = this.projectionsData.getProjectionEntriesByYear(projectionUID, entryUID)
        break;
      default:
        return;
    }
    this.executeGetEntry(observable);
  }


  private handleCreateEntry(type: TransactionEntryType, projectionUID: string, dataFields) {
    let observable = null;
    switch (type) {
      case TransactionEntryType.Monthly:
        observable = this.projectionsData.createProjectionEntry(projectionUID, dataFields as CashFlowProjectionEntryFields);
        break;
      case TransactionEntryType.Annually:
        observable = this.projectionsData.createProjectionEntriesByYear(projectionUID, dataFields as CashFlowProjectionEntryByYearFields);
        break;
      default:
        return;
    }
    this.executeEditEntry(observable);
  }


  private handleUpdateEntry(type: TransactionEntryType, projectionUID: string, entryUID: string, dataFields) {
    let observable = null;
    switch (type) {
      case TransactionEntryType.Monthly:
        observable = this.projectionsData.updateProjectionEntry(projectionUID, entryUID, dataFields as CashFlowProjectionEntryFields);
        break;
      case TransactionEntryType.Annually:
        observable = this.projectionsData.updateProjectionEntriesByYear(projectionUID, entryUID, dataFields as CashFlowProjectionEntryByYearFields);
        break;
      default:
        return;
    }
    this.executeEditEntry(observable);
  }


  private handleRemoveEntry(type: TransactionEntryType, projectionUID: string, entryUID: string) {
    let observable = null;
    switch (type) {
      case TransactionEntryType.Monthly:
        observable = this.projectionsData.removeProjectionEntry(projectionUID, entryUID);
        break;
      case TransactionEntryType.Annually:
        observable = this.projectionsData.removeProjectionEntriesByYear(projectionUID, entryUID);
        break;
      default:
        return;
    }
    this.executeEditEntry(observable);
  }


  private executeGetEntry(observable: EmpObservable<CashFlowProjectionEntryBase>) {
    this.submitted = true;
    observable
      .firstValue()
      .then(x => this.setSelectedEntry(x))
      .finally(() => this.submitted = false);
  }


  private executeEditEntry(observable: EmpObservable<CashFlowProjectionEntryBase | void>) {
    this.submitted = true;
    observable
      .firstValue()
      .then(x => this.resolveEntriesUpdated())
      .finally(() => this.submitted = false);
  }


  private setSelectedEntry(entry: CashFlowProjectionEntryBase, display?: boolean) {
    this.selectedEntry = entry;
    this.displayEntryEditor = display ?? !isEmpty(entry);
  }


  private resolveEntriesUpdated() {
    const payload = { projectionUID: this.projection.uid };
    sendEvent(this.projectionEntriesEditionEvent, ProjectionEntriesEditionEventType.UPDATED, payload);
    this.setSelectedEntry(EmptyCashFlowProjectionEntry);
  }


  private getConfirmRemoveEntryTitle(type: TransactionEntryType): string {
    switch (type) {
      case TransactionEntryType.Monthly: return 'Eliminar concepto mensual';
      case TransactionEntryType.Annually: return 'Eliminar concepto anual';
      default: return 'Eliminar concepto';
    }
  }


  private confirmRemoveEntry(type: TransactionEntryType, entry: CashFlowProjectionEntryBaseDescriptor) {
    const title = this.getConfirmRemoveEntryTitle(type);
    const message = this.getConfirmRemoveEntryMessage(type, entry);

    this.messageBox.confirm(message, title, 'DeleteCancel')
      .firstValue()
      .then(x => x ? this.handleRemoveEntry(type, this.projection.uid, entry.uid) : null);
  }


  private getConfirmRemoveEntryMessage(type: TransactionEntryType, entry: CashFlowProjectionEntryBaseDescriptor): string {
    const total = this.getEntryTotal(type, entry);
    const account = this.getEntryAccount(type, entry);

    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>Concepto: </td><td><strong>${entry.balanceColumn}</strong></td></tr>
        <tr><td class='nowrap'>Cuenta presupuestal: </td><td><strong>${account}</strong></td></tr>
        <tr><td class='nowrap'>Importe: </td><td><strong>${total}</strong></td></tr>
      </table>
      <br>¿Elimino el concepto?`;
  }


  private getEntryAccount(type: TransactionEntryType, entry: CashFlowProjectionEntryBaseDescriptor): string {
    switch (type) {
      case TransactionEntryType.Monthly: return (entry as CashFlowProjectionEntryDescriptor).accountName;
      case TransactionEntryType.Annually: return (entry as CashFlowProjectionEntryByYearDescriptor).account;
      default: return '';
    }
  }


  private getEntryTotal(type: TransactionEntryType, entry: CashFlowProjectionEntryBaseDescriptor): string {
    let total = null;
    switch (type) {
      case TransactionEntryType.Monthly:
        total = (entry as CashFlowProjectionEntryDescriptor).withdrawal > 0 ?
          (entry as CashFlowProjectionEntryDescriptor).withdrawal :
          (entry as CashFlowProjectionEntryDescriptor).deposit;
        break;
      case TransactionEntryType.Annually:
        total = (entry as CashFlowProjectionEntryByYearDescriptor).total;
        break;
      default: total = 0;
    }
    return FormatLibrary.numberWithCommas(total, '1.2-2');
  }

}
