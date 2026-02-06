/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo, Identifiable, Validate } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FormHelper, sendEvent, empExpandCollapse } from '@app/shared/utils';

import { ReportQuery, PaymentsReportTypes, PaymentsReportTypesList, DateRange, EmptyReportQuery,
         EmptyDateRange } from '@app/models';


export enum ReportFilterEventType {
  SEARCH_CLICKED = 'ReportFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'ReportFilterComponent.Event.ClearClicked',
}

interface ReportFilterFormModel extends FormGroup<{
  reportType: FormControl<PaymentsReportTypes>;
  datePeriod: FormControl<DateRange>;
}> { }

@Component({
  selector: 'emp-pyc-report-filter',
  templateUrl: './report-filter.component.html',
  animations: [empExpandCollapse],
})
export class ReportFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: ReportQuery = Object.assign({}, EmptyReportQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() reportFilterEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: ReportFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  reportTypesList = PaymentsReportTypesList;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.setFormData();
    }
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      sendEvent(this.reportFilterEvent, ReportFilterEventType.SEARCH_CLICKED, {
        reportType: this.getReportType(),
        query: this.getFormData(),
      });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.reportFilterEvent, ReportFilterEventType.CLEAR_CLICKED, {
      reportType: this.getReportType(),
      query: this.getFormData(),
    });
  }


  private loadDataLists() {

  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      reportType: [PaymentsReportTypes.PaymentsConcepts, Validators.required],
      datePeriod: [EmptyDateRange, [Validators.required, Validate.periodRequired]],
    });
  }


  private setFormData() {
    const datePeriod = {
      fromDate: this.query.fromDate ?? null, toDate: this.query.toDate ?? null
    };

    this.form.reset({
      reportType: this.query.reportType as PaymentsReportTypes,
      datePeriod,
    });
  }


  private getReportType(): Identifiable {
    return this.reportTypesList.find(x => x.uid === this.form.value.reportType) ?? null;
  }


  private getFormData(): ReportQuery {
    const query: ReportQuery = {
      reportType: this.form.value.reportType ?? null,
      fromDate: this.form.value.datePeriod.fromDate ?? null,
      toDate: this.form.value.datePeriod.toDate ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset({
      reportType: this.form.value.reportType,
      datePeriod: EmptyDateRange
    });
  }

}
