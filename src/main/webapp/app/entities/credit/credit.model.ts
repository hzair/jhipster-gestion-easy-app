import dayjs from 'dayjs/esm';
import { IVendeur } from 'app/entities/vendeur/vendeur.model';
import { IClient } from 'app/entities/client/client.model';

export interface ICredit {
  id?: number;
  montant?: number | null;
  designation?: string | null;
  date?: dayjs.Dayjs | null;
  vendeur?: IVendeur | null;
  client?: IClient | null;
}

export class Credit implements ICredit {
  constructor(
    public id?: number,
    public montant?: number | null,
    public designation?: string | null,
    public date?: dayjs.Dayjs | null,
    public vendeur?: IVendeur | null,
    public client?: IClient | null
  ) {}
}

export function getCreditIdentifier(credit: ICredit): number | undefined {
  return credit.id;
}
