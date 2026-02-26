/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { BillConcept } from '@app/models';

@Component({
  selector: 'emp-ng-bill-concepts-table',
  templateUrl: './bill-concepts-table.component.html',
})
export class BillConceptsTableComponent implements OnChanges {

  @Input() concepts: BillConcept[] = [];

  displayedColumns = ['product', 'description', 'quantity', 'unitPrice', 'taxes', 'discount', 'subtotal'];

  dataSource: MatTableDataSource<BillConcept>;


  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.concepts);
  }

}
