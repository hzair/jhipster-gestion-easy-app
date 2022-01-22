package com.hza.gestion.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.hza.gestion.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ImputationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Imputation.class);
        Imputation imputation1 = new Imputation();
        imputation1.setId("id1");
        Imputation imputation2 = new Imputation();
        imputation2.setId(imputation1.getId());
        assertThat(imputation1).isEqualTo(imputation2);
        imputation2.setId("id2");
        assertThat(imputation1).isNotEqualTo(imputation2);
        imputation1.setId(null);
        assertThat(imputation1).isNotEqualTo(imputation2);
    }
}
