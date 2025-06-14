/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyTabbedViewComponent } from './party-tabbed-view.component';

describe('PartyTabbedViewComponent', () => {
  let component: PartyTabbedViewComponent;
  let fixture: ComponentFixture<PartyTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartyTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
