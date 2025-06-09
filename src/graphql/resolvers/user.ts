import { extendType, stringArg, nonNull, objectType } from 'nexus';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Simulación de base de datos en memoria
export const users: any[] = [];


export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('users', {
      type: 'User',
      resolve: (_parent, _args, ctx) => {
        if (!ctx.user) throw new Error('No autenticado');
        return users;
      },
    });
  },
});

export const UserMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('register', {
      type: 'User',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        name: stringArg(),
      },
      resolve: async (_parent, args) => {
        const hashedPassword = await bcrypt.hash(args.password, 10);
        const user = {
          id: `${users.length + 1}`,
          email: args.email,
          password: hashedPassword,
          name: args.name,
          role: 'usuario', // por defecto
        };
        users.push(user);
        return user;
      },
    });

    t.field('login', {
      type: objectType({
        name: 'AuthPayload',
        definition(t) {
          t.string('token');
          t.field('user', { type: 'User' });
        },
      }),
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, { email, password }) => {
        const user = users.find(u => u.email === email);
        if (!user) throw new Error('Usuario no encontrado');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Contraseña incorrecta');
        const token = jwt.sign({ id: user.id, role: user.role }, 'SECRET_KEY');
        return { token, user };
      },
    });
  },
});