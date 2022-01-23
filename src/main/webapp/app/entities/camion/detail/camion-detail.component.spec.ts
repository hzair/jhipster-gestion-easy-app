import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CamionDetailComponent } from './camion-detail.component';

describe('Camion Management Detail Component', () => {
  let comp: CamionDetailComponent;
  let fixture: ComponentFixture<CamionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CamionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ camion: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CamionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CamionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load camion on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.camion).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
