const envVarName = "___INTERNAL___IS_INSIDE_BABEL_REGISTER_WORKER___";
const envVarValue = "yes_I_am";
const markInRegisterWorker = env => ({
  ...env,
  [envVarName]: envVarValue
});
const isInRegisterWorker = process.env[envVarName] === envVarValue;
export { markInRegisterWorker, isInRegisterWorker };