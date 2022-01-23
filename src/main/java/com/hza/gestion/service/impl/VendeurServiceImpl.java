package com.hza.gestion.service.impl;

import com.hza.gestion.domain.Vendeur;
import com.hza.gestion.repository.VendeurRepository;
import com.hza.gestion.service.VendeurService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Vendeur}.
 */
@Service
@Transactional
public class VendeurServiceImpl implements VendeurService {

    private final Logger log = LoggerFactory.getLogger(VendeurServiceImpl.class);

    private final VendeurRepository vendeurRepository;

    public VendeurServiceImpl(VendeurRepository vendeurRepository) {
        this.vendeurRepository = vendeurRepository;
    }

    @Override
    public Vendeur save(Vendeur vendeur) {
        log.debug("Request to save Vendeur : {}", vendeur);
        return vendeurRepository.save(vendeur);
    }

    @Override
    public Optional<Vendeur> partialUpdate(Vendeur vendeur) {
        log.debug("Request to partially update Vendeur : {}", vendeur);

        return vendeurRepository
            .findById(vendeur.getId())
            .map(existingVendeur -> {
                if (vendeur.getMatricule() != null) {
                    existingVendeur.setMatricule(vendeur.getMatricule());
                }
                if (vendeur.getNom() != null) {
                    existingVendeur.setNom(vendeur.getNom());
                }
                if (vendeur.getPrenom() != null) {
                    existingVendeur.setPrenom(vendeur.getPrenom());
                }
                if (vendeur.getEmail() != null) {
                    existingVendeur.setEmail(vendeur.getEmail());
                }
                if (vendeur.getAdresse() != null) {
                    existingVendeur.setAdresse(vendeur.getAdresse());
                }
                if (vendeur.getPhoneNumber() != null) {
                    existingVendeur.setPhoneNumber(vendeur.getPhoneNumber());
                }
                if (vendeur.getSalaire() != null) {
                    existingVendeur.setSalaire(vendeur.getSalaire());
                }
                if (vendeur.getImage() != null) {
                    existingVendeur.setImage(vendeur.getImage());
                }
                if (vendeur.getImageContentType() != null) {
                    existingVendeur.setImageContentType(vendeur.getImageContentType());
                }

                return existingVendeur;
            })
            .map(vendeurRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Vendeur> findAll(Pageable pageable) {
        log.debug("Request to get all Vendeurs");
        return vendeurRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Vendeur> findOne(Long id) {
        log.debug("Request to get Vendeur : {}", id);
        return vendeurRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Vendeur : {}", id);
        vendeurRepository.deleteById(id);
    }
}
