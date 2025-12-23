/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { FilePreviewComponent } from '@app/shared/containers';

import { OrdersDataService } from '@app/data-services';

import { BillsStructure, DocumentFields, DocumentsEntityTypes, EmptyBillsStructure,
         FileReport } from '@app/models';

import { BillsTableEventType } from './bills-table.component';

import { BillUploaderEventType } from './bill-uploader.component';


export enum BillsEditionEventType {
  UPDATED = 'BillsEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-ng-bills-edition',
  templateUrl: './bills-edition.component.html',
})
export class BillsEditionComponent {

  @ViewChild('filePreview', { static: true }) filePreview: FilePreviewComponent;

  @Input() entityType: DocumentsEntityTypes = null;

  @Input() entityUID: string = null;

  @Input() data: BillsStructure = EmptyBillsStructure;

  @Input() canEdit = false;

  @Output() billsEditionEvent = new EventEmitter<EventInfo>();

  displayUploader = false;

  submitted = false;


  constructor(private ordersData: OrdersDataService) { }


  onUpploadClicked() {
    this.displayUploader = true;
  }


  @SkipIf('submitted')
  onBillUploaderEvent(event: EventInfo) {
    switch (event.type as BillUploaderEventType) {
      case BillUploaderEventType.CLOSE_MODAL_CLICKED:
        this.displayUploader = false;
        return;
      case BillUploaderEventType.UPLOAD_CLICKED:
        Assertion.assertValue(event.payload.entityType, 'event.payload.entityType');
        Assertion.assertValue(event.payload.entityUID, 'event.payload.entityUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        Assertion.assertValue(event.payload.xmlFile || event.payload.pdfFile, 'event.payload.xmlFile || event.payload.pdfFile');
        this.upploadBill(
          event.payload.entityUID,
          event.payload.dataFields as DocumentFields,
          event.payload.xmlFile as File,
          event.payload.pdfFile as File,
        );
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onBillsTableEvent(event: EventInfo) {
    switch (event.type as BillsTableEventType) {
      case BillsTableEventType.SHOW_FILE_CLICKED:
        Assertion.assertValue(event.payload.bill.uid, 'event.payload.bill.uid');
        Assertion.assertValue(event.payload.file, 'event.payload.file');
        this.openFilePreview(event.payload.file);
        return;
      case BillsTableEventType.REMOVE_CLICKED:
        Assertion.assertValue(event.payload.entityUID, 'event.payload.entityUID');
        Assertion.assertValue(event.payload.bill.uid, 'event.payload.bill.uid');
        this.deleteBill(event.payload.entityUID, event.payload.bill.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }



  private upploadBill(entityUID: string, dataFields: DocumentFields, xmlFile: File, pdfFile: File) {
    this.submitted = true;

    this.ordersData.upploadBill(entityUID, dataFields, xmlFile, pdfFile)
      .firstValue()
      .then(x => this.resolveBillsUpdated())
      .finally(() => this.submitted = false);
  }


  private deleteBill(entityUID: string, billUID: string) {
    this.submitted = true;

    this.ordersData.deleteBill(entityUID, billUID)
      .firstValue()
      .then(() => this.resolveBillsUpdated())
      .finally(() => this.submitted = false);
  }


  private resolveBillsUpdated() {
    this.displayUploader = false;
    const payload = { entityUID: this.entityUID };
    sendEvent(this.billsEditionEvent, BillsEditionEventType.UPDATED, payload);
  }


  private openFilePreview(file: FileReport) {
    this.filePreview.open(file.url, file.type);
  }

}
