package com.hza.gestion.service;

import com.hza.gestion.domain.Credit;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Credit}.
 */
public interface CreditService {
    /**
     * Save a credit.
     *
     * @param credit the entity to save.
     * @return the persisted entity.
     */
    Credit save(Credit credit);

    /**
     * Partially updates a credit.
     *
     * @param credit the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Credit> partialUpdate(Credit credit);

    /**
     * Get all the credits.
     *
     * @return the list of entities.
     */
    List<Credit> findAll();

    /**
     * Get the "id" credit.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Credit> findOne(Long id);

    /**
     * Delete the "id" credit.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
