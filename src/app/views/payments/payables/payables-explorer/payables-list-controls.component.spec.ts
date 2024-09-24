/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayablesListControlsComponent } from './payables-list-controls.component';

describe('PayablesListControlsComponent', () => {
  let component: PayablesListControlsComponent;
  let fixture: ComponentFixture<PayablesListControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayablesListControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayablesListControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
