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

  @Input() title = 'Card title';

  @Input() hint = 'Card hint';

  @Input() disableClose = false;

  @Input() showCardHeaderFlat = false;

  @Output() cardClose = new EventEmitter<void>();

  @Output() cardScroll = new EventEmitter<void>();

  onClose() {
    this.cardClose.emit();
  }

  onWindowScroll($event) {
    this.cardScroll.emit($event.timeStamp);
  }
}
