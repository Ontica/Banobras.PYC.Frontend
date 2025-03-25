/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransactionCreatorComponent } from './transaction-creator.component';

describe('AssetTransactionCreatorComponent', () => {
  let component: AssetTransactionCreatorComponent;
  let fixture: ComponentFixture<AssetTransactionCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTransactionCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTransactionCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
