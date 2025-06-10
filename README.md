# GraphQL-Nexus API

## Descripción

Este proyecto es una migración de una API REST a una API GraphQL usando Node.js, TypeScript y Nexus. Permite la gestión de usuarios, proyectos y comentarios, implementando autenticación JWT y control de roles (`superadmin` y `usuario regular`).

---

## Funcionalidades

- **Gestión de Usuarios:**  
  - Registro y login con JWT.
  - CRUD de usuarios (solo `superadmin` puede modificar/eliminar usuarios).
  - Roles: `superadmin` y `usuario regular`.

- **Gestión de Proyectos:**  
  - CRUD de proyectos.
  - Usuarios pueden gestionar sus propios proyectos.
  - `superadmin` puede gestionar proyectos de cualquier usuario.
  - Relación con usuarios y comentarios.

- **Gestión de Comentarios:**  
  - CRUD de comentarios.
  - Relación con proyectos y usuarios.
  - Solo el autor o `superadmin` puede editar/eliminar comentarios.

- **Autenticación y Autorización:**  
  - JWT para proteger todas las operaciones.
  - Middleware/contexto para autorización por rol.

---

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/Graphql-Nexus.git
   cd Graphql-Nexus
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Ejecuta el servidor:
   ```bash
   npx ts-node src/index.ts
   ```
   El servidor estará disponible en [http://localhost:4000/](http://localhost:4000/)

---

## Uso

### Registro y login

1. **Registra un usuario:**
   ```graphql
   mutation {
     register(email: "admin@mail.com", password: "1234", name: "Admin") {
       id
       email
       role
     }
   }
   ```
   > El primer usuario registrado será `superadmin` automáticamente (solo para pruebas).

2. **Login:**
   ```graphql
   mutation {
     login(email: "admin@mail.com", password: "1234") {
       token
       user {
         id
         role
       }
     }
   }
   ```
   > Usa el token en los headers para todas las operaciones protegidas:
   ```json
   {
     "authorization": "Bearer TU_TOKEN"
   }
   ```

### Ejemplo de fragment

```graphql
fragment ProjectFields on Project {
  id
  name
  description
  owner {
    id
    name
  }
  comments {
    id
    content
  }
}

query {
  projects {
    ...ProjectFields
  }
}
```

---

## Pruebas rápidas

Consulta el archivo [`queries.graphql`](./queries.graphql) para ejemplos de todas las operaciones CRUD y fragments.

---

## Notas y Limitaciones

- Los datos se almacenan en memoria (se pierden al reiniciar el servidor).
- No incluye persistencia en base de datos.
- El primer usuario registrado es `superadmin` solo para facilitar pruebas.
- Puedes crear más usuarios y cambiar roles usando mutations protegidas.

---

## Despliegue

Puedes ver el despliegue con playgorund aqui: [https://graphql-nexus.onrender.com](https://graphql-nexus.onrender.com)

---

## Dificultades encontradas

- Migrar la lógica de autorización de REST a GraphQL.
- Implementar relaciones inversas y fragments en las queries.
- Manejo de datos en memoria (sin persistencia real).

---

## Autores

- [Jhonatan Castaño, David Donneys, Andres Pino](https://github.com/Dantesiio/Graphql-Nexus)

---

## Licencia

MIT