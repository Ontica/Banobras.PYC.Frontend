/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionEntriesControlsComponent } from './transaction-entries-controls.component';

describe('TransactionEntriesControlsComponent', () => {
  let component: TransactionEntriesControlsComponent;
  let fixture: ComponentFixture<TransactionEntriesControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionEntriesControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionEntriesControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
