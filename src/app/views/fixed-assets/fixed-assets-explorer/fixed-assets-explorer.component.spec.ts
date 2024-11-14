/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetsExplorerComponent } from './fixed-assets-explorer.component';

describe('FixedAssetsExplorerComponent', () => {
  let component: FixedAssetsExplorerComponent;
  let fixture: ComponentFixture<FixedAssetsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
