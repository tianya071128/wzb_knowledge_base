export default function normalizeESLintConfig(options) {
  const {
    babelOptions = {},
    ecmaVersion = "latest",
    sourceType = "module",
    requireConfigFile = true,
    ...otherOptions
  } = options;
  return {
    babelOptions: {
      cwd: process.cwd(),
      ...babelOptions,
      browserslistConfigFile: false
    },
    ecmaVersion: ecmaVersion === "latest" ? 1e8 : ecmaVersion,
    sourceType,
    requireConfigFile,
    ...otherOptions
  };
}