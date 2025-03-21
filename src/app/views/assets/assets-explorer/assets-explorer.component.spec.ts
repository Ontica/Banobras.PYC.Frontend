/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsExplorerComponent } from './assets-explorer.component';

describe('AssetsExplorerComponent', () => {
  let component: AssetsExplorerComponent;
  let fixture: ComponentFixture<AssetsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
