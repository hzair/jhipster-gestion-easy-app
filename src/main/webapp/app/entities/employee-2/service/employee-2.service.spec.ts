import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEmployee2, Employee2 } from '../employee-2.model';

import { Employee2Service } from './employee-2.service';

describe('Employee2 Service', () => {
  let service: Employee2Service;
  let httpMock: HttpTestingController;
  let elemDefault: IEmployee2;
  let expectedResult: IEmployee2 | IEmployee2[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Employee2Service);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      firstName: 'AAAAAAA',
      lastName: 'AAAAAAA',
      email: 'AAAAAAA',
      phoneNumber: 'AAAAAAA',
      hireDate: currentDate,
      salary: 0,
      commissionPct: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          hireDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Employee2', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          hireDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          hireDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Employee2()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Employee2', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          email: 'BBBBBB',
          phoneNumber: 'BBBBBB',
          hireDate: currentDate.format(DATE_TIME_FORMAT),
          salary: 1,
          commissionPct: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          hireDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Employee2', () => {
      const patchObject = Object.assign(
        {
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          email: 'BBBBBB',
          phoneNumber: 'BBBBBB',
        },
        new Employee2()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          hireDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Employee2', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          email: 'BBBBBB',
          phoneNumber: 'BBBBBB',
          hireDate: currentDate.format(DATE_TIME_FORMAT),
          salary: 1,
          commissionPct: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          hireDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Employee2', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEmployee2ToCollectionIfMissing', () => {
      it('should add a Employee2 to an empty array', () => {
        const employee2: IEmployee2 = { id: 123 };
        expectedResult = service.addEmployee2ToCollectionIfMissing([], employee2);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(employee2);
      });

      it('should not add a Employee2 to an array that contains it', () => {
        const employee2: IEmployee2 = { id: 123 };
        const employee2Collection: IEmployee2[] = [
          {
            ...employee2,
          },
          { id: 456 },
        ];
        expectedResult = service.addEmployee2ToCollectionIfMissing(employee2Collection, employee2);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Employee2 to an array that doesn't contain it", () => {
        const employee2: IEmployee2 = { id: 123 };
        const employee2Collection: IEmployee2[] = [{ id: 456 }];
        expectedResult = service.addEmployee2ToCollectionIfMissing(employee2Collection, employee2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(employee2);
      });

      it('should add only unique Employee2 to an array', () => {
        const employee2Array: IEmployee2[] = [{ id: 123 }, { id: 456 }, { id: 14446 }];
        const employee2Collection: IEmployee2[] = [{ id: 123 }];
        expectedResult = service.addEmployee2ToCollectionIfMissing(employee2Collection, ...employee2Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const employee2: IEmployee2 = { id: 123 };
        const employee22: IEmployee2 = { id: 456 };
        expectedResult = service.addEmployee2ToCollectionIfMissing([], employee2, employee22);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(employee2);
        expect(expectedResult).toContain(employee22);
      });

      it('should accept null and undefined values', () => {
        const employee2: IEmployee2 = { id: 123 };
        expectedResult = service.addEmployee2ToCollectionIfMissing([], null, employee2, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(employee2);
      });

      it('should return initial array if no Employee2 is added', () => {
        const employee2Collection: IEmployee2[] = [{ id: 123 }];
        expectedResult = service.addEmployee2ToCollectionIfMissing(employee2Collection, undefined, null);
        expect(expectedResult).toEqual(employee2Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
