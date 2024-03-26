/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { AccessControlDataService } from '@app/data-services';

import { Feature } from '@app/models';

import { SecurityItemEditionEventType } from '../security-item/security-item-edition.component';


@Component({
  selector: 'emp-ng-subject-features',
  templateUrl: './subject-features.component.html',
})
export class SubjectFeaturesComponent implements OnChanges {

  @Input() subjectUID: string = '';

  @Input() subjectContextsList: Identifiable[] = [];

  @Input() canEdit = true;

  featuresList: Feature[] = [];

  subjectFeaturesList: Identifiable[] = [];

  submitted = false;

  isLoading = false;

  isExcecuted = false;


  constructor(private accessControlData: AccessControlDataService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.subjectUID) {
      this.resetData();
    }
  }


  onSubjectFeaturesEditionEvent(event: EventInfo) {
    switch (event.type as SecurityItemEditionEventType) {
      case SecurityItemEditionEventType.SELECTOR_CHANGED:
        this.validateLoadSubjectFeaturesByContext(event.payload.selectorUID ?? '');
        return;

      case SecurityItemEditionEventType.ASSIGN_ITEM: {
        Assertion.assertValue(event.payload.selectorUID, 'event.payload.selectorUID');
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');

        const contextUID = event.payload.selectorUID;
        const featureUID = event.payload.itemUID;

        this.assignFeatureToSubject(this.subjectUID, contextUID, featureUID);
        return;
      }

      case SecurityItemEditionEventType.REMOVE_ITEM: {
        Assertion.assertValue(event.payload.selectorUID, 'event.payload.selectorUID');
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');

        const contextUID = event.payload.selectorUID;
        const featureUID = event.payload.itemUID;

        this.removeFeatureToSubject(this.subjectUID, contextUID, featureUID);
        return;
      }

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private resetData() {
    this.subjectFeaturesList = [];
    this.isExcecuted = false;
  }


  private validateLoadSubjectFeaturesByContext(contextUID: string) {
    this.featuresList = [];
    this.subjectFeaturesList = [];

    if (!contextUID) {
      this.isExcecuted = false;
      return;
    }

    this.getFeaturesByContext(contextUID);
    this.getSubjectFeaturesByContext(contextUID);
  }


  private getFeaturesByContext(contextUID: string) {
    this.accessControlData.getFeaturesByContext(contextUID)
      .firstValue()
      .then(x => this.featuresList = x);
  }


  private getSubjectFeaturesByContext(contextUID: string) {
    this.isLoading = true;

    this.accessControlData.getSubjectFeaturesByContext(this.subjectUID, contextUID)
      .firstValue()
      .then(x => this.subjectFeaturesList = x)
      .finally(() => {
        this.isLoading = false;
        this.isExcecuted = true;
      });
  }


  private assignFeatureToSubject(subjectUID: string, contextUID: string, featureUID: string) {
    this.submitted = true;

    this.accessControlData.assignFeatureToSubject(subjectUID, contextUID, featureUID)
      .firstValue()
      .then(x => this.subjectFeaturesList = x)
      .finally(() => this.submitted = false);
  }


  private removeFeatureToSubject(subjectUID: string, contextUID: string, featureUID: string) {
    this.submitted = true;

    this.accessControlData.removeFeatureToSubject(subjectUID, contextUID, featureUID)
      .firstValue()
      .then(x => this.subjectFeaturesList = x)
      .finally(() => this.submitted = false);
  }

}
