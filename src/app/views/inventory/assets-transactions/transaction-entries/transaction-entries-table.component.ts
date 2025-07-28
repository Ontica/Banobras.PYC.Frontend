/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
         ViewChild } from '@angular/core';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AssetsStateSelector } from '@app/presentation/exported.presentation.types';

import { AssetsTransactionEntry, AssetsTransactionEntryFields, isEntityStatusInWarning } from '@app/models';

import { sendEvent, sendEventIf } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';


export enum TransactionEntriesTableEventType {
  SELECT_CLICKED = 'AssetsTransactionEntriesTableComponent.Event.SelectClicked',
  UPDATE_CLICKED = 'AssetsTransactionEntriesTableComponent.Event.UpdateClicked',
  DELETE_CLICKED = 'AssetsTransactionEntriesTableComponent.Event.DeleteClicked',
}

@Component({
  selector: 'emp-inv-transaction-entries-table',
  templateUrl: './transaction-entries-table.component.html',
  styles: `
    .cell-previous-condition {
      padding-left: 0!important;
    }

    .header-released-condition {
      padding-left: 10px;
    }

    .cell-released-condition {
      width: 145px;
    }

    .cell-released-condition-enabled {
      padding: 2px 0 2px 10px;
    }

    .cell-released-condition-disabled {
      padding-left: 10px;
    }

    .cell-description {
      width: 20%;
    }

    .cell-description-enabled {
      width: 20%;
      padding: 2px 0 2px 0;
    }
  `,
})
export class AssetsTransactionEntriesTableComponent implements OnChanges, OnInit, OnDestroy {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() transactionUID = '';

  @Input() entries: AssetsTransactionEntry[] = [];

  @Input() filter = '';

  @Input() canEdit = false;

  @Output() transactionEntriesTableEvent = new EventEmitter<EventInfo>();

  editionMode = false;

  rowInEdition: AssetsTransactionEntry = null;

  displayedColumnsDefault: string[] = ['assetNo', 'name', 'previousCondition', 'releasedCondition',
    'description'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: TableVirtualScrollDataSource<AssetsTransactionEntry>;

  isEntityStatusInWarning = isEntityStatusInWarning;

  conditionsList: Identifiable[] = [];

  isLoading = false;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.entries) {
      this.resetEditionMode();
      this.setDataSource();
      this.scrollToTop();
    }

    if (changes.filter) {
      this.applyFilter(this.filter);
    }
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isEntryInEditionValid(): boolean {
    return !!this.rowInEdition.description && !!this.rowInEdition.releasedCondition;
  }


  isRowInEdition(rowInEditionUID: string): boolean {
    return this.editionMode && rowInEditionUID === this.rowInEdition?.uid;
  }


  onSelectButtonClicked(entry: AssetsTransactionEntry) {
    sendEvent(this.transactionEntriesTableEvent, TransactionEntriesTableEventType.SELECT_CLICKED, { entry });
  }


  onEditEntryClicked(event, entry: AssetsTransactionEntry) {
    event.stopPropagation();
    this.rowInEdition = { ...{}, ...entry };
    this.editionMode = true;
  }


  onCancelEditionClicked(event) {
    event.stopPropagation();
    this.editionMode = false;
    this.rowInEdition = null;
  }


  onUpdateEntryClicked(event) {
    event.stopPropagation();

    const payload = {
      entryUID: this.rowInEdition.uid,
      dataFields: this.getDataFields(),
    };

    sendEvent(this.transactionEntriesTableEvent, TransactionEntriesTableEventType.UPDATE_CLICKED,
      payload);
  }


  onDeleteEntryClicked(event, entry: AssetsTransactionEntry) {
    event.stopPropagation();

    const message = this.getConfirmMessage(entry);

    this.messageBox.confirm(message, 'Eliminar movimiento', 'DeleteCancel')
      .firstValue()
      .then(x => {
        sendEventIf(x, this.transactionEntriesTableEvent, TransactionEntriesTableEventType.DELETE_CLICKED,
          { entry });
      });
  }


  private loadDataLists() {
    this.isLoading = true;
    this.helper.select<Identifiable[]>(AssetsStateSelector.ASSETS_CONDITIONS)
      .subscribe(x => {
        this.conditionsList = x;
        this.isLoading = false;
      });
  }


  private setDataSource() {
    this.resetColumns();
    this.dataSource = new TableVirtualScrollDataSource(this.entries);
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }


  private resetColumns() {
    this.displayedColumns = this.canEdit ?
      [...this.displayedColumnsDefault, 'actions'] :
      [...this.displayedColumnsDefault];
  }


  private resetEditionMode() {
    this.editionMode = false;
    this.rowInEdition = null;
  }


  private applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
    this.scrollToTop();
  }


  private getFilterPredicate() {
    return (row: AssetsTransactionEntry, filter: string) => (
      row.asset.assetNo.toLowerCase().includes(filter) || row.asset.name.toLowerCase().includes(filter) ||
      row.description.toLowerCase().includes(filter) || row.previousCondition.toLowerCase().includes(filter) ||
      row.releasedCondition.toLowerCase().includes(filter)
    );
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }


  private getConfirmMessage(entry: AssetsTransactionEntry): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>No. inventario: </td><td><strong>
          ${entry.asset.assetNo}
        </strong></td></tr>
        <tr><td class='nowrap'>Activo fijo: </td><td><strong>
          ${entry.asset.name}
        </strong></td></tr>
      </table>
      <br>¿Elimino el movimiento?`;
  }


  private getDataFields(): AssetsTransactionEntryFields {
    Assertion.assert(this.isEntryInEditionValid, 'Programming error: form must be validated before command execution.');

    const data: AssetsTransactionEntryFields = {
      uid: this.rowInEdition.uid,
      transactionUID: this.rowInEdition.transaction.uid,
      assetUID: this.rowInEdition.asset.uid,
      entryTypeUID: this.rowInEdition.entryType.uid,
      previousCondition: this.rowInEdition.previousCondition,
      releasedCondition: this.rowInEdition.releasedCondition,
      description: this.rowInEdition.description,
    };

    return data;
  }

}
