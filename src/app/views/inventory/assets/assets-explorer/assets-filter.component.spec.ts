/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsFilterComponent } from './assets-filter.component';

describe('AssetsFilterComponent', () => {
  let component: AssetsFilterComponent;
  let fixture: ComponentFixture<AssetsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
