/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillTabbedViewComponent } from './bill-tabbed-view.component';

describe('BillTabbedViewComponent', () => {
  let component: BillTabbedViewComponent;
  let fixture: ComponentFixture<BillTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
