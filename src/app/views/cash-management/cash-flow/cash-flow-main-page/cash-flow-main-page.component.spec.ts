/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowMainPageComponent } from './cash-flow-main-page.component';

describe('CashFlowMainPageComponent', () => {
  let component: CashFlowMainPageComponent;
  let fixture: ComponentFixture<CashFlowMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
