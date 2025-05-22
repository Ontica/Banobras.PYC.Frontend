/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowProjectionsListHeaderComponent } from './projections-list-header.component';

describe('CashFlowProjectionsListHeaderComponent', () => {
  let component: CashFlowProjectionsListHeaderComponent;
  let fixture: ComponentFixture<CashFlowProjectionsListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowProjectionsListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowProjectionsListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
