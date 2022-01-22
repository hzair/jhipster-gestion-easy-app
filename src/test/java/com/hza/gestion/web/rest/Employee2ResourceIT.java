package com.hza.gestion.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.hza.gestion.IntegrationTest;
import com.hza.gestion.domain.Employee2;
import com.hza.gestion.repository.Employee2Repository;
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
 * Integration tests for the {@link Employee2Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Employee2ResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final Instant DEFAULT_HIRE_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_HIRE_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_SALARY = 1L;
    private static final Long UPDATED_SALARY = 2L;

    private static final Long DEFAULT_COMMISSION_PCT = 1L;
    private static final Long UPDATED_COMMISSION_PCT = 2L;

    private static final String ENTITY_API_URL = "/api/employee-2-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Employee2Repository employee2Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEmployee2MockMvc;

    private Employee2 employee2;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Employee2 createEntity(EntityManager em) {
        Employee2 employee2 = new Employee2()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .hireDate(DEFAULT_HIRE_DATE)
            .salary(DEFAULT_SALARY)
            .commissionPct(DEFAULT_COMMISSION_PCT);
        return employee2;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Employee2 createUpdatedEntity(EntityManager em) {
        Employee2 employee2 = new Employee2()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE)
            .salary(UPDATED_SALARY)
            .commissionPct(UPDATED_COMMISSION_PCT);
        return employee2;
    }

    @BeforeEach
    public void initTest() {
        employee2 = createEntity(em);
    }

    @Test
    @Transactional
    void createEmployee2() throws Exception {
        int databaseSizeBeforeCreate = employee2Repository.findAll().size();
        // Create the Employee2
        restEmployee2MockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(employee2))
            )
            .andExpect(status().isCreated());

        // Validate the Employee2 in the database
        List<Employee2> employee2List = employee2Repository.findAll();
        assertThat(employee2List).hasSize(databaseSizeBeforeCreate + 1);
        Employee2 testEmployee2 = employee2List.get(employee2List.size() - 1);
        assertThat(testEmployee2.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testEmployee2.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testEmployee2.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testEmployee2.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testEmployee2.getHireDate()).isEqualTo(DEFAULT_HIRE_DATE);
        assertThat(testEmployee2.getSalary()).isEqualTo(DEFAULT_SALARY);
        assertThat(testEmployee2.getCommissionPct()).isEqualTo(DEFAULT_COMMISSION_PCT);
    }

    @Test
    @Transactional
    void createEmployee2WithExistingId() throws Exception {
        // Create the Employee2 with an existing ID
        employee2.setId(1L);

        int databaseSizeBeforeCreate = employee2Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmployee2MockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(employee2))
            )
            .andExpect(status().isBadRequest());

        // Validate the Employee2 in the database
        List<Employee2> employee2List = employee2Repository.findAll();
        assertThat(employee2List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEmployee2s() throws Exception {
        // Initialize the database
        employee2Repository.saveAndFlush(employee2);

        // Get all the employee2List
        restEmployee2MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(employee2.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].hireDate").value(hasItem(DEFAULT_HIRE_DATE.toString())))
            .andExpect(jsonPath("$.[*].salary").value(hasItem(DEFAULT_SALARY.intValue())))
            .andExpect(jsonPath("$.[*].commissionPct").value(hasItem(DEFAULT_COMMISSION_PCT.intValue())));
    }

    @Test
    @Transactional
    void getEmployee2() throws Exception {
        // Initialize the database
        employee2Repository.saveAndFlush(employee2);

        // Get the employee2
        restEmployee2MockMvc
            .perform(get(ENTITY_API_URL_ID, employee2.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(employee2.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.hireDate").value(DEFAULT_HIRE_DATE.toString()))
            .andExpect(jsonPath("$.salary").value(DEFAULT_SALARY.intValue()))
            .andExpect(jsonPath("$.commissionPct").value(DEFAULT_COMMISSION_PCT.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingEmployee2() throws Exception {
        // Get the employee2
        restEmployee2MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEmployee2() throws Exception {
        // Initialize the database
        employee2Repository.saveAndFlush(employee2);

        int databaseSizeBeforeUpdate = employee2Repository.findAll().size();

        // Update the employee2
        Employee2 updatedEmployee2 = employee2Repository.findById(employee2.getId()).get();
        // Disconnect from session so that the updates on updatedEmployee2 are not directly saved in db
        em.detach(updatedEmployee2);
        updatedEmployee2
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE)
            .salary(UPDATED_SALARY)
            .commissionPct(UPDATED_COMMISSION_PCT);

        restEmployee2MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEmployee2.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEmployee2))
            )
            .andExpect(status().isOk());

        // Validate the Employee2 in the database
        List<Employee2> employee2List = employee2Repository.findAll();
        assertThat(employee2List).hasSize(databaseSizeBeforeUpdate);
        Employee2 testEmployee2 = employee2List.get(employee2List.size() - 1);
        assertThat(testEmployee2.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testEmployee2.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testEmployee2.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testEmployee2.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testEmployee2.getHireDate()).isEqualTo(UPDATED_HIRE_DATE);
        assertThat(testEmployee2.getSalary()).isEqualTo(UPDATED_SALARY);
        assertThat(testEmployee2.getCommissionPct()).isEqualTo(UPDATED_COMMISSION_PCT);
    }

    @Test
    @Transactional
    void putNonExistingEmployee2() throws Exception {
        int databaseSizeBeforeUpdate = employee2Repository.findAll().size();
        employee2.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmployee2MockMvc
            .perform(
                put(ENTITY_API_URL_ID, employee2.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(employee2))
            )
            .andExpect(status().isBadRequest());

        // Validate the Employee2 in the database
        List<Employee2> employee2List = employee2Repository.findAll();
        assertThat(employee2List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEmployee2() throws Exception {
        int databaseSizeBeforeUpdate = employee2Repository.findAll().size();
        employee2.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmployee2MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(employee2))
            )
            .andExpect(status().isBadRequest());

        // Validate the Employee2 in the database
        List<Employee2> employee2List = employee2Repository.findAll();
        assertThat(employee2List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEmployee2() throws Exception {
        int databaseSizeBeforeUpdate = employee2Repository.findAll().size();
        employee2.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmployee2MockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(employee2))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Employee2 in the database
        List<Employee2> employee2List = employee2Repository.findAll();
        assertThat(employee2List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEmployee2WithPatch() throws Exception {
        // Initialize the database
        employee2Repository.saveAndFlush(employee2);

        int databaseSizeBeforeUpdate = employee2Repository.findAll().size();

        // Update the employee2 using partial update
        Employee2 partialUpdatedEmployee2 = new Employee2();
        partialUpdatedEmployee2.setId(employee2.getId());

        partialUpdatedEmployee2.phoneNumber(UPDATED_PHONE_NUMBER).salary(UPDATED_SALARY);

        restEmployee2MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmployee2.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmployee2))
            )
            .andExpect(status().isOk());

        // Validate the Employee2 in the database
        List<Employee2> employee2List = employee2Repository.findAll();
        assertThat(employee2List).hasSize(databaseSizeBeforeUpdate);
        Employee2 testEmployee2 = employee2List.get(employee2List.size() - 1);
        assertThat(testEmployee2.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testEmployee2.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testEmployee2.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testEmployee2.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testEmployee2.getHireDate()).isEqualTo(DEFAULT_HIRE_DATE);
        assertThat(testEmployee2.getSalary()).isEqualTo(UPDATED_SALARY);
        assertThat(testEmployee2.getCommissionPct()).isEqualTo(DEFAULT_COMMISSION_PCT);
    }

    @Test
    @Transactional
    void fullUpdateEmployee2WithPatch() throws Exception {
        // Initialize the database
        employee2Repository.saveAndFlush(employee2);

        int databaseSizeBeforeUpdate = employee2Repository.findAll().size();

        // Update the employee2 using partial update
        Employee2 partialUpdatedEmployee2 = new Employee2();
        partialUpdatedEmployee2.setId(employee2.getId());

        partialUpdatedEmployee2
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE)
            .salary(UPDATED_SALARY)
            .commissionPct(UPDATED_COMMISSION_PCT);

        restEmployee2MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmployee2.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmployee2))
            )
            .andExpect(status().isOk());

        // Validate the Employee2 in the database
        List<Employee2> employee2List = employee2Repository.findAll();
        assertThat(employee2List).hasSize(databaseSizeBeforeUpdate);
        Employee2 testEmployee2 = employee2List.get(employee2List.size() - 1);
        assertThat(testEmployee2.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testEmployee2.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testEmployee2.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testEmployee2.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testEmployee2.getHireDate()).isEqualTo(UPDATED_HIRE_DATE);
        assertThat(testEmployee2.getSalary()).isEqualTo(UPDATED_SALARY);
        assertThat(testEmployee2.getCommissionPct()).isEqualTo(UPDATED_COMMISSION_PCT);
    }

    @Test
    @Transactional
    void patchNonExistingEmployee2() throws Exception {
        int databaseSizeBeforeUpdate = employee2Repository.findAll().size();
        employee2.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmployee2MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, employee2.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(employee2))
            )
            .andExpect(status().isBadRequest());

        // Validate the Employee2 in the database
        List<Employee2> employee2List = employee2Repository.findAll();
        assertThat(employee2List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEmployee2() throws Exception {
        int databaseSizeBeforeUpdate = employee2Repository.findAll().size();
        employee2.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmployee2MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(employee2))
            )
            .andExpect(status().isBadRequest());

        // Validate the Employee2 in the database
        List<Employee2> employee2List = employee2Repository.findAll();
        assertThat(employee2List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEmployee2() throws Exception {
        int databaseSizeBeforeUpdate = employee2Repository.findAll().size();
        employee2.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmployee2MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(employee2))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Employee2 in the database
        List<Employee2> employee2List = employee2Repository.findAll();
        assertThat(employee2List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEmployee2() throws Exception {
        // Initialize the database
        employee2Repository.saveAndFlush(employee2);

        int databaseSizeBeforeDelete = employee2Repository.findAll().size();

        // Delete the employee2
        restEmployee2MockMvc
            .perform(delete(ENTITY_API_URL_ID, employee2.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Employee2> employee2List = employee2Repository.findAll();
        assertThat(employee2List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
