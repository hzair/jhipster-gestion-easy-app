package com.hza.gestion.service.impl;

import com.hza.gestion.domain.Employee2;
import com.hza.gestion.repository.Employee2Repository;
import com.hza.gestion.service.Employee2Service;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Employee2}.
 */
@Service
@Transactional
public class Employee2ServiceImpl implements Employee2Service {

    private final Logger log = LoggerFactory.getLogger(Employee2ServiceImpl.class);

    private final Employee2Repository employee2Repository;

    public Employee2ServiceImpl(Employee2Repository employee2Repository) {
        this.employee2Repository = employee2Repository;
    }

    @Override
    public Employee2 save(Employee2 employee2) {
        log.debug("Request to save Employee2 : {}", employee2);
        return employee2Repository.save(employee2);
    }

    @Override
    public Optional<Employee2> partialUpdate(Employee2 employee2) {
        log.debug("Request to partially update Employee2 : {}", employee2);

        return employee2Repository
            .findById(employee2.getId())
            .map(existingEmployee2 -> {
                if (employee2.getFirstName() != null) {
                    existingEmployee2.setFirstName(employee2.getFirstName());
                }
                if (employee2.getLastName() != null) {
                    existingEmployee2.setLastName(employee2.getLastName());
                }
                if (employee2.getEmail() != null) {
                    existingEmployee2.setEmail(employee2.getEmail());
                }
                if (employee2.getPhoneNumber() != null) {
                    existingEmployee2.setPhoneNumber(employee2.getPhoneNumber());
                }
                if (employee2.getHireDate() != null) {
                    existingEmployee2.setHireDate(employee2.getHireDate());
                }
                if (employee2.getSalary() != null) {
                    existingEmployee2.setSalary(employee2.getSalary());
                }
                if (employee2.getCommissionPct() != null) {
                    existingEmployee2.setCommissionPct(employee2.getCommissionPct());
                }

                return existingEmployee2;
            })
            .map(employee2Repository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Employee2> findAll() {
        log.debug("Request to get all Employee2s");
        return employee2Repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Employee2> findOne(Long id) {
        log.debug("Request to get Employee2 : {}", id);
        return employee2Repository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Employee2 : {}", id);
        employee2Repository.deleteById(id);
    }
}
