/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'emp-ng-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent {

  @Input() searchText = 'Búsqueda general ...';

  @Output() searchBoxChange = new EventEmitter<string>();

  keywords = '';


  onCancel() {
    this.keywords = '';
  }


  onSearch() {
    if (this.keywords) {
      this.searchBoxChange.emit(this.keywords);
    }
  }

}
