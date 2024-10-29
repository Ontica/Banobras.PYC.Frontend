/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsListHeaderComponent } from './transactions-list-header.component';

describe('TransactionsListHeaderComponent', () => {
  let component: TransactionsListHeaderComponent;
  let fixture: ComponentFixture<TransactionsListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionsListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
