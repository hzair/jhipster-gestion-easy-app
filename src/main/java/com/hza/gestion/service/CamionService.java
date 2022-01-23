package com.hza.gestion.service;

import com.hza.gestion.domain.Camion;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Camion}.
 */
public interface CamionService {
    /**
     * Save a camion.
     *
     * @param camion the entity to save.
     * @return the persisted entity.
     */
    Camion save(Camion camion);

    /**
     * Partially updates a camion.
     *
     * @param camion the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Camion> partialUpdate(Camion camion);

    /**
     * Get all the camions.
     *
     * @return the list of entities.
     */
    List<Camion> findAll();

    /**
     * Get the "id" camion.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Camion> findOne(Long id);

    /**
     * Delete the "id" camion.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
