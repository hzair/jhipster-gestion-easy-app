package com.hza.gestion.repository;

import com.hza.gestion.domain.Employee2;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Employee2 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Employee2Repository extends JpaRepository<Employee2, Long> {}
