/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { sendEvent, sendEventIf } from '@app/shared/utils';

import { Document } from '@app/models';


export enum DocumentsTableEventType {
  SELECT_DOCUMENT_CLICKED = 'DocumentsTableComponent.Event.SelectDocumentClicked',
  SHOW_DOCUMENT_CLICKED   = 'DocumentsTableComponent.Event.ShowDocumentClicked',
  REMOVE_DOCUMENT_CLICKED = 'DocumentsTableComponent.Event.RemoveDocumentClicked',
}

@Component({
  selector: 'emp-ng-documents-table',
  templateUrl: './documents-table.component.html',
})
export class DocumentsTableComponent implements OnChanges {

  @Input() documents: Document[] = [];

  @Input() canEdit = false;

  @Output() documentsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['documentProductName', 'documentNo', 'name', 'documentDate',
                                       'actionShow'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<Document>;


  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.documents) {
      this.setDataTable();
    }
  }


  onSelectDocumentClicked(document: Document) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.documentsTableEvent, DocumentsTableEventType.SELECT_DOCUMENT_CLICKED, { document });
    }
  }


  onShowDocumentClicked(document: Document) {
    sendEvent(this.documentsTableEvent, DocumentsTableEventType.SHOW_DOCUMENT_CLICKED, { document });
  }


  onRemoveDocumentClicked(document: Document) {
    const message = this.getConfirmMessage(document);

    this.messageBox.confirm(message, 'Eliminar documento', 'DeleteCancel')
      .firstValue()
      .then(x =>
        sendEventIf(x, this.documentsTableEvent, DocumentsTableEventType.REMOVE_DOCUMENT_CLICKED, {document})
      );
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.documents);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(document: Document): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>Tipo de documento: </td><td><strong>
          ${document.documentProduct.name}
        </strong></td></tr>

        <tr><td class='nowrap'>Documento: </td><td><strong>
          ${document.documentNo}: ${document.name}
        </strong></td></tr>
      </table>

     <br>¿Elimino el documento?`;
  }

}
