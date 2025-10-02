/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { EventInfo, Identifiable, Validate } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CashFlowStateSelector, CashLedgerStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent, empExpandCollapse } from '@app/shared/utils';

import { CashFlowReportQuery, CashFlowReportTypes, CashFlowReportTypesList, DateRange,
         EmptyCashFlowReportQuery, EmptyDateRange } from '@app/models';


export enum CashFlowReportFilterEventType {
  SEARCH_CLICKED = 'CashFlowReportFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED = 'CashFlowReportFilterComponent.Event.ClearClicked',
}

interface ReportFilterFormModel extends FormGroup<{
  reportType: FormControl<CashFlowReportTypes>;
  datePeriod: FormControl<DateRange>;
  keywords: FormControl<string[]>;
  operationTypeUID: FormControl<string>;
  accountingLedgerUID: FormControl<string>;
  accounts: FormControl<string[]>;
  subledgerAccounts: FormControl<string[]>;
}> { }

@Component({
  selector: 'emp-cf-cash-flow-report-filter',
  templateUrl: './cash-flow-report-filter.component.html',
  animations: [empExpandCollapse],
})
export class CashFlowReportFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: CashFlowReportQuery = Object.assign({}, EmptyCashFlowReportQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() reportFilterEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: ReportFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  reportTypesList = CashFlowReportTypesList;

  operationTypesList: Identifiable[] = [];

  accountingLedgersList: Identifiable[] = [];


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
      sendEvent(this.reportFilterEvent, CashFlowReportFilterEventType.SEARCH_CLICKED, {
        reportType: this.getReportType(),
        query: this.getFormData(),
      });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.reportFilterEvent, CashFlowReportFilterEventType.CLEAR_CLICKED, {
      reportType: this.getReportType(),
      query: this.getFormData(),
    });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CashFlowStateSelector.OPERATION_TYPES),
      this.helper.select<Identifiable[]>(CashLedgerStateSelector.ACCOUNTING_LEDGERS),
    ])
    .subscribe(([a, b]) => {
      this.operationTypesList = a;
      this.accountingLedgersList = b;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      reportType: [CashFlowReportTypes.ConceptDetail, Validators.required],
      datePeriod: [EmptyDateRange, [Validators.required, Validate.periodRequired]],
      keywords: [null],
      operationTypeUID: [null],
      accountingLedgerUID: [null],
      accounts: [null],
      subledgerAccounts: [null],
    });
  }


  private setFormData() {
    const datePeriod = {
      fromDate: this.query.fromDate ?? null, toDate: this.query.toDate ?? null
    };

    this.form.reset({
      reportType: this.query.reportType,
      datePeriod,
      keywords: this.query.keywords ?? [],
      operationTypeUID: this.query.operationTypeUID,
      accountingLedgerUID: this.query.accountingLedgerUID,
      accounts: this.query.accounts,
      subledgerAccounts: this.query.subledgerAccounts,
    });
  }


  private getReportType(): Identifiable {
    return this.reportTypesList.find(x => x.uid === this.form.value.reportType) ?? null;
  }


  private getFormData(): CashFlowReportQuery {
    const query: CashFlowReportQuery = {
      reportType: this.form.value.reportType ?? null,
      fromDate: this.form.value.datePeriod.fromDate ?? null,
      toDate: this.form.value.datePeriod.toDate ?? null,
      keywords: this.form.value.keywords ?? [],
      operationTypeUID: this.form.value.operationTypeUID ?? null,
      accountingLedgerUID: this.form.value.accountingLedgerUID ?? null,
      accounts: this.form.value.accounts ?? [],
      subledgerAccounts: this.form.value.subledgerAccounts ?? [],
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
