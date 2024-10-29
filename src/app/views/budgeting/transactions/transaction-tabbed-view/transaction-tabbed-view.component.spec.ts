/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTabbedViewComponent } from './transaction-tabbed-view.component';

describe('TransactionTabbedViewComponent', () => {
  let component: TransactionTabbedViewComponent;
  let fixture: ComponentFixture<TransactionTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
