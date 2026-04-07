/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionsMainPageComponent } from './provisions-main-page.component';

describe('ProvisionsMainPageComponent', () => {
  let component: ProvisionsMainPageComponent;
  let fixture: ComponentFixture<ProvisionsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProvisionsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvisionsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
