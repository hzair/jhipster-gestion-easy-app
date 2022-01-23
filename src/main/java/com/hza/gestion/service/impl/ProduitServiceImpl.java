package com.hza.gestion.service.impl;

import com.hza.gestion.domain.Produit;
import com.hza.gestion.repository.ProduitRepository;
import com.hza.gestion.service.ProduitService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Produit}.
 */
@Service
@Transactional
public class ProduitServiceImpl implements ProduitService {

    private final Logger log = LoggerFactory.getLogger(ProduitServiceImpl.class);

    private final ProduitRepository produitRepository;

    public ProduitServiceImpl(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    @Override
    public Produit save(Produit produit) {
        log.debug("Request to save Produit : {}", produit);
        return produitRepository.save(produit);
    }

    @Override
    public Optional<Produit> partialUpdate(Produit produit) {
        log.debug("Request to partially update Produit : {}", produit);

        return produitRepository
            .findById(produit.getId())
            .map(existingProduit -> {
                if (produit.getIdFonc() != null) {
                    existingProduit.setIdFonc(produit.getIdFonc());
                }
                if (produit.getDesignation() != null) {
                    existingProduit.setDesignation(produit.getDesignation());
                }
                if (produit.getDescription() != null) {
                    existingProduit.setDescription(produit.getDescription());
                }
                if (produit.getQuantite() != null) {
                    existingProduit.setQuantite(produit.getQuantite());
                }
                if (produit.getPrixAchat() != null) {
                    existingProduit.setPrixAchat(produit.getPrixAchat());
                }
                if (produit.getPrixVente() != null) {
                    existingProduit.setPrixVente(produit.getPrixVente());
                }
                if (produit.getPrixVenteGros() != null) {
                    existingProduit.setPrixVenteGros(produit.getPrixVenteGros());
                }
                if (produit.getImage() != null) {
                    existingProduit.setImage(produit.getImage());
                }
                if (produit.getImageContentType() != null) {
                    existingProduit.setImageContentType(produit.getImageContentType());
                }
                if (produit.getDate() != null) {
                    existingProduit.setDate(produit.getDate());
                }

                return existingProduit;
            })
            .map(produitRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Produit> findAll(Pageable pageable) {
        log.debug("Request to get all Produits");
        return produitRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Produit> findOne(Long id) {
        log.debug("Request to get Produit : {}", id);
        return produitRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Produit : {}", id);
        produitRepository.deleteById(id);
    }
}
