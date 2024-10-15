/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListControlsComponent } from './list-controls.component';

describe('ListControlsComponent', () => {
  let component: ListControlsComponent;
  let fixture: ComponentFixture<ListControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
