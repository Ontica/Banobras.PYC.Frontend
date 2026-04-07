/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionsDataComponent } from './provisions-data.component';

describe('ProvisionsDataComponent', () => {
  let component: ProvisionsDataComponent;
  let fixture: ComponentFixture<ProvisionsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProvisionsDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvisionsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
