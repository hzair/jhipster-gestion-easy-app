package com.hza.gestion.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.hza.gestion.IntegrationTest;
import com.hza.gestion.domain.Camion;
import com.hza.gestion.repository.CamionRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CamionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CamionResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/camions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CamionRepository camionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCamionMockMvc;

    private Camion camion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Camion createEntity(EntityManager em) {
        Camion camion = new Camion().date(DEFAULT_DATE);
        return camion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Camion createUpdatedEntity(EntityManager em) {
        Camion camion = new Camion().date(UPDATED_DATE);
        return camion;
    }

    @BeforeEach
    public void initTest() {
        camion = createEntity(em);
    }

    @Test
    @Transactional
    void createCamion() throws Exception {
        int databaseSizeBeforeCreate = camionRepository.findAll().size();
        // Create the Camion
        restCamionMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(camion))
            )
            .andExpect(status().isCreated());

        // Validate the Camion in the database
        List<Camion> camionList = camionRepository.findAll();
        assertThat(camionList).hasSize(databaseSizeBeforeCreate + 1);
        Camion testCamion = camionList.get(camionList.size() - 1);
        assertThat(testCamion.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createCamionWithExistingId() throws Exception {
        // Create the Camion with an existing ID
        camion.setId(1L);

        int databaseSizeBeforeCreate = camionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCamionMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(camion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Camion in the database
        List<Camion> camionList = camionRepository.findAll();
        assertThat(camionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCamions() throws Exception {
        // Initialize the database
        camionRepository.saveAndFlush(camion);

        // Get all the camionList
        restCamionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(camion.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getCamion() throws Exception {
        // Initialize the database
        camionRepository.saveAndFlush(camion);

        // Get the camion
        restCamionMockMvc
            .perform(get(ENTITY_API_URL_ID, camion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(camion.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCamion() throws Exception {
        // Get the camion
        restCamionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCamion() throws Exception {
        // Initialize the database
        camionRepository.saveAndFlush(camion);

        int databaseSizeBeforeUpdate = camionRepository.findAll().size();

        // Update the camion
        Camion updatedCamion = camionRepository.findById(camion.getId()).get();
        // Disconnect from session so that the updates on updatedCamion are not directly saved in db
        em.detach(updatedCamion);
        updatedCamion.date(UPDATED_DATE);

        restCamionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCamion.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCamion))
            )
            .andExpect(status().isOk());

        // Validate the Camion in the database
        List<Camion> camionList = camionRepository.findAll();
        assertThat(camionList).hasSize(databaseSizeBeforeUpdate);
        Camion testCamion = camionList.get(camionList.size() - 1);
        assertThat(testCamion.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingCamion() throws Exception {
        int databaseSizeBeforeUpdate = camionRepository.findAll().size();
        camion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCamionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, camion.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(camion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Camion in the database
        List<Camion> camionList = camionRepository.findAll();
        assertThat(camionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCamion() throws Exception {
        int databaseSizeBeforeUpdate = camionRepository.findAll().size();
        camion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCamionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(camion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Camion in the database
        List<Camion> camionList = camionRepository.findAll();
        assertThat(camionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCamion() throws Exception {
        int databaseSizeBeforeUpdate = camionRepository.findAll().size();
        camion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCamionMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(camion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Camion in the database
        List<Camion> camionList = camionRepository.findAll();
        assertThat(camionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCamionWithPatch() throws Exception {
        // Initialize the database
        camionRepository.saveAndFlush(camion);

        int databaseSizeBeforeUpdate = camionRepository.findAll().size();

        // Update the camion using partial update
        Camion partialUpdatedCamion = new Camion();
        partialUpdatedCamion.setId(camion.getId());

        partialUpdatedCamion.date(UPDATED_DATE);

        restCamionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCamion.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCamion))
            )
            .andExpect(status().isOk());

        // Validate the Camion in the database
        List<Camion> camionList = camionRepository.findAll();
        assertThat(camionList).hasSize(databaseSizeBeforeUpdate);
        Camion testCamion = camionList.get(camionList.size() - 1);
        assertThat(testCamion.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateCamionWithPatch() throws Exception {
        // Initialize the database
        camionRepository.saveAndFlush(camion);

        int databaseSizeBeforeUpdate = camionRepository.findAll().size();

        // Update the camion using partial update
        Camion partialUpdatedCamion = new Camion();
        partialUpdatedCamion.setId(camion.getId());

        partialUpdatedCamion.date(UPDATED_DATE);

        restCamionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCamion.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCamion))
            )
            .andExpect(status().isOk());

        // Validate the Camion in the database
        List<Camion> camionList = camionRepository.findAll();
        assertThat(camionList).hasSize(databaseSizeBeforeUpdate);
        Camion testCamion = camionList.get(camionList.size() - 1);
        assertThat(testCamion.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingCamion() throws Exception {
        int databaseSizeBeforeUpdate = camionRepository.findAll().size();
        camion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCamionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, camion.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(camion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Camion in the database
        List<Camion> camionList = camionRepository.findAll();
        assertThat(camionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCamion() throws Exception {
        int databaseSizeBeforeUpdate = camionRepository.findAll().size();
        camion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCamionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(camion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Camion in the database
        List<Camion> camionList = camionRepository.findAll();
        assertThat(camionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCamion() throws Exception {
        int databaseSizeBeforeUpdate = camionRepository.findAll().size();
        camion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCamionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(camion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Camion in the database
        List<Camion> camionList = camionRepository.findAll();
        assertThat(camionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCamion() throws Exception {
        // Initialize the database
        camionRepository.saveAndFlush(camion);

        int databaseSizeBeforeDelete = camionRepository.findAll().size();

        // Delete the camion
        restCamionMockMvc
            .perform(delete(ENTITY_API_URL_ID, camion.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Camion> camionList = camionRepository.findAll();
        assertThat(camionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
