/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayablesListItemComponent } from './payables-list-item.component';

describe('PayablesListItemComponent', () => {
  let component: PayablesListItemComponent;
  let fixture: ComponentFixture<PayablesListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayablesListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayablesListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
