/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersExplorerComponent } from './suppliers-explorer.component';

describe('SuppliersExplorerComponent', () => {
  let component: SuppliersExplorerComponent;
  let fixture: ComponentFixture<SuppliersExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuppliersExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppliersExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
