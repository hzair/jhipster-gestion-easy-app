import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CreditService } from '../service/credit.service';
import { ICredit, Credit } from '../credit.model';
import { IVendeur } from 'app/entities/vendeur/vendeur.model';
import { VendeurService } from 'app/entities/vendeur/service/vendeur.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';

import { CreditUpdateComponent } from './credit-update.component';

describe('Credit Management Update Component', () => {
  let comp: CreditUpdateComponent;
  let fixture: ComponentFixture<CreditUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let creditService: CreditService;
  let vendeurService: VendeurService;
  let clientService: ClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CreditUpdateComponent],
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
      .overrideTemplate(CreditUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CreditUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    creditService = TestBed.inject(CreditService);
    vendeurService = TestBed.inject(VendeurService);
    clientService = TestBed.inject(ClientService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call vendeur query and add missing value', () => {
      const credit: ICredit = { id: 456 };
      const vendeur: IVendeur = { id: 81567 };
      credit.vendeur = vendeur;

      const vendeurCollection: IVendeur[] = [{ id: 71508 }];
      jest.spyOn(vendeurService, 'query').mockReturnValue(of(new HttpResponse({ body: vendeurCollection })));
      const expectedCollection: IVendeur[] = [vendeur, ...vendeurCollection];
      jest.spyOn(vendeurService, 'addVendeurToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ credit });
      comp.ngOnInit();

      expect(vendeurService.query).toHaveBeenCalled();
      expect(vendeurService.addVendeurToCollectionIfMissing).toHaveBeenCalledWith(vendeurCollection, vendeur);
      expect(comp.vendeursCollection).toEqual(expectedCollection);
    });

    it('Should call client query and add missing value', () => {
      const credit: ICredit = { id: 456 };
      const client: IClient = { id: 27727 };
      credit.client = client;

      const clientCollection: IClient[] = [{ id: 11359 }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const expectedCollection: IClient[] = [client, ...clientCollection];
      jest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ credit });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(clientCollection, client);
      expect(comp.clientsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const credit: ICredit = { id: 456 };
      const vendeur: IVendeur = { id: 28243 };
      credit.vendeur = vendeur;
      const client: IClient = { id: 79328 };
      credit.client = client;

      activatedRoute.data = of({ credit });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(credit));
      expect(comp.vendeursCollection).toContain(vendeur);
      expect(comp.clientsCollection).toContain(client);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Credit>>();
      const credit = { id: 123 };
      jest.spyOn(creditService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ credit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: credit }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(creditService.update).toHaveBeenCalledWith(credit);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Credit>>();
      const credit = new Credit();
      jest.spyOn(creditService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ credit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: credit }));
      saveSubject.complete();

      // THEN
      expect(creditService.create).toHaveBeenCalledWith(credit);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Credit>>();
      const credit = { id: 123 };
      jest.spyOn(creditService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ credit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(creditService.update).toHaveBeenCalledWith(credit);
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

    describe('trackClientById', () => {
      it('Should return tracked Client primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackClientById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
