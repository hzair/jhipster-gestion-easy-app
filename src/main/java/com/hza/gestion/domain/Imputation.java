package com.hza.gestion.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;

/**
 * A Imputation.
 */
@Entity
@Table(name = "imputation")
public class Imputation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "date")
    private Instant date;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Imputation id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getDate() {
        return this.date;
    }

    public Imputation date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Imputation)) {
            return false;
        }
        return id != null && id.equals(((Imputation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Imputation{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
