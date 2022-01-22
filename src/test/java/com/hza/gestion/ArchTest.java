package com.hza.gestion;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.hza.gestion");

        noClasses()
            .that()
            .resideInAnyPackage("com.hza.gestion.service..")
            .or()
            .resideInAnyPackage("com.hza.gestion.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..com.hza.gestion.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
