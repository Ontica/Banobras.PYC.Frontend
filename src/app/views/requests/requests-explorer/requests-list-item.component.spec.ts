/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsListItemComponent } from './requests-list-item.component';

describe('RequestsListItemComponent', () => {
  let component: RequestsListItemComponent;
  let fixture: ComponentFixture<RequestsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestsListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
