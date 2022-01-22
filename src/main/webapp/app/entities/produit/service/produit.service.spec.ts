import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProduit, Produit } from '../produit.model';

import { ProduitService } from './produit.service';

describe('Produit Service', () => {
  let service: ProduitService;
  let httpMock: HttpTestingController;
  let elemDefault: IProduit;
  let expectedResult: IProduit | IProduit[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProduitService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      idFonc: 'AAAAAAA',
      idFournisseur: 'AAAAAAA',
      nom: 'AAAAAAA',
      description: 'AAAAAAA',
      quantite: 0,
      image: 'AAAAAAA',
      dateExpiration: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateExpiration: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Produit', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
          dateExpiration: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateExpiration: currentDate,
        },
        returnedFromService
      );

      service.create(new Produit()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Produit', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          idFonc: 'BBBBBB',
          idFournisseur: 'BBBBBB',
          nom: 'BBBBBB',
          description: 'BBBBBB',
          quantite: 1,
          image: 'BBBBBB',
          dateExpiration: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateExpiration: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Produit', () => {
      const patchObject = Object.assign(
        {
          idFonc: 'BBBBBB',
          idFournisseur: 'BBBBBB',
          quantite: 1,
          image: 'BBBBBB',
          dateExpiration: currentDate.format(DATE_TIME_FORMAT),
        },
        new Produit()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateExpiration: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Produit', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          idFonc: 'BBBBBB',
          idFournisseur: 'BBBBBB',
          nom: 'BBBBBB',
          description: 'BBBBBB',
          quantite: 1,
          image: 'BBBBBB',
          dateExpiration: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateExpiration: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Produit', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProduitToCollectionIfMissing', () => {
      it('should add a Produit to an empty array', () => {
        const produit: IProduit = { id: 'ABC' };
        expectedResult = service.addProduitToCollectionIfMissing([], produit);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(produit);
      });

      it('should not add a Produit to an array that contains it', () => {
        const produit: IProduit = { id: 'ABC' };
        const produitCollection: IProduit[] = [
          {
            ...produit,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addProduitToCollectionIfMissing(produitCollection, produit);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Produit to an array that doesn't contain it", () => {
        const produit: IProduit = { id: 'ABC' };
        const produitCollection: IProduit[] = [{ id: 'CBA' }];
        expectedResult = service.addProduitToCollectionIfMissing(produitCollection, produit);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(produit);
      });

      it('should add only unique Produit to an array', () => {
        const produitArray: IProduit[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '043218e0-cdc1-4264-bbb1-6bead479f3b9' }];
        const produitCollection: IProduit[] = [{ id: 'ABC' }];
        expectedResult = service.addProduitToCollectionIfMissing(produitCollection, ...produitArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const produit: IProduit = { id: 'ABC' };
        const produit2: IProduit = { id: 'CBA' };
        expectedResult = service.addProduitToCollectionIfMissing([], produit, produit2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(produit);
        expect(expectedResult).toContain(produit2);
      });

      it('should accept null and undefined values', () => {
        const produit: IProduit = { id: 'ABC' };
        expectedResult = service.addProduitToCollectionIfMissing([], null, produit, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(produit);
      });

      it('should return initial array if no Produit is added', () => {
        const produitCollection: IProduit[] = [{ id: 'ABC' }];
        expectedResult = service.addProduitToCollectionIfMissing(produitCollection, undefined, null);
        expect(expectedResult).toEqual(produitCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
