import jwt from 'jsonwebtoken';

export interface Context {
  user?: { id: string; role: string };
}

export function createContext({ req, connection, ...rest }: any): Context {
  // Apollo Server puro: los headers están en req.headers
  const headers = req?.headers || rest?.headers;
  const token = headers?.authorization?.replace('Bearer ', '');
  if (!token) return {};
  try {
    const decoded = jwt.verify(token, 'SECRET_KEY') as any;
    return { user: { id: decoded.id, role: decoded.role } };
  } catch {
    return {};
  }
}