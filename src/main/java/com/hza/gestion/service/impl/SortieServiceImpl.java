package com.hza.gestion.service.impl;

import com.hza.gestion.domain.Sortie;
import com.hza.gestion.repository.SortieRepository;
import com.hza.gestion.service.SortieService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Sortie}.
 */
@Service
@Transactional
public class SortieServiceImpl implements SortieService {

    private final Logger log = LoggerFactory.getLogger(SortieServiceImpl.class);

    private final SortieRepository sortieRepository;

    public SortieServiceImpl(SortieRepository sortieRepository) {
        this.sortieRepository = sortieRepository;
    }

    @Override
    public Sortie save(Sortie sortie) {
        log.debug("Request to save Sortie : {}", sortie);
        return sortieRepository.save(sortie);
    }

    @Override
    public Optional<Sortie> partialUpdate(Sortie sortie) {
        log.debug("Request to partially update Sortie : {}", sortie);

        return sortieRepository
            .findById(sortie.getId())
            .map(existingSortie -> {
                if (sortie.getQuantite() != null) {
                    existingSortie.setQuantite(sortie.getQuantite());
                }
                if (sortie.getDate() != null) {
                    existingSortie.setDate(sortie.getDate());
                }

                return existingSortie;
            })
            .map(sortieRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Sortie> findAll() {
        log.debug("Request to get all Sorties");
        return sortieRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Sortie> findOne(Long id) {
        log.debug("Request to get Sortie : {}", id);
        return sortieRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Sortie : {}", id);
        sortieRepository.deleteById(id);
    }
}
