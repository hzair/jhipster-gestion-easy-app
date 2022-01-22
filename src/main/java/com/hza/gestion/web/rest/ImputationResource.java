package com.hza.gestion.web.rest;

import com.hza.gestion.domain.Imputation;
import com.hza.gestion.repository.ImputationRepository;
import com.hza.gestion.service.ImputationService;
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
 * REST controller for managing {@link com.hza.gestion.domain.Imputation}.
 */
@RestController
@RequestMapping("/api")
public class ImputationResource {

    private final Logger log = LoggerFactory.getLogger(ImputationResource.class);

    private static final String ENTITY_NAME = "imputation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ImputationService imputationService;

    private final ImputationRepository imputationRepository;

    public ImputationResource(ImputationService imputationService, ImputationRepository imputationRepository) {
        this.imputationService = imputationService;
        this.imputationRepository = imputationRepository;
    }

    /**
     * {@code POST  /imputations} : Create a new imputation.
     *
     * @param imputation the imputation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new imputation, or with status {@code 400 (Bad Request)} if the imputation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/imputations")
    public ResponseEntity<Imputation> createImputation(@RequestBody Imputation imputation) throws URISyntaxException {
        log.debug("REST request to save Imputation : {}", imputation);
        if (imputation.getId() != null) {
            throw new BadRequestAlertException("A new imputation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Imputation result = imputationService.save(imputation);
        return ResponseEntity
            .created(new URI("/api/imputations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /imputations/:id} : Updates an existing imputation.
     *
     * @param id the id of the imputation to save.
     * @param imputation the imputation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated imputation,
     * or with status {@code 400 (Bad Request)} if the imputation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the imputation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/imputations/{id}")
    public ResponseEntity<Imputation> updateImputation(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Imputation imputation
    ) throws URISyntaxException {
        log.debug("REST request to update Imputation : {}, {}", id, imputation);
        if (imputation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, imputation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!imputationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Imputation result = imputationService.save(imputation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, imputation.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /imputations/:id} : Partial updates given fields of an existing imputation, field will ignore if it is null
     *
     * @param id the id of the imputation to save.
     * @param imputation the imputation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated imputation,
     * or with status {@code 400 (Bad Request)} if the imputation is not valid,
     * or with status {@code 404 (Not Found)} if the imputation is not found,
     * or with status {@code 500 (Internal Server Error)} if the imputation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/imputations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Imputation> partialUpdateImputation(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Imputation imputation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Imputation partially : {}, {}", id, imputation);
        if (imputation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, imputation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!imputationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Imputation> result = imputationService.partialUpdate(imputation);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, imputation.getId())
        );
    }

    /**
     * {@code GET  /imputations} : get all the imputations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of imputations in body.
     */
    @GetMapping("/imputations")
    public List<Imputation> getAllImputations() {
        log.debug("REST request to get all Imputations");
        return imputationService.findAll();
    }

    /**
     * {@code GET  /imputations/:id} : get the "id" imputation.
     *
     * @param id the id of the imputation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the imputation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/imputations/{id}")
    public ResponseEntity<Imputation> getImputation(@PathVariable String id) {
        log.debug("REST request to get Imputation : {}", id);
        Optional<Imputation> imputation = imputationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(imputation);
    }

    /**
     * {@code DELETE  /imputations/:id} : delete the "id" imputation.
     *
     * @param id the id of the imputation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/imputations/{id}")
    public ResponseEntity<Void> deleteImputation(@PathVariable String id) {
        log.debug("REST request to delete Imputation : {}", id);
        imputationService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
