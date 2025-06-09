import { extendType, stringArg, nonNull } from 'nexus';

// Simulación de base de datos en memoria
export const projects: any[] = [];

export const ProjectQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('projects', {
      type: 'Project',
      resolve: (_parent, _args, ctx) => {
        if (!ctx.user) throw new Error('No autenticado');
        // Si es admin, ve todos; si no, solo los suyos
        if (ctx.user.role === 'superadmin') return projects;
        return projects.filter(p => p.ownerId === ctx.user!.id);
      },
    });
  },
});

export const ProjectMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createProject', {
      type: 'Project',
      args: {
        name: nonNull(stringArg()),
        description: stringArg(),
      },
      resolve: (_parent, args, ctx) => {
        if (!ctx.user) throw new Error('No autenticado');
        const project = {
          id: `${projects.length + 1}`,
          name: args.name,
          description: args.description,
          ownerId: ctx.user.id,
        };
        projects.push(project);
        return project;
      },
    });

    t.field('updateProject', {
      type: 'Project',
      args: {
        id: nonNull(stringArg()),
        name: stringArg(),
        description: stringArg(),
      },
      resolve: (_parent, args, ctx) => {
        if (!ctx.user) throw new Error('No autenticado');
        const project = projects.find(p => p.id === args.id);
        if (!project) throw new Error('Proyecto no encontrado');
        if (ctx.user.role !== 'superadmin' && project.ownerId !== ctx.user.id) {
          throw new Error('No autorizado');
        }
        if (args.name) project.name = args.name;
        if (args.description) project.description = args.description;
        return project;
      },
    });

    t.field('deleteProject', {
      type: 'Project',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_parent, args, ctx) => {
        if (!ctx.user) throw new Error('No autenticado');
        const idx = projects.findIndex(p => p.id === args.id);
        if (idx === -1) throw new Error('Proyecto no encontrado');
        const project = projects[idx];
        if (ctx.user.role !== 'superadmin' && project.ownerId !== ctx.user.id) {
          throw new Error('No autorizado');
        }
        projects.splice(idx, 1);
        return project;
      },
    });
  },
});