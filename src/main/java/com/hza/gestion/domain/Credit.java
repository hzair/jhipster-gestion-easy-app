package com.hza.gestion.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;

/**
 * A Credit.
 */
@Entity
@Table(name = "credit")
public class Credit implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "montant")
    private Long montant;

    @Column(name = "designation")
    private String designation;

    @Column(name = "date")
    private Instant date;

    @OneToOne
    @JoinColumn(unique = true)
    private Vendeur vendeur;

    @OneToOne
    @JoinColumn(unique = true)
    private Client client;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Credit id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMontant() {
        return this.montant;
    }

    public Credit montant(Long montant) {
        this.setMontant(montant);
        return this;
    }

    public void setMontant(Long montant) {
        this.montant = montant;
    }

    public String getDesignation() {
        return this.designation;
    }

    public Credit designation(String designation) {
        this.setDesignation(designation);
        return this;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Instant getDate() {
        return this.date;
    }

    public Credit date(Instant date) {
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

    public Credit vendeur(Vendeur vendeur) {
        this.setVendeur(vendeur);
        return this;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Credit client(Client client) {
        this.setClient(client);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Credit)) {
            return false;
        }
        return id != null && id.equals(((Credit) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Credit{" +
            "id=" + getId() +
            ", montant=" + getMontant() +
            ", designation='" + getDesignation() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
