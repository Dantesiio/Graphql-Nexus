import { objectType } from 'nexus';
import { users } from '../resolvers/user';
import { projects } from '../resolvers/project';

export const Comment = objectType({
  name: 'Comment',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('content');
    t.nonNull.string('authorId'); // Relación con User
    t.nonNull.string('projectId'); // Relación con Project
    t.field('createdAt', { type: 'String' });

    // Relación: autor del comentario
    t.field('author', {
      type: 'User',
      resolve: (parent, _args, _ctx) => {
        return users.find(u => u.id === parent.authorId);
      }
    });

    // Relación: proyecto al que pertenece el comentario
    t.field('project', {
      type: 'Project',
      resolve: (parent, _args, _ctx) => {
        return projects.find(p => p.id === parent.projectId);
      }
    });
  },
});