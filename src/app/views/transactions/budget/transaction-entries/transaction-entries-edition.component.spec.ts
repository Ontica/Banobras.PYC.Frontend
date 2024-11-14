/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionEntriesEditionComponent } from './transaction-entries-edition.component';

describe('TransactionEntriesEditionComponent', () => {
  let component: TransactionEntriesEditionComponent;
  let fixture: ComponentFixture<TransactionEntriesEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionEntriesEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionEntriesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
