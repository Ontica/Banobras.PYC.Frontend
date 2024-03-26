/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { combineLatest } from 'rxjs';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccessControlStateSelector } from '@app/presentation/exported.presentation.types';

import { AccessControlQuery, AccessControlQueryType, AccessControlQueryTypeList,
         DefaultAccessControlQueryType } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum AccessControlFilterEventType {
  SEARCH_CLICKED = 'AccessControlFilterComponent.Event.SearchClicked',
}

@Component({
  selector: 'emp-ng-access-control-filter',
  templateUrl: './access-control-filter.component.html',
})
export class AccessControlFilterComponent implements OnInit, OnDestroy {

  @Output() accessControlFilterEvent = new EventEmitter<EventInfo>();

  isLoading = false;

  queryTypesList: Identifiable[] = AccessControlQueryTypeList;

  contextsList: Identifiable[] = [];

  workareasList: Identifiable[] = [];

  formData = {
    queryType: DefaultAccessControlQueryType,
    contextUID: null,
    workareaUID: null,
    keywords: null,
  };

  helper: SubscriptionHelper;

  isContextRequired = false;

  displayWorkarea = true;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.loadDataLists();
    this.validateSelectedQueryType();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isFormValid() {
    return !!this.formData.queryType && this.isValidContextField;
  }


  get isValidContextField(): boolean {
    return AccessControlQueryType.Subjects === this.formData.queryType.uid ? true :
      !!this.formData.contextUID;
  }


  onQueryTypeChanges() {
    this.validateSelectedQueryType()
  }


  onClearKeyword() {
    this.formData.keywords = '';
  }


  onSearchClicked() {
    const payload = {
      query: this.getFormData(),
      queryTypeName: this.formData.queryType.name,
    };

    sendEvent(this.accessControlFilterEvent, AccessControlFilterEventType.SEARCH_CLICKED, payload);
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(AccessControlStateSelector.CONTEXTS_LIST),
      this.helper.select<Identifiable[]>(AccessControlStateSelector.WORKAREAS_LIST),
    ])
    .subscribe(([x, y]) => {
      this.contextsList = x;
      this.workareasList = y;
      this.isLoading = false;
    });
  }


  private validateSelectedQueryType() {
    this.isContextRequired = [AccessControlQueryType.Roles, AccessControlQueryType.Features]
      .includes(this.formData.queryType.uid as AccessControlQueryType);

    this.displayWorkarea = AccessControlQueryType.Subjects === this.formData.queryType.uid;
  }


  private getFormData(): AccessControlQuery {
    const data: AccessControlQuery = {
      queryType: this.formData.queryType.uid || '',
      contextUID: this.formData.contextUID || '',
      workareaUID: this.formData.workareaUID || '',
      keywords: this.formData.keywords || '',
    };

    return data;
  }

}
