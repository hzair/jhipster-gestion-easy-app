import dayjs from 'dayjs/esm';

export interface IImputation {
  id?: string;
  date?: dayjs.Dayjs | null;
}

export class Imputation implements IImputation {
  constructor(public id?: string, public date?: dayjs.Dayjs | null) {}
}

export function getImputationIdentifier(imputation: IImputation): string | undefined {
  return imputation.id;
}
