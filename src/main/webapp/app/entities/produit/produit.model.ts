import dayjs from 'dayjs/esm';

export interface IProduit {
  id?: string;
  idFonc?: string | null;
  idFournisseur?: string | null;
  nom?: string | null;
  description?: string | null;
  quantite?: number | null;
  image?: string | null;
  dateExpiration?: dayjs.Dayjs | null;
}

export class Produit implements IProduit {
  constructor(
    public id?: string,
    public idFonc?: string | null,
    public idFournisseur?: string | null,
    public nom?: string | null,
    public description?: string | null,
    public quantite?: number | null,
    public image?: string | null,
    public dateExpiration?: dayjs.Dayjs | null
  ) {}
}

export function getProduitIdentifier(produit: IProduit): string | undefined {
  return produit.id;
}
