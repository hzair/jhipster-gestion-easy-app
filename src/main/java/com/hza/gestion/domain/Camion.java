package com.hza.gestion.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Camion.
 */
@Entity
@Table(name = "camion")
public class Camion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private Instant date;

    @OneToOne
    @JoinColumn(unique = true)
    private Vendeur vendeur;

    @OneToMany(mappedBy = "camion")
    @JsonIgnoreProperties(value = { "produits", "camion" }, allowSetters = true)
    private Set<Sortie> produits = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Camion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDate() {
        return this.date;
    }

    public Camion date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Vendeur getVendeur() {
        return this.vendeur;
    }

    public void setVendeur(Vendeur vendeur) {
        this.vendeur = vendeur;
    }

    public Camion vendeur(Vendeur vendeur) {
        this.setVendeur(vendeur);
        return this;
    }

    public Set<Sortie> getProduits() {
        return this.produits;
    }

    public void setProduits(Set<Sortie> sorties) {
        if (this.produits != null) {
            this.produits.forEach(i -> i.setCamion(null));
        }
        if (sorties != null) {
            sorties.forEach(i -> i.setCamion(this));
        }
        this.produits = sorties;
    }

    public Camion produits(Set<Sortie> sorties) {
        this.setProduits(sorties);
        return this;
    }

    public Camion addProduit(Sortie sortie) {
        this.produits.add(sortie);
        sortie.setCamion(this);
        return this;
    }

    public Camion removeProduit(Sortie sortie) {
        this.produits.remove(sortie);
        sortie.setCamion(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Camion)) {
            return false;
        }
        return id != null && id.equals(((Camion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Camion{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
