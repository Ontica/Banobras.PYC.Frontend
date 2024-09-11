/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsOrdersExplorerComponent } from './payments-orders-explorer.component';

describe('PaymentsOrdersExplorerComponent', () => {
  let component: PaymentsOrdersExplorerComponent;
  let fixture: ComponentFixture<PaymentsOrdersExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsOrdersExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsOrdersExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
