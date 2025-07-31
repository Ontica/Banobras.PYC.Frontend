/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'emp-ng-search-tool',
  templateUrl: './search-tool.component.html',
})
export class SearchToolComponent {

  cardHint = 'Seleccionar los filtros';

  isLoading = false;

  formData = {
    partyUID: '',
    type: '0001',
    keywords: '',
  };

  partiesList = [];

  seachTypesList = [
    { uid: '0001', name: 'Conceptos presupuestales'},
    { uid: '0002', name: 'Movimientos contables' },
    { uid: '0003', name: 'Movimientos de flujo de efectivo' },
    { uid: '0004', name: 'Movimientos del sistema de créditos' },
  ];


  onFilterChanges() {

  }


  onSearchClicked() {

  }


  onClearKeywords() {
    this.formData.keywords = '';
    this.onFilterChanges();
  }

}
