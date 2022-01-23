package com.hza.gestion.web.rest;

import com.hza.gestion.domain.Camion;
import com.hza.gestion.repository.CamionRepository;
import com.hza.gestion.service.CamionService;
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
 * REST controller for managing {@link com.hza.gestion.domain.Camion}.
 */
@RestController
@RequestMapping("/api")
public class CamionResource {

    private final Logger log = LoggerFactory.getLogger(CamionResource.class);

    private static final String ENTITY_NAME = "camion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CamionService camionService;

    private final CamionRepository camionRepository;

    public CamionResource(CamionService camionService, CamionRepository camionRepository) {
        this.camionService = camionService;
        this.camionRepository = camionRepository;
    }

    /**
     * {@code POST  /camions} : Create a new camion.
     *
     * @param camion the camion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new camion, or with status {@code 400 (Bad Request)} if the camion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/camions")
    public ResponseEntity<Camion> createCamion(@RequestBody Camion camion) throws URISyntaxException {
        log.debug("REST request to save Camion : {}", camion);
        if (camion.getId() != null) {
            throw new BadRequestAlertException("A new camion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Camion result = camionService.save(camion);
        return ResponseEntity
            .created(new URI("/api/camions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /camions/:id} : Updates an existing camion.
     *
     * @param id the id of the camion to save.
     * @param camion the camion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated camion,
     * or with status {@code 400 (Bad Request)} if the camion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the camion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/camions/{id}")
    public ResponseEntity<Camion> updateCamion(@PathVariable(value = "id", required = false) final Long id, @RequestBody Camion camion)
        throws URISyntaxException {
        log.debug("REST request to update Camion : {}, {}", id, camion);
        if (camion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, camion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!camionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Camion result = camionService.save(camion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, camion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /camions/:id} : Partial updates given fields of an existing camion, field will ignore if it is null
     *
     * @param id the id of the camion to save.
     * @param camion the camion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated camion,
     * or with status {@code 400 (Bad Request)} if the camion is not valid,
     * or with status {@code 404 (Not Found)} if the camion is not found,
     * or with status {@code 500 (Internal Server Error)} if the camion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/camions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Camion> partialUpdateCamion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Camion camion
    ) throws URISyntaxException {
        log.debug("REST request to partial update Camion partially : {}, {}", id, camion);
        if (camion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, camion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!camionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Camion> result = camionService.partialUpdate(camion);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, camion.getId().toString())
        );
    }

    /**
     * {@code GET  /camions} : get all the camions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of camions in body.
     */
    @GetMapping("/camions")
    public List<Camion> getAllCamions() {
        log.debug("REST request to get all Camions");
        return camionService.findAll();
    }

    /**
     * {@code GET  /camions/:id} : get the "id" camion.
     *
     * @param id the id of the camion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the camion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/camions/{id}")
    public ResponseEntity<Camion> getCamion(@PathVariable Long id) {
        log.debug("REST request to get Camion : {}", id);
        Optional<Camion> camion = camionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(camion);
    }

    /**
     * {@code DELETE  /camions/:id} : delete the "id" camion.
     *
     * @param id the id of the camion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/camions/{id}")
    public ResponseEntity<Void> deleteCamion(@PathVariable Long id) {
        log.debug("REST request to delete Camion : {}", id);
        camionService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
