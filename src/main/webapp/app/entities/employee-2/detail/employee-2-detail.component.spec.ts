import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Employee2DetailComponent } from './employee-2-detail.component';

describe('Employee2 Management Detail Component', () => {
  let comp: Employee2DetailComponent;
  let fixture: ComponentFixture<Employee2DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Employee2DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ employee2: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Employee2DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Employee2DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load employee2 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.employee2).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
