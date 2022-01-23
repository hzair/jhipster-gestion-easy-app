export interface IVendeur {
  id?: number;
  matricule?: string;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  adresse?: string | null;
  phoneNumber?: string | null;
  salaire?: number | null;
  imageContentType?: string | null;
  image?: string | null;
}

export class Vendeur implements IVendeur {
  constructor(
    public id?: number,
    public matricule?: string,
    public nom?: string | null,
    public prenom?: string | null,
    public email?: string | null,
    public adresse?: string | null,
    public phoneNumber?: string | null,
    public salaire?: number | null,
    public imageContentType?: string | null,
    public image?: string | null
  ) {}
}

export function getVendeurIdentifier(vendeur: IVendeur): number | undefined {
  return vendeur.id;
}
