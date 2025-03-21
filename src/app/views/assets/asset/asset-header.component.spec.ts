/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetHeaderComponent } from './asset-header.component';

describe('AssetHeaderComponent', () => {
  let component: AssetHeaderComponent;
  let fixture: ComponentFixture<AssetHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
