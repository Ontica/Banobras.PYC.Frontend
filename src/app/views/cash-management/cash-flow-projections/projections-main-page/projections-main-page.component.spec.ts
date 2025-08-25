/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowProjectionsMainPageComponent } from './projections-main-page.component';

describe('CashFlowProjectionsMainPageComponent', () => {
  let component: CashFlowProjectionsMainPageComponent;
  let fixture: ComponentFixture<CashFlowProjectionsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowProjectionsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowProjectionsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
