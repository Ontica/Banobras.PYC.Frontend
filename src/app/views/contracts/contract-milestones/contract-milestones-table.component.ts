/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ContractMilestone } from '@app/models';

export enum ContractMilestonesTableEventType {
  SELECT_MILESTONE_CLICKED = 'ContractMilestonesTableComponent.Event.SelectMilestoneClicked',
  REMOVE_MILESTONE_CLICKED = 'ContractMilestonesTableComponent.Event.RemoveMilestoneClicked',
}

@Component({
  selector: 'emp-pmt-contract-milestones-table',
  templateUrl: './contract-milestones-table.component.html',
})
export class ContractMilestonesTableComponent implements OnChanges {

  @Input() milestones: ContractMilestone[] = [];

  @Input() canDelete = false;

  @Input() canSelect = false;

  @Output() contractMilestonesTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['milestoneNo', 'name', 'description', 'total', 'status'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<ContractMilestone>;


  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.milestones) {
      this.setDataTable();
    }
  }


  onSelectMilestoneClicked(milestone: ContractMilestone) {
    if (this.canSelect && window.getSelection().toString().length <= 0) {
      sendEvent(this.contractMilestonesTableEvent, ContractMilestonesTableEventType.SELECT_MILESTONE_CLICKED,
        { milestone });
    }
  }


  onRemoveMilestoneClicked(milestone: ContractMilestone) {
    const message = this.getConfirmMessage(milestone);

    this.messageBox.confirm(message, 'Eliminar entrega', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.contractMilestonesTableEvent, ContractMilestonesTableEventType.REMOVE_MILESTONE_CLICKED,
            { milestone });
        }
      });
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.milestones);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canDelete) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(milestone: ContractMilestone): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>No. entrega: </td><td><strong>
          ${milestone.milestoneNo}
        </strong></td></tr>

        <tr><td class='nowrap'>Entrega: </td><td><strong>
          ${milestone.name} (${milestone.description})
        </strong></td></tr>

        <tr><td class='nowrap'>Total: </td><td><strong>
          ${FormatLibrary.numberWithCommas(milestone.total)}
        </strong></td></tr>
      </table>

     <br>¿Elimino la entrega?`;
  }

}
