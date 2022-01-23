package com.hza.gestion.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Sortie.
 */
@Entity
@Table(name = "sortie")
public class Sortie implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "quantite")
    private Integer quantite;

    @Column(name = "date")
    private Instant date;

    @OneToMany(mappedBy = "sortie")
    @JsonIgnoreProperties(value = { "fournisseur", "sortie" }, allowSetters = true)
    private Set<Produit> produits = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "vendeur", "produits" }, allowSetters = true)
    private Camion camion;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Sortie id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantite() {
        return this.quantite;
    }

    public Sortie quantite(Integer quantite) {
        this.setQuantite(quantite);
        return this;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public Instant getDate() {
        return this.date;
    }

    public Sortie date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Set<Produit> getProduits() {
        return this.produits;
    }

    public void setProduits(Set<Produit> produits) {
        if (this.produits != null) {
            this.produits.forEach(i -> i.setSortie(null));
        }
        if (produits != null) {
            produits.forEach(i -> i.setSortie(this));
        }
        this.produits = produits;
    }

    public Sortie produits(Set<Produit> produits) {
        this.setProduits(produits);
        return this;
    }

    public Sortie addProduit(Produit produit) {
        this.produits.add(produit);
        produit.setSortie(this);
        return this;
    }

    public Sortie removeProduit(Produit produit) {
        this.produits.remove(produit);
        produit.setSortie(null);
        return this;
    }

    public Camion getCamion() {
        return this.camion;
    }

    public void setCamion(Camion camion) {
        this.camion = camion;
    }

    public Sortie camion(Camion camion) {
        this.setCamion(camion);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sortie)) {
            return false;
        }
        return id != null && id.equals(((Sortie) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Sortie{" +
            "id=" + getId() +
            ", quantite=" + getQuantite() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
