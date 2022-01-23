package com.hza.gestion.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.hza.gestion.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CamionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Camion.class);
        Camion camion1 = new Camion();
        camion1.setId(1L);
        Camion camion2 = new Camion();
        camion2.setId(camion1.getId());
        assertThat(camion1).isEqualTo(camion2);
        camion2.setId(2L);
        assertThat(camion1).isNotEqualTo(camion2);
        camion1.setId(null);
        assertThat(camion1).isNotEqualTo(camion2);
    }
}
