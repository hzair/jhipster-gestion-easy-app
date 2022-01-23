export interface IFournisseur {
  id?: number;
  matricule?: string;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  adresse?: string | null;
  phoneNumber?: string | null;
  imageContentType?: string | null;
  image?: string | null;
}

export class Fournisseur implements IFournisseur {
  constructor(
    public id?: number,
    public matricule?: string,
    public nom?: string | null,
    public prenom?: string | null,
    public email?: string | null,
    public adresse?: string | null,
    public phoneNumber?: string | null,
    public imageContentType?: string | null,
    public image?: string | null
  ) {}
}

export function getFournisseurIdentifier(fournisseur: IFournisseur): number | undefined {
  return fournisseur.id;
}
