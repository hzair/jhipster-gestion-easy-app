package com.hza.gestion.service;

import com.hza.gestion.domain.Vendeur;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Vendeur}.
 */
public interface VendeurService {
    /**
     * Save a vendeur.
     *
     * @param vendeur the entity to save.
     * @return the persisted entity.
     */
    Vendeur save(Vendeur vendeur);

    /**
     * Partially updates a vendeur.
     *
     * @param vendeur the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Vendeur> partialUpdate(Vendeur vendeur);

    /**
     * Get all the vendeurs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Vendeur> findAll(Pageable pageable);

    /**
     * Get the "id" vendeur.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Vendeur> findOne(Long id);

    /**
     * Delete the "id" vendeur.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
