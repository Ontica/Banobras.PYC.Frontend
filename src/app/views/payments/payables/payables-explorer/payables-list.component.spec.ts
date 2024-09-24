/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayablesListComponent } from './payables-list.component';

describe('PayablesListComponent', () => {
  let component: PayablesListComponent;
  let fixture: ComponentFixture<PayablesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayablesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayablesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
