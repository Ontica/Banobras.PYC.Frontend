/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionHeaderComponent } from './transaction-header.component';

describe('TransactionHeaderComponent', () => {
  let component: TransactionHeaderComponent;
  let fixture: ComponentFixture<TransactionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
