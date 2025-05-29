/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowProjectionEntriesEditionComponent } from './projection-entries-edition.component';

describe('CashFlowProjectionEntriesEditionComponent', () => {
  let component: CashFlowProjectionEntriesEditionComponent;
  let fixture: ComponentFixture<CashFlowProjectionEntriesEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowProjectionEntriesEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowProjectionEntriesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
