import dayjs from 'dayjs/esm';
import { Fonction } from 'app/entities/enumerations/fonction.model';

export interface IEmployee {
  id?: string;
  matricule?: string | null;
  fonction?: Fonction | null;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  dateEmbauche?: dayjs.Dayjs | null;
  salaire?: number | null;
  commissionPct?: number | null;
  manager?: IEmployee | null;
}

export class Employee implements IEmployee {
  constructor(
    public id?: string,
    public matricule?: string | null,
    public fonction?: Fonction | null,
    public nom?: string | null,
    public prenom?: string | null,
    public email?: string | null,
    public phoneNumber?: string | null,
    public dateEmbauche?: dayjs.Dayjs | null,
    public salaire?: number | null,
    public commissionPct?: number | null,
    public manager?: IEmployee | null
  ) {}
}

export function getEmployeeIdentifier(employee: IEmployee): string | undefined {
  return employee.id;
}
