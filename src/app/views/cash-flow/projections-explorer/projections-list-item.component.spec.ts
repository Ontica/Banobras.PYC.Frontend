/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowProjectionsListItemComponent } from './projections-list-item.component';

describe('CashFlowProjectionsListItemComponent', () => {
  let component: CashFlowProjectionsListItemComponent;
  let fixture: ComponentFixture<CashFlowProjectionsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowProjectionsListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowProjectionsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
