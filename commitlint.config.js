/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // nueva funcionalidad
        'fix',      // corrección de bug
        'refactor', // refactoring sin cambio funcional
        'style',    // formato, espacios, punto y coma
        'test',     // agregar o corregir tests
        'docs',     // cambios en documentación
        'chore',    // tareas de mantenimiento (deps, config)
        'ci',       // cambios en CI/CD
        'perf',     // mejoras de rendimiento
        'revert',   // revertir un commit anterior
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
  },
};
