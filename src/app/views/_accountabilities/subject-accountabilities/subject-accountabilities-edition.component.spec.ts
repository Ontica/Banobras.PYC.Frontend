/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectAccountabilitiesEditionComponent } from './subject-accountabilities-edition.component';

describe('SubjectAccountabilitiesEditionComponent', () => {
  let component: SubjectAccountabilitiesEditionComponent;
  let fixture: ComponentFixture<SubjectAccountabilitiesEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubjectAccountabilitiesEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectAccountabilitiesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
