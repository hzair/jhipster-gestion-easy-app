package com.hza.gestion.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;

/**
 * A Produit.
 */
@Entity
@Table(name = "produit")
public class Produit implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "id_fonc")
    private String idFonc;

    @Column(name = "id_fournisseur")
    private String idFournisseur;

    @Column(name = "nom")
    private String nom;

    @Column(name = "description")
    private String description;

    @Column(name = "quantite")
    private Integer quantite;

    @Column(name = "image")
    private String image;

    @Column(name = "date_expiration")
    private Instant dateExpiration;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Produit id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdFonc() {
        return this.idFonc;
    }

    public Produit idFonc(String idFonc) {
        this.setIdFonc(idFonc);
        return this;
    }

    public void setIdFonc(String idFonc) {
        this.idFonc = idFonc;
    }

    public String getIdFournisseur() {
        return this.idFournisseur;
    }

    public Produit idFournisseur(String idFournisseur) {
        this.setIdFournisseur(idFournisseur);
        return this;
    }

    public void setIdFournisseur(String idFournisseur) {
        this.idFournisseur = idFournisseur;
    }

    public String getNom() {
        return this.nom;
    }

    public Produit nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return this.description;
    }

    public Produit description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getQuantite() {
        return this.quantite;
    }

    public Produit quantite(Integer quantite) {
        this.setQuantite(quantite);
        return this;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public String getImage() {
        return this.image;
    }

    public Produit image(String image) {
        this.setImage(image);
        return this;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Instant getDateExpiration() {
        return this.dateExpiration;
    }

    public Produit dateExpiration(Instant dateExpiration) {
        this.setDateExpiration(dateExpiration);
        return this;
    }

    public void setDateExpiration(Instant dateExpiration) {
        this.dateExpiration = dateExpiration;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Produit)) {
            return false;
        }
        return id != null && id.equals(((Produit) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Produit{" +
            "id=" + getId() +
            ", idFonc='" + getIdFonc() + "'" +
            ", idFournisseur='" + getIdFournisseur() + "'" +
            ", nom='" + getNom() + "'" +
            ", description='" + getDescription() + "'" +
            ", quantite=" + getQuantite() +
            ", image='" + getImage() + "'" +
            ", dateExpiration='" + getDateExpiration() + "'" +
            "}";
    }
}
