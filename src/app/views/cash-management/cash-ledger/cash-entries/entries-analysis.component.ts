/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { CashTransactionAnalysisEntry } from '@app/models';


export enum CashEntriesAnalysisEventType {
  CLOSE_BUTTON_CLICKED = 'CashEntriesAnalysisComponent.Event.CloseButtonClicked',
}

@Component({
  selector: 'emp-cf-cash-entries-analysis',
  templateUrl: './entries-analysis.component.html',
})
export class CashEntriesAnalysisComponent implements OnInit {

  @Input() entriesAnalysis: CashTransactionAnalysisEntry[] = [];

  @Output() entriesAnalysisEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['entryLabel', 'currency', 'totalEntries', 'debits', 'credits', 'difference'];

  dataSource: MatTableDataSource<CashTransactionAnalysisEntry>;


  ngOnInit() {
    this.setDataTable();
  }


  onCloseModalClicked() {
    sendEvent(this.entriesAnalysisEvent, CashEntriesAnalysisEventType.CLOSE_BUTTON_CLICKED);
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.entriesAnalysis);
  }

}
