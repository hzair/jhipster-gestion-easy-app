import dayjs from 'dayjs/esm';
import { IProduit } from 'app/entities/produit/produit.model';
import { ICamion } from 'app/entities/camion/camion.model';

export interface ISortie {
  id?: number;
  quantite?: number | null;
  date?: dayjs.Dayjs | null;
  produits?: IProduit[] | null;
  camion?: ICamion | null;
}

export class Sortie implements ISortie {
  constructor(
    public id?: number,
    public quantite?: number | null,
    public date?: dayjs.Dayjs | null,
    public produits?: IProduit[] | null,
    public camion?: ICamion | null
  ) {}
}

export function getSortieIdentifier(sortie: ISortie): number | undefined {
  return sortie.id;
}
