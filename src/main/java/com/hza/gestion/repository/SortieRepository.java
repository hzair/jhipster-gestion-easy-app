package com.hza.gestion.repository;

import com.hza.gestion.domain.Sortie;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Sortie entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SortieRepository extends JpaRepository<Sortie, Long> {}
