/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTableComponent } from './assets-table.component';

describe('AssetsTableComponent', () => {
  let component: AssetsTableComponent;
  let fixture: ComponentFixture<AssetsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
