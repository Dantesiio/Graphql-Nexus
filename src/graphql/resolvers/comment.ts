import { extendType, stringArg, nonNull } from 'nexus';
import { projects } from './project'; 
// Simulación de base de datos en memoria
export const comments: any[] = [];

export const CommentQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('comments', {
      type: 'Comment',
      args: {
        projectId: stringArg(),
      },
      resolve: (_parent, args, ctx) => {
        if (!ctx.user) throw new Error('No autenticado');
        if (args.projectId) {
          return comments.filter(c => c.projectId === args.projectId);
        }
        return comments;
      },
    });
  },
});

export const CommentMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createComment', {
      type: 'Comment',
      args: {
        content: nonNull(stringArg()),
        projectId: nonNull(stringArg()),
      },
      resolve: (_parent, args, ctx) => {
        if (!ctx.user) throw new Error('No autenticado');
        if (!args.content.trim()) throw new Error('El contenido no puede estar vacío');
        const project = projects.find(p => p.id === args.projectId);
        if (!project) throw new Error('Proyecto no encontrado');
        const comment = {
          id: `${comments.length + 1}`,
          content: args.content,
          authorId: ctx.user.id,
          projectId: args.projectId,
          createdAt: new Date().toISOString(),
        };
        comments.push(comment);
        return comment;
      },
    });

    t.field('updateComment', {
      type: 'Comment',
      args: {
        id: nonNull(stringArg()),
        content: nonNull(stringArg()),
      },
      resolve: (_parent, args, ctx) => {
        if (!ctx.user) throw new Error('No autenticado');
        const comment = comments.find(c => c.id === args.id);
        if (!comment) throw new Error('Comentario no encontrado');
        if (comment.authorId !== ctx.user.id && ctx.user.role !== 'superadmin') {
          throw new Error('No autorizado');
        }
        if (!args.content.trim()) throw new Error('El contenido no puede estar vacío');
        comment.content = args.content;
        return comment;
      },
    });

    t.field('deleteComment', {
      type: 'Comment',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_parent, args, ctx) => {
        if (!ctx.user) throw new Error('No autenticado');
        const idx = comments.findIndex(c => c.id === args.id);
        if (idx === -1) throw new Error('Comentario no encontrado');
        const comment = comments[idx];
        if (comment.authorId !== ctx.user.id && ctx.user.role !== 'superadmin') {
          throw new Error('No autorizado');
        }
        comments.splice(idx, 1);
        return comment;
      },
    });
  },
});