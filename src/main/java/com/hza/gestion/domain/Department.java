package com.hza.gestion.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Department.
 */
@Entity
@Table(name = "department")
public class Department implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "department_name", nullable = false)
    private String departmentName;

    @JsonIgnoreProperties(value = { "country" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Location location;

    /**
     * A relationship
     */
    @Schema(description = "A relationship")
    @OneToMany(mappedBy = "department")
    @JsonIgnoreProperties(value = { "jobs", "department" }, allowSetters = true)
    private Set<Employee2> employee2s = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Department id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDepartmentName() {
        return this.departmentName;
    }

    public Department departmentName(String departmentName) {
        this.setDepartmentName(departmentName);
        return this;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Department location(Location location) {
        this.setLocation(location);
        return this;
    }

    public Set<Employee2> getEmployee2s() {
        return this.employee2s;
    }

    public void setEmployee2s(Set<Employee2> employee2s) {
        if (this.employee2s != null) {
            this.employee2s.forEach(i -> i.setDepartment(null));
        }
        if (employee2s != null) {
            employee2s.forEach(i -> i.setDepartment(this));
        }
        this.employee2s = employee2s;
    }

    public Department employee2s(Set<Employee2> employee2s) {
        this.setEmployee2s(employee2s);
        return this;
    }

    public Department addEmployee2(Employee2 employee2) {
        this.employee2s.add(employee2);
        employee2.setDepartment(this);
        return this;
    }

    public Department removeEmployee2(Employee2 employee2) {
        this.employee2s.remove(employee2);
        employee2.setDepartment(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Department)) {
            return false;
        }
        return id != null && id.equals(((Department) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Department{" +
            "id=" + getId() +
            ", departmentName='" + getDepartmentName() + "'" +
            "}";
    }
}
