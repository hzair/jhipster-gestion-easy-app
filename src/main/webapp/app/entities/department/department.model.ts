import { ILocation } from 'app/entities/location/location.model';
import { IEmployee2 } from 'app/entities/employee-2/employee-2.model';

export interface IDepartment {
  id?: number;
  departmentName?: string;
  location?: ILocation | null;
  employee2s?: IEmployee2[] | null;
}

export class Department implements IDepartment {
  constructor(
    public id?: number,
    public departmentName?: string,
    public location?: ILocation | null,
    public employee2s?: IEmployee2[] | null
  ) {}
}

export function getDepartmentIdentifier(department: IDepartment): number | undefined {
  return department.id;
}
