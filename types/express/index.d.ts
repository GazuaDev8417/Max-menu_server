// types/express/index.d.ts
import { CookieParseOptions } from 'cookie-parser'

declare global {
  namespace Express {
    interface Request {
      cookies: {
        [key: string]: string;
      }
    }
  }
}

export {}