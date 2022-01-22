import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Fonction } from 'app/entities/enumerations/fonction.model';
import { IEmployee, Employee } from '../employee.model';

import { EmployeeService } from './employee.service';

describe('Employee Service', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  let elemDefault: IEmployee;
  let expectedResult: IEmployee | IEmployee[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      matricule: 'AAAAAAA',
      fonction: Fonction.ADMIN,
      nom: 'AAAAAAA',
      prenom: 'AAAAAAA',
      email: 'AAAAAAA',
      phoneNumber: 'AAAAAAA',
      dateEmbauche: currentDate,
      salaire: 0,
      commissionPct: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateEmbauche: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Employee', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
          dateEmbauche: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateEmbauche: currentDate,
        },
        returnedFromService
      );

      service.create(new Employee()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Employee', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          matricule: 'BBBBBB',
          fonction: 'BBBBBB',
          nom: 'BBBBBB',
          prenom: 'BBBBBB',
          email: 'BBBBBB',
          phoneNumber: 'BBBBBB',
          dateEmbauche: currentDate.format(DATE_TIME_FORMAT),
          salaire: 1,
          commissionPct: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateEmbauche: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Employee', () => {
      const patchObject = Object.assign(
        {
          fonction: 'BBBBBB',
          nom: 'BBBBBB',
          prenom: 'BBBBBB',
          email: 'BBBBBB',
          phoneNumber: 'BBBBBB',
          dateEmbauche: currentDate.format(DATE_TIME_FORMAT),
          salaire: 1,
          commissionPct: 1,
        },
        new Employee()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateEmbauche: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Employee', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          matricule: 'BBBBBB',
          fonction: 'BBBBBB',
          nom: 'BBBBBB',
          prenom: 'BBBBBB',
          email: 'BBBBBB',
          phoneNumber: 'BBBBBB',
          dateEmbauche: currentDate.format(DATE_TIME_FORMAT),
          salaire: 1,
          commissionPct: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateEmbauche: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Employee', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEmployeeToCollectionIfMissing', () => {
      it('should add a Employee to an empty array', () => {
        const employee: IEmployee = { id: 'ABC' };
        expectedResult = service.addEmployeeToCollectionIfMissing([], employee);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(employee);
      });

      it('should not add a Employee to an array that contains it', () => {
        const employee: IEmployee = { id: 'ABC' };
        const employeeCollection: IEmployee[] = [
          {
            ...employee,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addEmployeeToCollectionIfMissing(employeeCollection, employee);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Employee to an array that doesn't contain it", () => {
        const employee: IEmployee = { id: 'ABC' };
        const employeeCollection: IEmployee[] = [{ id: 'CBA' }];
        expectedResult = service.addEmployeeToCollectionIfMissing(employeeCollection, employee);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(employee);
      });

      it('should add only unique Employee to an array', () => {
        const employeeArray: IEmployee[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'abf8da19-cbe0-4a7f-9590-bdc5c7ce3e75' }];
        const employeeCollection: IEmployee[] = [{ id: 'ABC' }];
        expectedResult = service.addEmployeeToCollectionIfMissing(employeeCollection, ...employeeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const employee: IEmployee = { id: 'ABC' };
        const employee2: IEmployee = { id: 'CBA' };
        expectedResult = service.addEmployeeToCollectionIfMissing([], employee, employee2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(employee);
        expect(expectedResult).toContain(employee2);
      });

      it('should accept null and undefined values', () => {
        const employee: IEmployee = { id: 'ABC' };
        expectedResult = service.addEmployeeToCollectionIfMissing([], null, employee, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(employee);
      });

      it('should return initial array if no Employee is added', () => {
        const employeeCollection: IEmployee[] = [{ id: 'ABC' }];
        expectedResult = service.addEmployeeToCollectionIfMissing(employeeCollection, undefined, null);
        expect(expectedResult).toEqual(employeeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
