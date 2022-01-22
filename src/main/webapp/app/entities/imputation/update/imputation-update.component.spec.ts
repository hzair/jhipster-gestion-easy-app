import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ImputationService } from '../service/imputation.service';
import { IImputation, Imputation } from '../imputation.model';

import { ImputationUpdateComponent } from './imputation-update.component';

describe('Imputation Management Update Component', () => {
  let comp: ImputationUpdateComponent;
  let fixture: ComponentFixture<ImputationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let imputationService: ImputationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ImputationUpdateComponent],
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
      .overrideTemplate(ImputationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ImputationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    imputationService = TestBed.inject(ImputationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const imputation: IImputation = { id: 'CBA' };

      activatedRoute.data = of({ imputation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(imputation));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Imputation>>();
      const imputation = { id: 'ABC' };
      jest.spyOn(imputationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ imputation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: imputation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(imputationService.update).toHaveBeenCalledWith(imputation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Imputation>>();
      const imputation = new Imputation();
      jest.spyOn(imputationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ imputation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: imputation }));
      saveSubject.complete();

      // THEN
      expect(imputationService.create).toHaveBeenCalledWith(imputation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Imputation>>();
      const imputation = { id: 'ABC' };
      jest.spyOn(imputationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ imputation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(imputationService.update).toHaveBeenCalledWith(imputation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
