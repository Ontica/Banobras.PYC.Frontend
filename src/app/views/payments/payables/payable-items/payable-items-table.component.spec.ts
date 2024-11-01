/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableItemsTableComponent } from './payable-items-table.component';

describe('PayableItemsTableComponent', () => {
  let component: PayableItemsTableComponent;
  let fixture: ComponentFixture<PayableItemsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayableItemsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayableItemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
