package com.hza.gestion.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.hza.gestion.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class Employee2Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Employee2.class);
        Employee2 employee21 = new Employee2();
        employee21.setId(1L);
        Employee2 employee22 = new Employee2();
        employee22.setId(employee21.getId());
        assertThat(employee21).isEqualTo(employee22);
        employee22.setId(2L);
        assertThat(employee21).isNotEqualTo(employee22);
        employee21.setId(null);
        assertThat(employee21).isNotEqualTo(employee22);
    }
}
