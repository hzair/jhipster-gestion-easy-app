import dayjs from 'dayjs/esm';
import { IVendeur } from 'app/entities/vendeur/vendeur.model';
import { ISortie } from 'app/entities/sortie/sortie.model';

export interface ICamion {
  id?: number;
  date?: dayjs.Dayjs | null;
  vendeur?: IVendeur | null;
  produits?: ISortie[] | null;
}

export class Camion implements ICamion {
  constructor(public id?: number, public date?: dayjs.Dayjs | null, public vendeur?: IVendeur | null, public produits?: ISortie[] | null) {}
}

export function getCamionIdentifier(camion: ICamion): number | undefined {
  return camion.id;
}
