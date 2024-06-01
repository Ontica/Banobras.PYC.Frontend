import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsFilterComponent } from './requests-filter.component';

describe('RequestsFilterComponent', () => {
  let component: RequestsFilterComponent;
  let fixture: ComponentFixture<RequestsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
