export const getEnvFilePath = () => {
  const NODE_ENV = process.env.NODE_ENV
  return '.env' + (NODE_ENV === 'local' ? '.local' : NODE_ENV === 'development' ? '.development' : '')
}
