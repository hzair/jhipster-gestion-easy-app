import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVendeur, Vendeur } from '../vendeur.model';

import { VendeurService } from './vendeur.service';

describe('Vendeur Service', () => {
  let service: VendeurService;
  let httpMock: HttpTestingController;
  let elemDefault: IVendeur;
  let expectedResult: IVendeur | IVendeur[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VendeurService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      matricule: 'AAAAAAA',
      nom: 'AAAAAAA',
      prenom: 'AAAAAAA',
      email: 'AAAAAAA',
      adresse: 'AAAAAAA',
      phoneNumber: 'AAAAAAA',
      salaire: 0,
      imageContentType: 'image/png',
      image: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Vendeur', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Vendeur()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Vendeur', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          matricule: 'BBBBBB',
          nom: 'BBBBBB',
          prenom: 'BBBBBB',
          email: 'BBBBBB',
          adresse: 'BBBBBB',
          phoneNumber: 'BBBBBB',
          salaire: 1,
          image: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Vendeur', () => {
      const patchObject = Object.assign(
        {
          nom: 'BBBBBB',
          email: 'BBBBBB',
          phoneNumber: 'BBBBBB',
          image: 'BBBBBB',
        },
        new Vendeur()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Vendeur', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          matricule: 'BBBBBB',
          nom: 'BBBBBB',
          prenom: 'BBBBBB',
          email: 'BBBBBB',
          adresse: 'BBBBBB',
          phoneNumber: 'BBBBBB',
          salaire: 1,
          image: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Vendeur', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addVendeurToCollectionIfMissing', () => {
      it('should add a Vendeur to an empty array', () => {
        const vendeur: IVendeur = { id: 123 };
        expectedResult = service.addVendeurToCollectionIfMissing([], vendeur);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vendeur);
      });

      it('should not add a Vendeur to an array that contains it', () => {
        const vendeur: IVendeur = { id: 123 };
        const vendeurCollection: IVendeur[] = [
          {
            ...vendeur,
          },
          { id: 456 },
        ];
        expectedResult = service.addVendeurToCollectionIfMissing(vendeurCollection, vendeur);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Vendeur to an array that doesn't contain it", () => {
        const vendeur: IVendeur = { id: 123 };
        const vendeurCollection: IVendeur[] = [{ id: 456 }];
        expectedResult = service.addVendeurToCollectionIfMissing(vendeurCollection, vendeur);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vendeur);
      });

      it('should add only unique Vendeur to an array', () => {
        const vendeurArray: IVendeur[] = [{ id: 123 }, { id: 456 }, { id: 78732 }];
        const vendeurCollection: IVendeur[] = [{ id: 123 }];
        expectedResult = service.addVendeurToCollectionIfMissing(vendeurCollection, ...vendeurArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vendeur: IVendeur = { id: 123 };
        const vendeur2: IVendeur = { id: 456 };
        expectedResult = service.addVendeurToCollectionIfMissing([], vendeur, vendeur2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vendeur);
        expect(expectedResult).toContain(vendeur2);
      });

      it('should accept null and undefined values', () => {
        const vendeur: IVendeur = { id: 123 };
        expectedResult = service.addVendeurToCollectionIfMissing([], null, vendeur, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vendeur);
      });

      it('should return initial array if no Vendeur is added', () => {
        const vendeurCollection: IVendeur[] = [{ id: 123 }];
        expectedResult = service.addVendeurToCollectionIfMissing(vendeurCollection, undefined, null);
        expect(expectedResult).toEqual(vendeurCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
