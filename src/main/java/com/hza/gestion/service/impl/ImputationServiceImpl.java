package com.hza.gestion.service.impl;

import com.hza.gestion.domain.Imputation;
import com.hza.gestion.repository.ImputationRepository;
import com.hza.gestion.service.ImputationService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Imputation}.
 */
@Service
@Transactional
public class ImputationServiceImpl implements ImputationService {

    private final Logger log = LoggerFactory.getLogger(ImputationServiceImpl.class);

    private final ImputationRepository imputationRepository;

    public ImputationServiceImpl(ImputationRepository imputationRepository) {
        this.imputationRepository = imputationRepository;
    }

    @Override
    public Imputation save(Imputation imputation) {
        log.debug("Request to save Imputation : {}", imputation);
        return imputationRepository.save(imputation);
    }

    @Override
    public Optional<Imputation> partialUpdate(Imputation imputation) {
        log.debug("Request to partially update Imputation : {}", imputation);

        return imputationRepository
            .findById(imputation.getId())
            .map(existingImputation -> {
                if (imputation.getDate() != null) {
                    existingImputation.setDate(imputation.getDate());
                }

                return existingImputation;
            })
            .map(imputationRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Imputation> findAll() {
        log.debug("Request to get all Imputations");
        return imputationRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Imputation> findOne(String id) {
        log.debug("Request to get Imputation : {}", id);
        return imputationRepository.findById(id);
    }

    @Override
    public void delete(String id) {
        log.debug("Request to delete Imputation : {}", id);
        imputationRepository.deleteById(id);
    }
}
