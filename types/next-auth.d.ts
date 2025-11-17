import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      kycStatus: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: string;
    kycStatus: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    kycStatus: string;
  }
}
