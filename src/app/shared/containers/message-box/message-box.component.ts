/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MessageBoxData } from './message-box.types';


@Component({
  selector: 'emp-ng-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent {

  model: MessageBoxData;

  constructor(private dialogRef: MatDialogRef<MessageBoxComponent>,
              @Inject(MAT_DIALOG_DATA) data: MessageBoxData) {
    this.model = data;
  }


  onClickButton(option: string) {
    if (option === 'accept') {
      this.dialogRef.close(true);
    } else if (option === 'cancel') {
      this.dialogRef.close(false);
    } else {
      this.dialogRef.close();
    }
  }

}
