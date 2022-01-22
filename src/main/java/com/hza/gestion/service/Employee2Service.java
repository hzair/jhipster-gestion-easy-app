package com.hza.gestion.service;

import com.hza.gestion.domain.Employee2;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Employee2}.
 */
public interface Employee2Service {
    /**
     * Save a employee2.
     *
     * @param employee2 the entity to save.
     * @return the persisted entity.
     */
    Employee2 save(Employee2 employee2);

    /**
     * Partially updates a employee2.
     *
     * @param employee2 the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Employee2> partialUpdate(Employee2 employee2);

    /**
     * Get all the employee2s.
     *
     * @return the list of entities.
     */
    List<Employee2> findAll();

    /**
     * Get the "id" employee2.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Employee2> findOne(Long id);

    /**
     * Delete the "id" employee2.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
