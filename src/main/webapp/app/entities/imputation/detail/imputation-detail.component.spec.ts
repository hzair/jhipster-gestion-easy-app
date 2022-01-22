import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ImputationDetailComponent } from './imputation-detail.component';

describe('Imputation Management Detail Component', () => {
  let comp: ImputationDetailComponent;
  let fixture: ComponentFixture<ImputationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImputationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ imputation: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(ImputationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ImputationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load imputation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.imputation).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
