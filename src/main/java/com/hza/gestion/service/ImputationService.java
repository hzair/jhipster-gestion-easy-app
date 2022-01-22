package com.hza.gestion.service;

import com.hza.gestion.domain.Imputation;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Imputation}.
 */
public interface ImputationService {
    /**
     * Save a imputation.
     *
     * @param imputation the entity to save.
     * @return the persisted entity.
     */
    Imputation save(Imputation imputation);

    /**
     * Partially updates a imputation.
     *
     * @param imputation the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Imputation> partialUpdate(Imputation imputation);

    /**
     * Get all the imputations.
     *
     * @return the list of entities.
     */
    List<Imputation> findAll();

    /**
     * Get the "id" imputation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Imputation> findOne(String id);

    /**
     * Delete the "id" imputation.
     *
     * @param id the id of the entity.
     */
    void delete(String id);
}
