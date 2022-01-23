import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SortieService } from '../service/sortie.service';
import { ISortie, Sortie } from '../sortie.model';
import { ICamion } from 'app/entities/camion/camion.model';
import { CamionService } from 'app/entities/camion/service/camion.service';

import { SortieUpdateComponent } from './sortie-update.component';

describe('Sortie Management Update Component', () => {
  let comp: SortieUpdateComponent;
  let fixture: ComponentFixture<SortieUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sortieService: SortieService;
  let camionService: CamionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SortieUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SortieUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SortieUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sortieService = TestBed.inject(SortieService);
    camionService = TestBed.inject(CamionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Camion query and add missing value', () => {
      const sortie: ISortie = { id: 456 };
      const camion: ICamion = { id: 18995 };
      sortie.camion = camion;

      const camionCollection: ICamion[] = [{ id: 85715 }];
      jest.spyOn(camionService, 'query').mockReturnValue(of(new HttpResponse({ body: camionCollection })));
      const additionalCamions = [camion];
      const expectedCollection: ICamion[] = [...additionalCamions, ...camionCollection];
      jest.spyOn(camionService, 'addCamionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sortie });
      comp.ngOnInit();

      expect(camionService.query).toHaveBeenCalled();
      expect(camionService.addCamionToCollectionIfMissing).toHaveBeenCalledWith(camionCollection, ...additionalCamions);
      expect(comp.camionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const sortie: ISortie = { id: 456 };
      const camion: ICamion = { id: 49196 };
      sortie.camion = camion;

      activatedRoute.data = of({ sortie });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(sortie));
      expect(comp.camionsSharedCollection).toContain(camion);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sortie>>();
      const sortie = { id: 123 };
      jest.spyOn(sortieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sortie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sortie }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(sortieService.update).toHaveBeenCalledWith(sortie);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sortie>>();
      const sortie = new Sortie();
      jest.spyOn(sortieService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sortie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sortie }));
      saveSubject.complete();

      // THEN
      expect(sortieService.create).toHaveBeenCalledWith(sortie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sortie>>();
      const sortie = { id: 123 };
      jest.spyOn(sortieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sortie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sortieService.update).toHaveBeenCalledWith(sortie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCamionById', () => {
      it('Should return tracked Camion primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCamionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
