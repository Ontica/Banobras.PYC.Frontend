/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { AlertService } from '@app/shared/services';


@Component({
  selector: 'emp-ng-button-copy-to-clipboard',
  template: `
    <button mat-icon-button [title]="title"
      [cdkCopyToClipboard]="textToCopy"
      (cdkCopyToClipboardCopied)="showAlertTextCopied($event)">

      <mat-icon>
        bookmark
      </mat-icon>

    </button>
  `
})
export class ButtonCopyToClipboardComponent {

  @Input() title = 'Copiar';

  @Input() itemToCopy = '';

  @Input() textToCopy = '';


  constructor(private alertService: AlertService) {

  }


  showAlertTextCopied(copied: boolean) {
    let message = '';

    if (copied) {
      message = this.itemToCopy ? `${this.itemToCopy}: ` : '';
      message += `"${this.textToCopy}" copiado`;

    } else {
      message = `Tuve un problema al copiar el texto "${this.textToCopy}"`;
    }

    this.alertService.openAlert(message, 'Ok');
  }

}
