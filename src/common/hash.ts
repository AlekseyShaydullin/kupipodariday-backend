import * as bycrypt from 'bcryptjs';

export function hashPassword(password: string) {
  return bycrypt.hash(password, 10);
}

export function verificationPassword(password: string, hash: string) {
  return bycrypt.compare(password, hash);
}
