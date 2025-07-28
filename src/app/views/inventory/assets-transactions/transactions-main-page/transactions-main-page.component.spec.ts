/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTransactionsMainPageComponent } from './transactions-main-page.component';

describe('AssetsTransactionsMainPageComponent', () => {
  let component: AssetsTransactionsMainPageComponent;
  let fixture: ComponentFixture<AssetsTransactionsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsTransactionsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTransactionsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
