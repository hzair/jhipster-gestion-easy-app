package com.hza.gestion.service;

import com.hza.gestion.domain.Fournisseur;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Fournisseur}.
 */
public interface FournisseurService {
    /**
     * Save a fournisseur.
     *
     * @param fournisseur the entity to save.
     * @return the persisted entity.
     */
    Fournisseur save(Fournisseur fournisseur);

    /**
     * Partially updates a fournisseur.
     *
     * @param fournisseur the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Fournisseur> partialUpdate(Fournisseur fournisseur);

    /**
     * Get all the fournisseurs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Fournisseur> findAll(Pageable pageable);

    /**
     * Get the "id" fournisseur.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Fournisseur> findOne(Long id);

    /**
     * Delete the "id" fournisseur.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
