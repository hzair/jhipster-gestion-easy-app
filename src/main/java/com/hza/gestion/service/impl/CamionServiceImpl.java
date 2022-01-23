package com.hza.gestion.service.impl;

import com.hza.gestion.domain.Camion;
import com.hza.gestion.repository.CamionRepository;
import com.hza.gestion.service.CamionService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Camion}.
 */
@Service
@Transactional
public class CamionServiceImpl implements CamionService {

    private final Logger log = LoggerFactory.getLogger(CamionServiceImpl.class);

    private final CamionRepository camionRepository;

    public CamionServiceImpl(CamionRepository camionRepository) {
        this.camionRepository = camionRepository;
    }

    @Override
    public Camion save(Camion camion) {
        log.debug("Request to save Camion : {}", camion);
        return camionRepository.save(camion);
    }

    @Override
    public Optional<Camion> partialUpdate(Camion camion) {
        log.debug("Request to partially update Camion : {}", camion);

        return camionRepository
            .findById(camion.getId())
            .map(existingCamion -> {
                if (camion.getDate() != null) {
                    existingCamion.setDate(camion.getDate());
                }

                return existingCamion;
            })
            .map(camionRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Camion> findAll() {
        log.debug("Request to get all Camions");
        return camionRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Camion> findOne(Long id) {
        log.debug("Request to get Camion : {}", id);
        return camionRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Camion : {}", id);
        camionRepository.deleteById(id);
    }
}
