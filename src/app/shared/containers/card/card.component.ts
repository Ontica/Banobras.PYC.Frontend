/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'emp-ng-card',
  templateUrl: './card.component.html',
  styleUrls: ['../../../../styles/card.scss']
})
export class CardComponent {

  @Input() heading = 'Card title';

  @Input() hint = 'Card hint';

  @Input() showHint = true;

  @Input() headerHighlight = false;

  @Input() disableClose = false;

  @Input() showExpand = false;

  @Input() showInfo = false;

  @Input() expanded = false;

  @Input() showCardHeaderFlat = false;

  @Output() cardClose = new EventEmitter<void>();

  @Output() cardExpand = new EventEmitter<void>();

  @Output() cardInfo = new EventEmitter<void>();

  @Output() cardScroll = new EventEmitter<void>();


  onClose() {
    this.cardClose.emit();
  }


  onExpand() {
    this.cardExpand.emit();
  }


  onInfo() {
    this.cardInfo.emit();
  }


  onWindowScroll($event) {
    this.cardScroll.emit($event.timeStamp);
  }

}
