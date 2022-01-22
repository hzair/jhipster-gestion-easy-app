package com.hza.gestion.web.rest;

import com.hza.gestion.domain.Employee2;
import com.hza.gestion.repository.Employee2Repository;
import com.hza.gestion.service.Employee2Service;
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
 * REST controller for managing {@link com.hza.gestion.domain.Employee2}.
 */
@RestController
@RequestMapping("/api")
public class Employee2Resource {

    private final Logger log = LoggerFactory.getLogger(Employee2Resource.class);

    private static final String ENTITY_NAME = "employee2";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Employee2Service employee2Service;

    private final Employee2Repository employee2Repository;

    public Employee2Resource(Employee2Service employee2Service, Employee2Repository employee2Repository) {
        this.employee2Service = employee2Service;
        this.employee2Repository = employee2Repository;
    }

    /**
     * {@code POST  /employee-2-s} : Create a new employee2.
     *
     * @param employee2 the employee2 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new employee2, or with status {@code 400 (Bad Request)} if the employee2 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/employee-2-s")
    public ResponseEntity<Employee2> createEmployee2(@RequestBody Employee2 employee2) throws URISyntaxException {
        log.debug("REST request to save Employee2 : {}", employee2);
        if (employee2.getId() != null) {
            throw new BadRequestAlertException("A new employee2 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Employee2 result = employee2Service.save(employee2);
        return ResponseEntity
            .created(new URI("/api/employee-2-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /employee-2-s/:id} : Updates an existing employee2.
     *
     * @param id the id of the employee2 to save.
     * @param employee2 the employee2 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated employee2,
     * or with status {@code 400 (Bad Request)} if the employee2 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the employee2 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/employee-2-s/{id}")
    public ResponseEntity<Employee2> updateEmployee2(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Employee2 employee2
    ) throws URISyntaxException {
        log.debug("REST request to update Employee2 : {}, {}", id, employee2);
        if (employee2.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, employee2.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!employee2Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Employee2 result = employee2Service.save(employee2);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, employee2.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /employee-2-s/:id} : Partial updates given fields of an existing employee2, field will ignore if it is null
     *
     * @param id the id of the employee2 to save.
     * @param employee2 the employee2 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated employee2,
     * or with status {@code 400 (Bad Request)} if the employee2 is not valid,
     * or with status {@code 404 (Not Found)} if the employee2 is not found,
     * or with status {@code 500 (Internal Server Error)} if the employee2 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/employee-2-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Employee2> partialUpdateEmployee2(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Employee2 employee2
    ) throws URISyntaxException {
        log.debug("REST request to partial update Employee2 partially : {}, {}", id, employee2);
        if (employee2.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, employee2.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!employee2Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Employee2> result = employee2Service.partialUpdate(employee2);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, employee2.getId().toString())
        );
    }

    /**
     * {@code GET  /employee-2-s} : get all the employee2s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of employee2s in body.
     */
    @GetMapping("/employee-2-s")
    public List<Employee2> getAllEmployee2s() {
        log.debug("REST request to get all Employee2s");
        return employee2Service.findAll();
    }

    /**
     * {@code GET  /employee-2-s/:id} : get the "id" employee2.
     *
     * @param id the id of the employee2 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the employee2, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/employee-2-s/{id}")
    public ResponseEntity<Employee2> getEmployee2(@PathVariable Long id) {
        log.debug("REST request to get Employee2 : {}", id);
        Optional<Employee2> employee2 = employee2Service.findOne(id);
        return ResponseUtil.wrapOrNotFound(employee2);
    }

    /**
     * {@code DELETE  /employee-2-s/:id} : delete the "id" employee2.
     *
     * @param id the id of the employee2 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/employee-2-s/{id}")
    public ResponseEntity<Void> deleteEmployee2(@PathVariable Long id) {
        log.debug("REST request to delete Employee2 : {}", id);
        employee2Service.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
