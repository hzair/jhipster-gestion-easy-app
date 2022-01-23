import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VendeurService } from '../service/vendeur.service';
import { IVendeur, Vendeur } from '../vendeur.model';

import { VendeurUpdateComponent } from './vendeur-update.component';

describe('Vendeur Management Update Component', () => {
  let comp: VendeurUpdateComponent;
  let fixture: ComponentFixture<VendeurUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vendeurService: VendeurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VendeurUpdateComponent],
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
      .overrideTemplate(VendeurUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VendeurUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vendeurService = TestBed.inject(VendeurService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const vendeur: IVendeur = { id: 456 };

      activatedRoute.data = of({ vendeur });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(vendeur));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Vendeur>>();
      const vendeur = { id: 123 };
      jest.spyOn(vendeurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vendeur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vendeur }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(vendeurService.update).toHaveBeenCalledWith(vendeur);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Vendeur>>();
      const vendeur = new Vendeur();
      jest.spyOn(vendeurService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vendeur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vendeur }));
      saveSubject.complete();

      // THEN
      expect(vendeurService.create).toHaveBeenCalledWith(vendeur);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Vendeur>>();
      const vendeur = { id: 123 };
      jest.spyOn(vendeurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vendeur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vendeurService.update).toHaveBeenCalledWith(vendeur);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
