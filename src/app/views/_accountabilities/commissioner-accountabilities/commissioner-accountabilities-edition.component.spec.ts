/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommisionerAccountabilitiesEditionComponent } from './commissioner-accountabilities-edition.component';

describe('CommisionerAccountabilitiesEditionComponent', () => {
  let component: CommisionerAccountabilitiesEditionComponent;
  let fixture: ComponentFixture<CommisionerAccountabilitiesEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommisionerAccountabilitiesEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommisionerAccountabilitiesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
