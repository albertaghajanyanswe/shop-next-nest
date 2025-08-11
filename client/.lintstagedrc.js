const path = require('path');

const buildEslintCommand = (filenames) => {
  // Отфильтровываем конфигурационные файлы
  const filesToLint = filenames.filter(
    (f) =>
      !f.includes('.lintstagedrc.js') &&
      !f.includes('eslint.config.js') &&
      !f.includes('.eslintrc.js') &&
      !f.includes('prettier.config.js') &&
      !f.includes('tailwind.config.js')
  );

  if (filesToLint.length === 0) {
    return null; // нечего линтить
  }

  return `eslint --fix ${filesToLint
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`;
};

module.exports = {
  '*.{js,jsx,ts,tsx}': (filenames) => {
    const cmd = buildEslintCommand(filenames);
    return cmd ? [cmd] : [];
  },
};
