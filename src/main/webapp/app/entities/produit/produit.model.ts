import dayjs from 'dayjs/esm';
import { IFournisseur } from 'app/entities/fournisseur/fournisseur.model';
import { ISortie } from 'app/entities/sortie/sortie.model';

export interface IProduit {
  id?: number;
  idFonc?: string | null;
  designation?: string;
  description?: string | null;
  quantite?: number;
  prixAchat?: number;
  prixVente?: number;
  prixVenteGros?: number | null;
  imageContentType?: string | null;
  image?: string | null;
  date?: dayjs.Dayjs | null;
  fournisseur?: IFournisseur | null;
  sortie?: ISortie | null;
}

export class Produit implements IProduit {
  constructor(
    public id?: number,
    public idFonc?: string | null,
    public designation?: string,
    public description?: string | null,
    public quantite?: number,
    public prixAchat?: number,
    public prixVente?: number,
    public prixVenteGros?: number | null,
    public imageContentType?: string | null,
    public image?: string | null,
    public date?: dayjs.Dayjs | null,
    public fournisseur?: IFournisseur | null,
    public sortie?: ISortie | null
  ) {}
}

export function getProduitIdentifier(produit: IProduit): number | undefined {
  return produit.id;
}
