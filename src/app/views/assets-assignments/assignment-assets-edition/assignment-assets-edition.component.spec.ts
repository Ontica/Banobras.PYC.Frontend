/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsAssignmentAssetsEditionComponent } from './assignment-assets-edition.component';

describe('AssetsAssignmentAssetsEditionComponent', () => {
  let component: AssetsAssignmentAssetsEditionComponent;
  let fixture: ComponentFixture<AssetsAssignmentAssetsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsAssignmentAssetsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsAssignmentAssetsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
