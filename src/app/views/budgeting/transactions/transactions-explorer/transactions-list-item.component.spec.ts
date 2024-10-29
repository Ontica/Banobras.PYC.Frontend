/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsListItemComponent } from './transactions-list-item.component';

describe('TransactionsListItemComponent', () => {
  let component: TransactionsListItemComponent;
  let fixture: ComponentFixture<TransactionsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionsListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
