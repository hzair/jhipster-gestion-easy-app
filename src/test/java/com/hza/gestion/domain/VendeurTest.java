package com.hza.gestion.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.hza.gestion.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VendeurTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Vendeur.class);
        Vendeur vendeur1 = new Vendeur();
        vendeur1.setId(1L);
        Vendeur vendeur2 = new Vendeur();
        vendeur2.setId(vendeur1.getId());
        assertThat(vendeur1).isEqualTo(vendeur2);
        vendeur2.setId(2L);
        assertThat(vendeur1).isNotEqualTo(vendeur2);
        vendeur1.setId(null);
        assertThat(vendeur1).isNotEqualTo(vendeur2);
    }
}
