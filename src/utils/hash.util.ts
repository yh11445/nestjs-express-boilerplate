import * as bcrypt from 'bcrypt'

export const hashMake = async (plainText: string, saltOrRounds = 10): Promise<string> => {
  try {
    const hash = await bcrypt.hash(plainText, saltOrRounds)
    return hash
  } catch (error) {
    throw new Error('Error generating hash')
  }
}

export const hashCheck = async (plainText: string, encrypted: string): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(plainText, encrypted)
    return isMatch
  } catch (error) {
    throw new Error('Error comparing hash')
  }
}
