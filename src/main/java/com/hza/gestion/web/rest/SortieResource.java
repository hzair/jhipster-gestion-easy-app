package com.hza.gestion.web.rest;

import com.hza.gestion.domain.Sortie;
import com.hza.gestion.repository.SortieRepository;
import com.hza.gestion.service.SortieService;
import com.hza.gestion.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.hza.gestion.domain.Sortie}.
 */
@RestController
@RequestMapping("/api")
public class SortieResource {

    private final Logger log = LoggerFactory.getLogger(SortieResource.class);

    private static final String ENTITY_NAME = "sortie";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SortieService sortieService;

    private final SortieRepository sortieRepository;

    public SortieResource(SortieService sortieService, SortieRepository sortieRepository) {
        this.sortieService = sortieService;
        this.sortieRepository = sortieRepository;
    }

    /**
     * {@code POST  /sorties} : Create a new sortie.
     *
     * @param sortie the sortie to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sortie, or with status {@code 400 (Bad Request)} if the sortie has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sorties")
    public ResponseEntity<Sortie> createSortie(@RequestBody Sortie sortie) throws URISyntaxException {
        log.debug("REST request to save Sortie : {}", sortie);
        if (sortie.getId() != null) {
            throw new BadRequestAlertException("A new sortie cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Sortie result = sortieService.save(sortie);
        return ResponseEntity
            .created(new URI("/api/sorties/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sorties/:id} : Updates an existing sortie.
     *
     * @param id the id of the sortie to save.
     * @param sortie the sortie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sortie,
     * or with status {@code 400 (Bad Request)} if the sortie is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sortie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sorties/{id}")
    public ResponseEntity<Sortie> updateSortie(@PathVariable(value = "id", required = false) final Long id, @RequestBody Sortie sortie)
        throws URISyntaxException {
        log.debug("REST request to update Sortie : {}, {}", id, sortie);
        if (sortie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sortie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sortieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Sortie result = sortieService.save(sortie);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sortie.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sorties/:id} : Partial updates given fields of an existing sortie, field will ignore if it is null
     *
     * @param id the id of the sortie to save.
     * @param sortie the sortie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sortie,
     * or with status {@code 400 (Bad Request)} if the sortie is not valid,
     * or with status {@code 404 (Not Found)} if the sortie is not found,
     * or with status {@code 500 (Internal Server Error)} if the sortie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sorties/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Sortie> partialUpdateSortie(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Sortie sortie
    ) throws URISyntaxException {
        log.debug("REST request to partial update Sortie partially : {}, {}", id, sortie);
        if (sortie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sortie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sortieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Sortie> result = sortieService.partialUpdate(sortie);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sortie.getId().toString())
        );
    }

    /**
     * {@code GET  /sorties} : get all the sorties.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sorties in body.
     */
    @GetMapping("/sorties")
    public List<Sortie> getAllSorties() {
        log.debug("REST request to get all Sorties");
        return sortieService.findAll();
    }

    /**
     * {@code GET  /sorties/:id} : get the "id" sortie.
     *
     * @param id the id of the sortie to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sortie, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sorties/{id}")
    public ResponseEntity<Sortie> getSortie(@PathVariable Long id) {
        log.debug("REST request to get Sortie : {}", id);
        Optional<Sortie> sortie = sortieService.findOne(id);
        return ResponseUtil.wrapOrNotFound(sortie);
    }

    /**
     * {@code DELETE  /sorties/:id} : delete the "id" sortie.
     *
     * @param id the id of the sortie to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sorties/{id}")
    public ResponseEntity<Void> deleteSortie(@PathVariable Long id) {
        log.debug("REST request to delete Sortie : {}", id);
        sortieService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
