/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTransactionCreatorComponent } from './transaction-creator.component';

describe('AssetsTransactionCreatorComponent', () => {
  let component: AssetsTransactionCreatorComponent;
  let fixture: ComponentFixture<AssetsTransactionCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsTransactionCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTransactionCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
