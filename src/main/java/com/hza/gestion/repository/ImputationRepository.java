package com.hza.gestion.repository;

import com.hza.gestion.domain.Imputation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Imputation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ImputationRepository extends JpaRepository<Imputation, String> {}
