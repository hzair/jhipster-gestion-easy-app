import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CamionService } from '../service/camion.service';
import { ICamion, Camion } from '../camion.model';
import { IVendeur } from 'app/entities/vendeur/vendeur.model';
import { VendeurService } from 'app/entities/vendeur/service/vendeur.service';

import { CamionUpdateComponent } from './camion-update.component';

describe('Camion Management Update Component', () => {
  let comp: CamionUpdateComponent;
  let fixture: ComponentFixture<CamionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let camionService: CamionService;
  let vendeurService: VendeurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CamionUpdateComponent],
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
      .overrideTemplate(CamionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CamionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    camionService = TestBed.inject(CamionService);
    vendeurService = TestBed.inject(VendeurService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call vendeur query and add missing value', () => {
      const camion: ICamion = { id: 456 };
      const vendeur: IVendeur = { id: 38241 };
      camion.vendeur = vendeur;

      const vendeurCollection: IVendeur[] = [{ id: 79725 }];
      jest.spyOn(vendeurService, 'query').mockReturnValue(of(new HttpResponse({ body: vendeurCollection })));
      const expectedCollection: IVendeur[] = [vendeur, ...vendeurCollection];
      jest.spyOn(vendeurService, 'addVendeurToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ camion });
      comp.ngOnInit();

      expect(vendeurService.query).toHaveBeenCalled();
      expect(vendeurService.addVendeurToCollectionIfMissing).toHaveBeenCalledWith(vendeurCollection, vendeur);
      expect(comp.vendeursCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const camion: ICamion = { id: 456 };
      const vendeur: IVendeur = { id: 44689 };
      camion.vendeur = vendeur;

      activatedRoute.data = of({ camion });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(camion));
      expect(comp.vendeursCollection).toContain(vendeur);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Camion>>();
      const camion = { id: 123 };
      jest.spyOn(camionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ camion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: camion }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(camionService.update).toHaveBeenCalledWith(camion);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Camion>>();
      const camion = new Camion();
      jest.spyOn(camionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ camion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: camion }));
      saveSubject.complete();

      // THEN
      expect(camionService.create).toHaveBeenCalledWith(camion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Camion>>();
      const camion = { id: 123 };
      jest.spyOn(camionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ camion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(camionService.update).toHaveBeenCalledWith(camion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackVendeurById', () => {
      it('Should return tracked Vendeur primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackVendeurById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
