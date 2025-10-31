/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { StandardAccountDescriptor } from '@app/models';


export enum FinancialConceptIntegrationTableEventType {
  UPDATED = 'FinancialConceptIntegrationTableComponent.Event.Updated',
}

@Component({
  selector: 'emp-financial-concept-integration-table',
  templateUrl: './financial-concept-integration-table.component.html',
})
export class FinancialConceptIntegrationTableComponent implements OnChanges {

  @Input() integration: StandardAccountDescriptor[] = [];

  @Output() conceptIntegrationTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['number', 'name', 'roleType', 'type', 'debtorCreditorType', 'dates', 'status'];

  dataSource: MatTableDataSource<StandardAccountDescriptor>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.integration) {
      this.dataSource = new MatTableDataSource(this.integration);
    }
  }

}
