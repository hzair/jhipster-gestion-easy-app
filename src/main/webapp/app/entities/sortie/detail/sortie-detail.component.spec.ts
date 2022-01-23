import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SortieDetailComponent } from './sortie-detail.component';

describe('Sortie Management Detail Component', () => {
  let comp: SortieDetailComponent;
  let fixture: ComponentFixture<SortieDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortieDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sortie: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SortieDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SortieDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sortie on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sortie).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
