import { ITask } from 'app/entities/task/task.model';
import { IEmployee2 } from 'app/entities/employee-2/employee-2.model';

export interface IJob {
  id?: number;
  jobTitle?: string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  tasks?: ITask[] | null;
  employee?: IEmployee2 | null;
}

export class Job implements IJob {
  constructor(
    public id?: number,
    public jobTitle?: string | null,
    public minSalary?: number | null,
    public maxSalary?: number | null,
    public tasks?: ITask[] | null,
    public employee?: IEmployee2 | null
  ) {}
}

export function getJobIdentifier(job: IJob): number | undefined {
  return job.id;
}
