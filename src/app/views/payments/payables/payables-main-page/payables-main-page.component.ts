/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { PayablesDataService } from '@app/data-services';

import { ArrayLibrary } from '@app/shared/utils';

import { EmptyPayableData, EmptyPayablesQuery, mapPayableDescriptorFromPayable, PayableData,
         PayableDescriptor, PayablesQuery } from '@app/models';

import { PayableCreatorEventType } from '../payable/payable-creator.component';

import { PayablesExplorerEventType } from '../payables-explorer/payables-explorer.component';

import { PayableTabbedViewEventType } from '../payable-tabbed-view/payable-tabbed-view.component';

@Component({
  selector: 'emp-pmt-payables-main-page',
  templateUrl: './payables-main-page.component.html',
})
export class PayablesMainPageComponent {

  query: PayablesQuery = Object.assign({}, EmptyPayablesQuery);

  dataList: PayableDescriptor[] = [];

  selectedData: PayableData = EmptyPayableData;

  displayTabbedView = false;

  displayCreator = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private payablesData: PayablesDataService,
              private messageBox: MessageBoxService)  { }


  onPayableCreatorEvent(event: EventInfo) {
    switch (event.type as PayableCreatorEventType) {
      case PayableCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;
      case PayableCreatorEventType.PAYABLE_CREATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.displayCreator = false;
        this.insertPayableToList(event.payload.data as PayableData);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPayablesExplorerEvent(event: EventInfo) {
    switch (event.type as PayablesExplorerEventType) {
      case PayablesExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
        return;
      case PayablesExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as PayablesQuery);
        this.searchPayables(this.query);
        return;
      case PayablesExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as PayablesQuery);
        return;
      case PayablesExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.payable, ' event.payload.payable');
        Assertion.assertValue(event.payload.payable.uid, 'event.payload.payable.uid');
        this.getPayableData(event.payload.payable.uid);
        return;
      case PayablesExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPayableTabbedViewEvent(event: EventInfo) {
    switch (event.type as PayableTabbedViewEventType) {
      case PayableTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyPayableData);
        return;
      case PayableTabbedViewEventType.PAYABLE_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.insertPayableToList(event.payload.data as PayableData);
        return;
      case PayableTabbedViewEventType.PAYABLE_DELETED:
        Assertion.assertValue(event.payload.payableUID, 'event.payload.payableUID');
        this.removePayableFromList(event.payload.payableUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchPayables(query: PayablesQuery) {
    this.isLoading = true;

    this.payablesData.searchPayables(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private getPayableData(payableUID: string) {
    this.isLoadingSelection = true;

    this.payablesData.getPayableData(payableUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private setQueryAndClearExplorerData(query: PayablesQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyPayableData);
  }


  private setDataList(data: PayableDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: PayableData) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.payable);
  }


  private insertPayableToList(data: PayableData) {
    const dataToInsert = mapPayableDescriptorFromPayable(data);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew);
    this.setSelectedData(data);
  }


  private removePayableFromList(payableUID: string) {
    const dataListNew = this.dataList.filter(x => x.uid !== payableUID);
    this.setDataList(dataListNew);
    this.setSelectedData(EmptyPayableData);
  }

}
