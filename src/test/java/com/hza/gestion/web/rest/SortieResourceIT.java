package com.hza.gestion.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.hza.gestion.IntegrationTest;
import com.hza.gestion.domain.Sortie;
import com.hza.gestion.repository.SortieRepository;
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
 * Integration tests for the {@link SortieResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SortieResourceIT {

    private static final Integer DEFAULT_QUANTITE = 1;
    private static final Integer UPDATED_QUANTITE = 2;

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/sorties";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SortieRepository sortieRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSortieMockMvc;

    private Sortie sortie;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sortie createEntity(EntityManager em) {
        Sortie sortie = new Sortie().quantite(DEFAULT_QUANTITE).date(DEFAULT_DATE);
        return sortie;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sortie createUpdatedEntity(EntityManager em) {
        Sortie sortie = new Sortie().quantite(UPDATED_QUANTITE).date(UPDATED_DATE);
        return sortie;
    }

    @BeforeEach
    public void initTest() {
        sortie = createEntity(em);
    }

    @Test
    @Transactional
    void createSortie() throws Exception {
        int databaseSizeBeforeCreate = sortieRepository.findAll().size();
        // Create the Sortie
        restSortieMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sortie))
            )
            .andExpect(status().isCreated());

        // Validate the Sortie in the database
        List<Sortie> sortieList = sortieRepository.findAll();
        assertThat(sortieList).hasSize(databaseSizeBeforeCreate + 1);
        Sortie testSortie = sortieList.get(sortieList.size() - 1);
        assertThat(testSortie.getQuantite()).isEqualTo(DEFAULT_QUANTITE);
        assertThat(testSortie.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createSortieWithExistingId() throws Exception {
        // Create the Sortie with an existing ID
        sortie.setId(1L);

        int databaseSizeBeforeCreate = sortieRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSortieMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sortie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sortie in the database
        List<Sortie> sortieList = sortieRepository.findAll();
        assertThat(sortieList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSorties() throws Exception {
        // Initialize the database
        sortieRepository.saveAndFlush(sortie);

        // Get all the sortieList
        restSortieMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sortie.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantite").value(hasItem(DEFAULT_QUANTITE)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getSortie() throws Exception {
        // Initialize the database
        sortieRepository.saveAndFlush(sortie);

        // Get the sortie
        restSortieMockMvc
            .perform(get(ENTITY_API_URL_ID, sortie.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sortie.getId().intValue()))
            .andExpect(jsonPath("$.quantite").value(DEFAULT_QUANTITE))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSortie() throws Exception {
        // Get the sortie
        restSortieMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSortie() throws Exception {
        // Initialize the database
        sortieRepository.saveAndFlush(sortie);

        int databaseSizeBeforeUpdate = sortieRepository.findAll().size();

        // Update the sortie
        Sortie updatedSortie = sortieRepository.findById(sortie.getId()).get();
        // Disconnect from session so that the updates on updatedSortie are not directly saved in db
        em.detach(updatedSortie);
        updatedSortie.quantite(UPDATED_QUANTITE).date(UPDATED_DATE);

        restSortieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSortie.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSortie))
            )
            .andExpect(status().isOk());

        // Validate the Sortie in the database
        List<Sortie> sortieList = sortieRepository.findAll();
        assertThat(sortieList).hasSize(databaseSizeBeforeUpdate);
        Sortie testSortie = sortieList.get(sortieList.size() - 1);
        assertThat(testSortie.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testSortie.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingSortie() throws Exception {
        int databaseSizeBeforeUpdate = sortieRepository.findAll().size();
        sortie.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSortieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sortie.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sortie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sortie in the database
        List<Sortie> sortieList = sortieRepository.findAll();
        assertThat(sortieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSortie() throws Exception {
        int databaseSizeBeforeUpdate = sortieRepository.findAll().size();
        sortie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSortieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sortie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sortie in the database
        List<Sortie> sortieList = sortieRepository.findAll();
        assertThat(sortieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSortie() throws Exception {
        int databaseSizeBeforeUpdate = sortieRepository.findAll().size();
        sortie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSortieMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sortie))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sortie in the database
        List<Sortie> sortieList = sortieRepository.findAll();
        assertThat(sortieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSortieWithPatch() throws Exception {
        // Initialize the database
        sortieRepository.saveAndFlush(sortie);

        int databaseSizeBeforeUpdate = sortieRepository.findAll().size();

        // Update the sortie using partial update
        Sortie partialUpdatedSortie = new Sortie();
        partialUpdatedSortie.setId(sortie.getId());

        partialUpdatedSortie.quantite(UPDATED_QUANTITE);

        restSortieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSortie.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSortie))
            )
            .andExpect(status().isOk());

        // Validate the Sortie in the database
        List<Sortie> sortieList = sortieRepository.findAll();
        assertThat(sortieList).hasSize(databaseSizeBeforeUpdate);
        Sortie testSortie = sortieList.get(sortieList.size() - 1);
        assertThat(testSortie.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testSortie.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateSortieWithPatch() throws Exception {
        // Initialize the database
        sortieRepository.saveAndFlush(sortie);

        int databaseSizeBeforeUpdate = sortieRepository.findAll().size();

        // Update the sortie using partial update
        Sortie partialUpdatedSortie = new Sortie();
        partialUpdatedSortie.setId(sortie.getId());

        partialUpdatedSortie.quantite(UPDATED_QUANTITE).date(UPDATED_DATE);

        restSortieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSortie.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSortie))
            )
            .andExpect(status().isOk());

        // Validate the Sortie in the database
        List<Sortie> sortieList = sortieRepository.findAll();
        assertThat(sortieList).hasSize(databaseSizeBeforeUpdate);
        Sortie testSortie = sortieList.get(sortieList.size() - 1);
        assertThat(testSortie.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testSortie.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingSortie() throws Exception {
        int databaseSizeBeforeUpdate = sortieRepository.findAll().size();
        sortie.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSortieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sortie.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sortie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sortie in the database
        List<Sortie> sortieList = sortieRepository.findAll();
        assertThat(sortieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSortie() throws Exception {
        int databaseSizeBeforeUpdate = sortieRepository.findAll().size();
        sortie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSortieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sortie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sortie in the database
        List<Sortie> sortieList = sortieRepository.findAll();
        assertThat(sortieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSortie() throws Exception {
        int databaseSizeBeforeUpdate = sortieRepository.findAll().size();
        sortie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSortieMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sortie))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sortie in the database
        List<Sortie> sortieList = sortieRepository.findAll();
        assertThat(sortieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSortie() throws Exception {
        // Initialize the database
        sortieRepository.saveAndFlush(sortie);

        int databaseSizeBeforeDelete = sortieRepository.findAll().size();

        // Delete the sortie
        restSortieMockMvc
            .perform(delete(ENTITY_API_URL_ID, sortie.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Sortie> sortieList = sortieRepository.findAll();
        assertThat(sortieList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
