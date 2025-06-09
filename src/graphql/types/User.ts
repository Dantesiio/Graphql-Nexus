import { objectType } from 'nexus';
import { projects } from '../resolvers/project';
import { comments } from '../resolvers/comment';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('email');
    t.string('name');
    t.nonNull.string('role');
    // Relación: proyectos del usuario
    t.list.field('projects', {
      type: 'Project',
      resolve: (parent, _args, _ctx) => {
        return projects.filter(p => p.ownerId === parent.id);
      }
    });
    // Relación: comentarios del usuario
    t.list.field('comments', {
      type: 'Comment',
      resolve: (parent, _args, _ctx) => {
        return comments.filter(c => c.authorId === parent.id);
      }
    });
  },
});