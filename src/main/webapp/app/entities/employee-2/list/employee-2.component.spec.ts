import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Employee2Service } from '../service/employee-2.service';

import { Employee2Component } from './employee-2.component';

describe('Employee2 Management Component', () => {
  let comp: Employee2Component;
  let fixture: ComponentFixture<Employee2Component>;
  let service: Employee2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Employee2Component],
    })
      .overrideTemplate(Employee2Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Employee2Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Employee2Service);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.employee2s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
