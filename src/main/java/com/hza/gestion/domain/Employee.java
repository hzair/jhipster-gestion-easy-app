package com.hza.gestion.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hza.gestion.domain.enumeration.Fonction;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;

/**
 * A Employee.
 */
@Entity
@Table(name = "employee")
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "matricule")
    private String matricule;

    @Enumerated(EnumType.STRING)
    @Column(name = "fonction")
    private Fonction fonction;

    @Column(name = "nom")
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "date_embauche")
    private Instant dateEmbauche;

    @Column(name = "salaire")
    private Long salaire;

    @Column(name = "commission_pct")
    private Long commissionPct;

    @ManyToOne
    @JsonIgnoreProperties(value = { "manager" }, allowSetters = true)
    private Employee manager;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Employee id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMatricule() {
        return this.matricule;
    }

    public Employee matricule(String matricule) {
        this.setMatricule(matricule);
        return this;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public Fonction getFonction() {
        return this.fonction;
    }

    public Employee fonction(Fonction fonction) {
        this.setFonction(fonction);
        return this;
    }

    public void setFonction(Fonction fonction) {
        this.fonction = fonction;
    }

    public String getNom() {
        return this.nom;
    }

    public Employee nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public Employee prenom(String prenom) {
        this.setPrenom(prenom);
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return this.email;
    }

    public Employee email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public Employee phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Instant getDateEmbauche() {
        return this.dateEmbauche;
    }

    public Employee dateEmbauche(Instant dateEmbauche) {
        this.setDateEmbauche(dateEmbauche);
        return this;
    }

    public void setDateEmbauche(Instant dateEmbauche) {
        this.dateEmbauche = dateEmbauche;
    }

    public Long getSalaire() {
        return this.salaire;
    }

    public Employee salaire(Long salaire) {
        this.setSalaire(salaire);
        return this;
    }

    public void setSalaire(Long salaire) {
        this.salaire = salaire;
    }

    public Long getCommissionPct() {
        return this.commissionPct;
    }

    public Employee commissionPct(Long commissionPct) {
        this.setCommissionPct(commissionPct);
        return this;
    }

    public void setCommissionPct(Long commissionPct) {
        this.commissionPct = commissionPct;
    }

    public Employee getManager() {
        return this.manager;
    }

    public void setManager(Employee employee) {
        this.manager = employee;
    }

    public Employee manager(Employee employee) {
        this.setManager(employee);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Employee)) {
            return false;
        }
        return id != null && id.equals(((Employee) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Employee{" +
            "id=" + getId() +
            ", matricule='" + getMatricule() + "'" +
            ", fonction='" + getFonction() + "'" +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", email='" + getEmail() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", dateEmbauche='" + getDateEmbauche() + "'" +
            ", salaire=" + getSalaire() +
            ", commissionPct=" + getCommissionPct() +
            "}";
    }
}
