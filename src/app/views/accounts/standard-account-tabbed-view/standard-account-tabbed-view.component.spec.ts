/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardAccountTabbedViewComponent } from './standard-account-tabbed-view.component';

describe('StandardAccountTabbedViewComponent', () => {
  let component: StandardAccountTabbedViewComponent;
  let fixture: ComponentFixture<StandardAccountTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StandardAccountTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardAccountTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
