/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableItemsEditionComponent } from './payable-items-edition.component';

describe('PayableItemsEditionComponent', () => {
  let component: PayableItemsEditionComponent;
  let fixture: ComponentFixture<PayableItemsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayableItemsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayableItemsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
