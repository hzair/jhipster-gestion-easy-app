import dayjs from 'dayjs/esm';
import { IJob } from 'app/entities/job/job.model';
import { IDepartment } from 'app/entities/department/department.model';

export interface IEmployee2 {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  hireDate?: dayjs.Dayjs | null;
  salary?: number | null;
  commissionPct?: number | null;
  jobs?: IJob[] | null;
  department?: IDepartment | null;
}

export class Employee2 implements IEmployee2 {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public phoneNumber?: string | null,
    public hireDate?: dayjs.Dayjs | null,
    public salary?: number | null,
    public commissionPct?: number | null,
    public jobs?: IJob[] | null,
    public department?: IDepartment | null
  ) {}
}

export function getEmployee2Identifier(employee2: IEmployee2): number | undefined {
  return employee2.id;
}
