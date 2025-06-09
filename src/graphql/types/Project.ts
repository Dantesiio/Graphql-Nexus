import { objectType } from 'nexus';
import { users } from '../resolvers/user'; // Asegúrate de exportar 'users' desde user.ts
import { comments } from '../resolvers/comment';

export const Project = objectType({
  name: 'Project',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.string('description');
    t.nonNull.string('ownerId');
    t.field('owner', {
      type: 'User',
      resolve: (parent, _args, _ctx) => {
        return users.find(u => u.id === parent.ownerId);
      }
    });
    t.list.field('comments', {
      type: 'Comment',
      resolve: (parent, _args, _ctx) => {
        return comments.filter(c => c.projectId === parent.id);
      }
    });
  },
});