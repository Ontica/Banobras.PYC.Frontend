/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowExplorerComponent } from './cash-flow-explorer.component';

describe('CashFlowExplorerComponent', () => {
  let component: CashFlowExplorerComponent;
  let fixture: ComponentFixture<CashFlowExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
