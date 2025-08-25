/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowProjectionsListComponent } from './projections-list.component';

describe('CashFlowProjectionsListComponent', () => {
  let component: CashFlowProjectionsListComponent;
  let fixture: ComponentFixture<CashFlowProjectionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowProjectionsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowProjectionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
