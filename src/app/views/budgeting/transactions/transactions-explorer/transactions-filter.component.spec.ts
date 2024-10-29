/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsFilterComponent } from './transactions-filter.component';

describe('TransactionsFilterComponent', () => {
  let component: TransactionsFilterComponent;
  let fixture: ComponentFixture<TransactionsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
