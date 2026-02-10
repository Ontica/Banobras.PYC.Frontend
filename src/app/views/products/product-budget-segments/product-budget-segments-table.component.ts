/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { SkipIfSelection } from '@app/shared/decorators';

import { MessageBoxService } from '@app/shared/services';

import { sendEvent, sendEventIf } from '@app/shared/utils';

import { ProductBudgetSegment } from '@app/models';


export enum ProductBudgetSegmentsTableEventType {
  SELECT_ITEM_CLICKED = 'ProductBudgetSegmentsTableComponent.Event.SelectItemClicked',
  REMOVE_ITEM_CLICKED = 'ProductBudgetSegmentsTableComponent.Event.RemoveItemClicked',
}

@Component({
  selector: 'emp-ng-product-budget-segments-table',
  templateUrl: './product-budget-segments-table.component.html',
})
export class ProductBudgetSegmentsTableComponent implements OnChanges {

  @Input() items: ProductBudgetSegment[] = [];

  @Input() canDelete = false;

  @Output() productBudgetSegmentsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['budgetType', 'budgetSegmentType', 'budgetSegment', 'observations'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<ProductBudgetSegment>;


  constructor(private messageBox: MessageBoxService) {}


  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this.setDataTable();
    }
  }


  @SkipIfSelection()
  onSelectItemClicked(item: ProductBudgetSegment) {
    sendEvent(this.productBudgetSegmentsTableEvent, ProductBudgetSegmentsTableEventType.SELECT_ITEM_CLICKED,
      { item });
  }


  onRemoveItemClicked(item: ProductBudgetSegment) {
    const message = this.getConfirmMessage(item);

    this.messageBox.confirm(message, 'Eliminar partida', 'DeleteCancel')
      .firstValue()
      .then(x =>
        sendEventIf(x, this.productBudgetSegmentsTableEvent,
          ProductBudgetSegmentsTableEventType.REMOVE_ITEM_CLICKED, { item })
      );
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.items);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canDelete) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(item: ProductBudgetSegment): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>Producto: </td><td><strong>
          ${item.product.name}
        </strong></td></tr>
        <tr><td class='nowrap'>Tipo de presupuesto: </td><td><strong>
          ${item.budgetType.name}
        </strong></td></tr>
        <tr><td class='nowrap'>Partida: </td><td><strong>
          (${item.budgetSegmentType.name}) ${item.budgetSegment.name}
        </strong></td></tr>
      </table>
     <br>¿Elimino la partida?`;
  }

}
