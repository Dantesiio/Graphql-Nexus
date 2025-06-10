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
        if (ctx.user.role !== 'superadmin' && ctx.user.role !== 'admin') {
          throw new Error('No autorizado');
        }
        return users;
      },
    });
  },
});
export const UserAdminMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateUser', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
        email: stringArg(),
        name: stringArg(),
        role: stringArg(),
      },
      resolve: (_parent, args, ctx) => {
        if (!ctx.user || ctx.user.role !== 'superadmin') {
          throw new Error('No autorizado');
        }
        const user = users.find(u => u.id === args.id);
        if (!user) throw new Error('Usuario no encontrado');
        // Validar email único si se cambia el email
        if (args.email && users.some(u => u.email === args.email && u.id !== args.id)) {
          throw new Error('El email ya está registrado por otro usuario');
        }
        if (args.email) user.email = args.email;
        if (args.name) user.name = args.name;
        if (args.role) user.role = args.role;
        return user;
      },
    });

    t.field('deleteUser', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_parent, args, ctx) => {
        if (!ctx.user || ctx.user.role !== 'superadmin') {
          throw new Error('No autorizado');
        }
        const idx = users.findIndex(u => u.id === args.id);
        if (idx === -1) throw new Error('Usuario no encontrado');
        const user = users[idx];
        users.splice(idx, 1);
        return user;
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
          // Validar email único
          if (users.some(u => u.email === args.email)) {
            throw new Error('El email ya está registrado');
          }
          const hashedPassword = await bcrypt.hash(args.password, 10);
          const user = {
            id: `${users.length + 1}`,
            email: args.email,
            password: hashedPassword,
            name: args.name,
            role: 'usuario',
          };
          users.push(user);
          // Solo para pruebas: primer usuario es superadmin
          if (users.length === 1) {
            users[0].role = "superadmin";
          }
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