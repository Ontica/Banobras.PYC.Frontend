/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowProjectionsExplorerComponent } from './projections-explorer.component';

describe('CashFlowProjectionsExplorerComponent', () => {
  let component: CashFlowProjectionsExplorerComponent;
  let fixture: ComponentFixture<CashFlowProjectionsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowProjectionsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowProjectionsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
