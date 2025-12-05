/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DateString, DateStringLibrary, EventInfo, isEmpty } from '@app/core';

import { FormHelper } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { EmptyParty, EmptyPartyActions, EmptyPartyExplorerTypeConfig , ExplorerTypeConfig, OrgUnit,
         Party, PartyActions, PartyObjectTypes } from '@app/models';


export enum PartyViewEventType {
  ACCOUNT_UPDATED = 'PartyViewComponent.Event.AccountUpdated',
}


interface PartyFormModel extends FormGroup<{
  type: FormControl<string>;
  code: FormControl<string>;
  name: FormControl<string>;
  responsible: FormControl<string>;
  startDate: FormControl<DateString>;
  endDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-ng-party-view',
  templateUrl: './party-view.component.html',
})
export class PartyViewComponent implements OnChanges {

  @Input() config: ExplorerTypeConfig<PartyObjectTypes> = EmptyPartyExplorerTypeConfig;

  @Input() data: Party = EmptyParty;

  @Output() partyViewEvent = new EventEmitter<EventInfo>();

  form: PartyFormModel;

  formHelper = FormHelper;

  editionMode = false;


  constructor(private messageBox: MessageBoxService) {
    this.initForm();
  }


  ngOnChanges() {
    this.validateSetData();
  }


  get displayOrgUnitFields(): boolean {
    return this.config.type === PartyObjectTypes.ORGANIZATIONAL_UNITS;
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      type: [null],
      code: [null],
      name: [null],
      responsible: [null],
      startDate: [null],
      endDate: [null],
    });
  }


  private validateSetData() {
    switch (this.config.type) {
      case PartyObjectTypes.ORGANIZATIONAL_UNITS:
        return this.setOrgUnitData();
      case PartyObjectTypes.SUPPLIER:
      default:
        return this.setPartyData();
    }
  }


  private setPartyData() {
    this.form.reset({
      type: isEmpty(this.data.type) ? '': this.data.type.name,
      name: this.data.name,
    });

    this.formHelper.setDisableForm(this.form, true);
  }


  private setOrgUnitData() {
    const data = this.data as OrgUnit;

    this.form.reset({
      type: data.type.name,
      code: data.code,
      name: data.name,
      responsible: data.responsible.name,
      startDate: DateStringLibrary.format(data.startDate),
      endDate: DateStringLibrary.format(data.endDate),
    });

    this.formHelper.setDisableForm(this.form, true);
  }

}
