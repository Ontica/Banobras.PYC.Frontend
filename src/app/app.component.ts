/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'emp-ng-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  ngOnInit() {
    this.preventDragAndDrop();
  }


  private preventDragAndDrop() {
    window.addEventListener('dragover', e => this.preventDropEffect(e), false);
    window.addEventListener('drop', e => this.preventDropEffect(e), false);
  }


  private preventDropEffect(e: DragEvent) {
    e.preventDefault();

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'none';
    }
  }

}
