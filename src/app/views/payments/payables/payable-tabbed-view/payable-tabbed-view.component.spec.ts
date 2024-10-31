/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableTabbedViewComponent } from './payable-tabbed-view.component';

describe('PayableTabbedViewComponent', () => {
  let component: PayableTabbedViewComponent;
  let fixture: ComponentFixture<PayableTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayableTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayableTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
