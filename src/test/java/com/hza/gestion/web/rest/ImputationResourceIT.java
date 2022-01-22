package com.hza.gestion.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.hza.gestion.IntegrationTest;
import com.hza.gestion.domain.Imputation;
import com.hza.gestion.repository.ImputationRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
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
 * Integration tests for the {@link ImputationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ImputationResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/imputations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ImputationRepository imputationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restImputationMockMvc;

    private Imputation imputation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Imputation createEntity(EntityManager em) {
        Imputation imputation = new Imputation().date(DEFAULT_DATE);
        return imputation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Imputation createUpdatedEntity(EntityManager em) {
        Imputation imputation = new Imputation().date(UPDATED_DATE);
        return imputation;
    }

    @BeforeEach
    public void initTest() {
        imputation = createEntity(em);
    }

    @Test
    @Transactional
    void createImputation() throws Exception {
        int databaseSizeBeforeCreate = imputationRepository.findAll().size();
        // Create the Imputation
        restImputationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(imputation))
            )
            .andExpect(status().isCreated());

        // Validate the Imputation in the database
        List<Imputation> imputationList = imputationRepository.findAll();
        assertThat(imputationList).hasSize(databaseSizeBeforeCreate + 1);
        Imputation testImputation = imputationList.get(imputationList.size() - 1);
        assertThat(testImputation.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createImputationWithExistingId() throws Exception {
        // Create the Imputation with an existing ID
        imputation.setId("existing_id");

        int databaseSizeBeforeCreate = imputationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restImputationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(imputation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Imputation in the database
        List<Imputation> imputationList = imputationRepository.findAll();
        assertThat(imputationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllImputations() throws Exception {
        // Initialize the database
        imputation.setId(UUID.randomUUID().toString());
        imputationRepository.saveAndFlush(imputation);

        // Get all the imputationList
        restImputationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(imputation.getId())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getImputation() throws Exception {
        // Initialize the database
        imputation.setId(UUID.randomUUID().toString());
        imputationRepository.saveAndFlush(imputation);

        // Get the imputation
        restImputationMockMvc
            .perform(get(ENTITY_API_URL_ID, imputation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(imputation.getId()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingImputation() throws Exception {
        // Get the imputation
        restImputationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewImputation() throws Exception {
        // Initialize the database
        imputation.setId(UUID.randomUUID().toString());
        imputationRepository.saveAndFlush(imputation);

        int databaseSizeBeforeUpdate = imputationRepository.findAll().size();

        // Update the imputation
        Imputation updatedImputation = imputationRepository.findById(imputation.getId()).get();
        // Disconnect from session so that the updates on updatedImputation are not directly saved in db
        em.detach(updatedImputation);
        updatedImputation.date(UPDATED_DATE);

        restImputationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedImputation.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedImputation))
            )
            .andExpect(status().isOk());

        // Validate the Imputation in the database
        List<Imputation> imputationList = imputationRepository.findAll();
        assertThat(imputationList).hasSize(databaseSizeBeforeUpdate);
        Imputation testImputation = imputationList.get(imputationList.size() - 1);
        assertThat(testImputation.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingImputation() throws Exception {
        int databaseSizeBeforeUpdate = imputationRepository.findAll().size();
        imputation.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restImputationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, imputation.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(imputation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Imputation in the database
        List<Imputation> imputationList = imputationRepository.findAll();
        assertThat(imputationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchImputation() throws Exception {
        int databaseSizeBeforeUpdate = imputationRepository.findAll().size();
        imputation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImputationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(imputation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Imputation in the database
        List<Imputation> imputationList = imputationRepository.findAll();
        assertThat(imputationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamImputation() throws Exception {
        int databaseSizeBeforeUpdate = imputationRepository.findAll().size();
        imputation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImputationMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(imputation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Imputation in the database
        List<Imputation> imputationList = imputationRepository.findAll();
        assertThat(imputationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateImputationWithPatch() throws Exception {
        // Initialize the database
        imputation.setId(UUID.randomUUID().toString());
        imputationRepository.saveAndFlush(imputation);

        int databaseSizeBeforeUpdate = imputationRepository.findAll().size();

        // Update the imputation using partial update
        Imputation partialUpdatedImputation = new Imputation();
        partialUpdatedImputation.setId(imputation.getId());

        partialUpdatedImputation.date(UPDATED_DATE);

        restImputationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedImputation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedImputation))
            )
            .andExpect(status().isOk());

        // Validate the Imputation in the database
        List<Imputation> imputationList = imputationRepository.findAll();
        assertThat(imputationList).hasSize(databaseSizeBeforeUpdate);
        Imputation testImputation = imputationList.get(imputationList.size() - 1);
        assertThat(testImputation.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateImputationWithPatch() throws Exception {
        // Initialize the database
        imputation.setId(UUID.randomUUID().toString());
        imputationRepository.saveAndFlush(imputation);

        int databaseSizeBeforeUpdate = imputationRepository.findAll().size();

        // Update the imputation using partial update
        Imputation partialUpdatedImputation = new Imputation();
        partialUpdatedImputation.setId(imputation.getId());

        partialUpdatedImputation.date(UPDATED_DATE);

        restImputationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedImputation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedImputation))
            )
            .andExpect(status().isOk());

        // Validate the Imputation in the database
        List<Imputation> imputationList = imputationRepository.findAll();
        assertThat(imputationList).hasSize(databaseSizeBeforeUpdate);
        Imputation testImputation = imputationList.get(imputationList.size() - 1);
        assertThat(testImputation.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingImputation() throws Exception {
        int databaseSizeBeforeUpdate = imputationRepository.findAll().size();
        imputation.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restImputationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, imputation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(imputation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Imputation in the database
        List<Imputation> imputationList = imputationRepository.findAll();
        assertThat(imputationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchImputation() throws Exception {
        int databaseSizeBeforeUpdate = imputationRepository.findAll().size();
        imputation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImputationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(imputation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Imputation in the database
        List<Imputation> imputationList = imputationRepository.findAll();
        assertThat(imputationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamImputation() throws Exception {
        int databaseSizeBeforeUpdate = imputationRepository.findAll().size();
        imputation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImputationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(imputation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Imputation in the database
        List<Imputation> imputationList = imputationRepository.findAll();
        assertThat(imputationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteImputation() throws Exception {
        // Initialize the database
        imputation.setId(UUID.randomUUID().toString());
        imputationRepository.saveAndFlush(imputation);

        int databaseSizeBeforeDelete = imputationRepository.findAll().size();

        // Delete the imputation
        restImputationMockMvc
            .perform(delete(ENTITY_API_URL_ID, imputation.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Imputation> imputationList = imputationRepository.findAll();
        assertThat(imputationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
