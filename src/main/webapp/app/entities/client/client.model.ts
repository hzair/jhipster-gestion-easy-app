export interface IClient {
  id?: number;
  matricule?: string | null;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  adresse?: string | null;
  phoneNumber?: string | null;
  imageContentType?: string | null;
  image?: string | null;
}

export class Client implements IClient {
  constructor(
    public id?: number,
    public matricule?: string | null,
    public nom?: string | null,
    public prenom?: string | null,
    public email?: string | null,
    public adresse?: string | null,
    public phoneNumber?: string | null,
    public imageContentType?: string | null,
    public image?: string | null
  ) {}
}

export function getClientIdentifier(client: IClient): number | undefined {
  return client.id;
}
