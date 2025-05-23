/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowProjectionHeaderComponent } from './projection-header.component';

describe('CashFlowProjectionHeaderComponent', () => {
  let component: CashFlowProjectionHeaderComponent;
  let fixture: ComponentFixture<CashFlowProjectionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowProjectionHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowProjectionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
