/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayablesListHeaderComponent } from './payables-list-header.component';

describe('PayablesListHeaderComponent', () => {
  let component: PayablesListHeaderComponent;
  let fixture: ComponentFixture<PayablesListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayablesListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayablesListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
