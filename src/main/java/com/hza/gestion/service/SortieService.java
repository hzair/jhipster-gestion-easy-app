package com.hza.gestion.service;

import com.hza.gestion.domain.Sortie;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Sortie}.
 */
public interface SortieService {
    /**
     * Save a sortie.
     *
     * @param sortie the entity to save.
     * @return the persisted entity.
     */
    Sortie save(Sortie sortie);

    /**
     * Partially updates a sortie.
     *
     * @param sortie the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Sortie> partialUpdate(Sortie sortie);

    /**
     * Get all the sorties.
     *
     * @return the list of entities.
     */
    List<Sortie> findAll();

    /**
     * Get the "id" sortie.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Sortie> findOne(Long id);

    /**
     * Delete the "id" sortie.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
