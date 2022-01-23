package com.hza.gestion.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.hza.gestion.IntegrationTest;
import com.hza.gestion.domain.Vendeur;
import com.hza.gestion.repository.VendeurRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link VendeurResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VendeurResourceIT {

    private static final String DEFAULT_MATRICULE = "AAAAAAAAAA";
    private static final String UPDATED_MATRICULE = "BBBBBBBBBB";

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final Long DEFAULT_SALAIRE = 1L;
    private static final Long UPDATED_SALAIRE = 2L;

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/vendeurs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VendeurRepository vendeurRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVendeurMockMvc;

    private Vendeur vendeur;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vendeur createEntity(EntityManager em) {
        Vendeur vendeur = new Vendeur()
            .matricule(DEFAULT_MATRICULE)
            .nom(DEFAULT_NOM)
            .prenom(DEFAULT_PRENOM)
            .email(DEFAULT_EMAIL)
            .adresse(DEFAULT_ADRESSE)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .salaire(DEFAULT_SALAIRE)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
        return vendeur;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vendeur createUpdatedEntity(EntityManager em) {
        Vendeur vendeur = new Vendeur()
            .matricule(UPDATED_MATRICULE)
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .email(UPDATED_EMAIL)
            .adresse(UPDATED_ADRESSE)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .salaire(UPDATED_SALAIRE)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);
        return vendeur;
    }

    @BeforeEach
    public void initTest() {
        vendeur = createEntity(em);
    }

    @Test
    @Transactional
    void createVendeur() throws Exception {
        int databaseSizeBeforeCreate = vendeurRepository.findAll().size();
        // Create the Vendeur
        restVendeurMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vendeur))
            )
            .andExpect(status().isCreated());

        // Validate the Vendeur in the database
        List<Vendeur> vendeurList = vendeurRepository.findAll();
        assertThat(vendeurList).hasSize(databaseSizeBeforeCreate + 1);
        Vendeur testVendeur = vendeurList.get(vendeurList.size() - 1);
        assertThat(testVendeur.getMatricule()).isEqualTo(DEFAULT_MATRICULE);
        assertThat(testVendeur.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testVendeur.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testVendeur.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testVendeur.getAdresse()).isEqualTo(DEFAULT_ADRESSE);
        assertThat(testVendeur.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testVendeur.getSalaire()).isEqualTo(DEFAULT_SALAIRE);
        assertThat(testVendeur.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testVendeur.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createVendeurWithExistingId() throws Exception {
        // Create the Vendeur with an existing ID
        vendeur.setId(1L);

        int databaseSizeBeforeCreate = vendeurRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVendeurMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vendeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vendeur in the database
        List<Vendeur> vendeurList = vendeurRepository.findAll();
        assertThat(vendeurList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkMatriculeIsRequired() throws Exception {
        int databaseSizeBeforeTest = vendeurRepository.findAll().size();
        // set the field null
        vendeur.setMatricule(null);

        // Create the Vendeur, which fails.

        restVendeurMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vendeur))
            )
            .andExpect(status().isBadRequest());

        List<Vendeur> vendeurList = vendeurRepository.findAll();
        assertThat(vendeurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVendeurs() throws Exception {
        // Initialize the database
        vendeurRepository.saveAndFlush(vendeur);

        // Get all the vendeurList
        restVendeurMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vendeur.getId().intValue())))
            .andExpect(jsonPath("$.[*].matricule").value(hasItem(DEFAULT_MATRICULE)))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].salaire").value(hasItem(DEFAULT_SALAIRE.intValue())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    void getVendeur() throws Exception {
        // Initialize the database
        vendeurRepository.saveAndFlush(vendeur);

        // Get the vendeur
        restVendeurMockMvc
            .perform(get(ENTITY_API_URL_ID, vendeur.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vendeur.getId().intValue()))
            .andExpect(jsonPath("$.matricule").value(DEFAULT_MATRICULE))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.adresse").value(DEFAULT_ADRESSE))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.salaire").value(DEFAULT_SALAIRE.intValue()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    void getNonExistingVendeur() throws Exception {
        // Get the vendeur
        restVendeurMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewVendeur() throws Exception {
        // Initialize the database
        vendeurRepository.saveAndFlush(vendeur);

        int databaseSizeBeforeUpdate = vendeurRepository.findAll().size();

        // Update the vendeur
        Vendeur updatedVendeur = vendeurRepository.findById(vendeur.getId()).get();
        // Disconnect from session so that the updates on updatedVendeur are not directly saved in db
        em.detach(updatedVendeur);
        updatedVendeur
            .matricule(UPDATED_MATRICULE)
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .email(UPDATED_EMAIL)
            .adresse(UPDATED_ADRESSE)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .salaire(UPDATED_SALAIRE)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restVendeurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVendeur.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVendeur))
            )
            .andExpect(status().isOk());

        // Validate the Vendeur in the database
        List<Vendeur> vendeurList = vendeurRepository.findAll();
        assertThat(vendeurList).hasSize(databaseSizeBeforeUpdate);
        Vendeur testVendeur = vendeurList.get(vendeurList.size() - 1);
        assertThat(testVendeur.getMatricule()).isEqualTo(UPDATED_MATRICULE);
        assertThat(testVendeur.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testVendeur.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testVendeur.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testVendeur.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testVendeur.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testVendeur.getSalaire()).isEqualTo(UPDATED_SALAIRE);
        assertThat(testVendeur.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testVendeur.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingVendeur() throws Exception {
        int databaseSizeBeforeUpdate = vendeurRepository.findAll().size();
        vendeur.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVendeurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vendeur.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vendeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vendeur in the database
        List<Vendeur> vendeurList = vendeurRepository.findAll();
        assertThat(vendeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVendeur() throws Exception {
        int databaseSizeBeforeUpdate = vendeurRepository.findAll().size();
        vendeur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVendeurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vendeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vendeur in the database
        List<Vendeur> vendeurList = vendeurRepository.findAll();
        assertThat(vendeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVendeur() throws Exception {
        int databaseSizeBeforeUpdate = vendeurRepository.findAll().size();
        vendeur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVendeurMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vendeur))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vendeur in the database
        List<Vendeur> vendeurList = vendeurRepository.findAll();
        assertThat(vendeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVendeurWithPatch() throws Exception {
        // Initialize the database
        vendeurRepository.saveAndFlush(vendeur);

        int databaseSizeBeforeUpdate = vendeurRepository.findAll().size();

        // Update the vendeur using partial update
        Vendeur partialUpdatedVendeur = new Vendeur();
        partialUpdatedVendeur.setId(vendeur.getId());

        partialUpdatedVendeur
            .matricule(UPDATED_MATRICULE)
            .email(UPDATED_EMAIL)
            .adresse(UPDATED_ADRESSE)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restVendeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVendeur.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVendeur))
            )
            .andExpect(status().isOk());

        // Validate the Vendeur in the database
        List<Vendeur> vendeurList = vendeurRepository.findAll();
        assertThat(vendeurList).hasSize(databaseSizeBeforeUpdate);
        Vendeur testVendeur = vendeurList.get(vendeurList.size() - 1);
        assertThat(testVendeur.getMatricule()).isEqualTo(UPDATED_MATRICULE);
        assertThat(testVendeur.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testVendeur.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testVendeur.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testVendeur.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testVendeur.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testVendeur.getSalaire()).isEqualTo(DEFAULT_SALAIRE);
        assertThat(testVendeur.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testVendeur.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateVendeurWithPatch() throws Exception {
        // Initialize the database
        vendeurRepository.saveAndFlush(vendeur);

        int databaseSizeBeforeUpdate = vendeurRepository.findAll().size();

        // Update the vendeur using partial update
        Vendeur partialUpdatedVendeur = new Vendeur();
        partialUpdatedVendeur.setId(vendeur.getId());

        partialUpdatedVendeur
            .matricule(UPDATED_MATRICULE)
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .email(UPDATED_EMAIL)
            .adresse(UPDATED_ADRESSE)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .salaire(UPDATED_SALAIRE)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restVendeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVendeur.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVendeur))
            )
            .andExpect(status().isOk());

        // Validate the Vendeur in the database
        List<Vendeur> vendeurList = vendeurRepository.findAll();
        assertThat(vendeurList).hasSize(databaseSizeBeforeUpdate);
        Vendeur testVendeur = vendeurList.get(vendeurList.size() - 1);
        assertThat(testVendeur.getMatricule()).isEqualTo(UPDATED_MATRICULE);
        assertThat(testVendeur.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testVendeur.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testVendeur.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testVendeur.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testVendeur.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testVendeur.getSalaire()).isEqualTo(UPDATED_SALAIRE);
        assertThat(testVendeur.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testVendeur.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingVendeur() throws Exception {
        int databaseSizeBeforeUpdate = vendeurRepository.findAll().size();
        vendeur.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVendeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vendeur.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vendeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vendeur in the database
        List<Vendeur> vendeurList = vendeurRepository.findAll();
        assertThat(vendeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVendeur() throws Exception {
        int databaseSizeBeforeUpdate = vendeurRepository.findAll().size();
        vendeur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVendeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vendeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vendeur in the database
        List<Vendeur> vendeurList = vendeurRepository.findAll();
        assertThat(vendeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVendeur() throws Exception {
        int databaseSizeBeforeUpdate = vendeurRepository.findAll().size();
        vendeur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVendeurMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vendeur))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vendeur in the database
        List<Vendeur> vendeurList = vendeurRepository.findAll();
        assertThat(vendeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVendeur() throws Exception {
        // Initialize the database
        vendeurRepository.saveAndFlush(vendeur);

        int databaseSizeBeforeDelete = vendeurRepository.findAll().size();

        // Delete the vendeur
        restVendeurMockMvc
            .perform(delete(ENTITY_API_URL_ID, vendeur.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Vendeur> vendeurList = vendeurRepository.findAll();
        assertThat(vendeurList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
