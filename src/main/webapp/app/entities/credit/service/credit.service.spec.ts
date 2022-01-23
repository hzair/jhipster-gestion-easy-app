import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICredit, Credit } from '../credit.model';

import { CreditService } from './credit.service';

describe('Credit Service', () => {
  let service: CreditService;
  let httpMock: HttpTestingController;
  let elemDefault: ICredit;
  let expectedResult: ICredit | ICredit[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CreditService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      montant: 0,
      designation: 'AAAAAAA',
      date: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Credit', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new Credit()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Credit', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          montant: 1,
          designation: 'BBBBBB',
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Credit', () => {
      const patchObject = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        new Credit()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Credit', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          montant: 1,
          designation: 'BBBBBB',
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Credit', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCreditToCollectionIfMissing', () => {
      it('should add a Credit to an empty array', () => {
        const credit: ICredit = { id: 123 };
        expectedResult = service.addCreditToCollectionIfMissing([], credit);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(credit);
      });

      it('should not add a Credit to an array that contains it', () => {
        const credit: ICredit = { id: 123 };
        const creditCollection: ICredit[] = [
          {
            ...credit,
          },
          { id: 456 },
        ];
        expectedResult = service.addCreditToCollectionIfMissing(creditCollection, credit);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Credit to an array that doesn't contain it", () => {
        const credit: ICredit = { id: 123 };
        const creditCollection: ICredit[] = [{ id: 456 }];
        expectedResult = service.addCreditToCollectionIfMissing(creditCollection, credit);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(credit);
      });

      it('should add only unique Credit to an array', () => {
        const creditArray: ICredit[] = [{ id: 123 }, { id: 456 }, { id: 75374 }];
        const creditCollection: ICredit[] = [{ id: 123 }];
        expectedResult = service.addCreditToCollectionIfMissing(creditCollection, ...creditArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const credit: ICredit = { id: 123 };
        const credit2: ICredit = { id: 456 };
        expectedResult = service.addCreditToCollectionIfMissing([], credit, credit2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(credit);
        expect(expectedResult).toContain(credit2);
      });

      it('should accept null and undefined values', () => {
        const credit: ICredit = { id: 123 };
        expectedResult = service.addCreditToCollectionIfMissing([], null, credit, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(credit);
      });

      it('should return initial array if no Credit is added', () => {
        const creditCollection: ICredit[] = [{ id: 123 }];
        expectedResult = service.addCreditToCollectionIfMissing(creditCollection, undefined, null);
        expect(expectedResult).toEqual(creditCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
