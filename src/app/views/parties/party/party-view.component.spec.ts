/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyViewComponent } from './party-view.component';

describe('PartyViewComponent', () => {
  let component: PartyViewComponent;
  let fixture: ComponentFixture<PartyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
