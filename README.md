# GraphQL-Nexus API

## Descripción

Este proyecto es una migración de una API REST a una API GraphQL usando Node.js, TypeScript y Nexus. Permite la gestión de usuarios, proyectos y comentarios, implementando autenticación JWT y control de roles (`superadmin` y `usuario regular`).

---

## Reporte de Implementación

### 1. Implementación de GraphQL (50%)

#### Consultas y Mutaciones (30%)
✅ **Cumplido**
- Implementación completa de operaciones CRUD para:
  - Usuarios (registro, login, actualización, eliminación)
  - Proyectos (creación, lectura, actualización, eliminación)
  - Comentarios (creación, lectura, actualización, eliminación)
- Todas las operaciones están protegidas con autenticación JWT
- Implementación de roles y permisos específicos

#### Fragments (10%)
✅ **Cumplido**
- Implementación de fragments para reutilización de código
- Ejemplo en el README muestra el uso de `ProjectFields` fragment
- Los fragments están documentados en `queries.graphql`

#### Manejo de Errores (10%)
✅ **Cumplido**
- Implementación de manejo de errores en consultas y mutaciones
- Validaciones de entrada para todas las operaciones
- Mensajes de error descriptivos

### 2. Calidad del Código y Uso de TypeScript (15%)
✅ **Cumplido**
- Proyecto completamente tipado con TypeScript
- Estructura de carpetas organizada
- Configuración de ESLint y Prettier para mantener la calidad del código
- Archivos de configuración TypeScript presentes (`tsconfig.json`, `tsconfig.build.json`)

### 3. Funcionalidad y Validaciones (15%)
✅ **Cumplido**
- Implementación completa de todas las funcionalidades requeridas:
  - Gestión de usuarios con roles
  - CRUD de proyectos
  - CRUD de comentarios
  - Sistema de autenticación
- Validaciones implementadas para todas las operaciones

### 4. Seguridad en Autenticación y Autorización (10%)
✅ **Cumplido**
- Implementación de JWT para autenticación
- Middleware de autorización por roles
- Protección de rutas y operaciones CRUD
- Control de acceso basado en roles (superadmin vs usuario regular)

### 5. Documentación y Presentación (10%)
✅ **Cumplido**
- README completo y detallado
- Documentación de endpoints y tipos
- Ejemplos de uso con GraphQL
- Instrucciones claras de instalación y ejecución
- Proyecto desplegado en Render

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
   git clone https://github.com/Dantesiio/Graphql-Nexus.git
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

## Limitaciones Actuales

- Los datos se almacenan en memoria (se pierden al reiniciar el servidor)
- No incluye persistencia en base de datos
- El primer usuario registrado es `superadmin` solo para facilitar pruebas

---

## Despliegue

Puedes ver el despliegue con playground aquí: [https://graphql-nexus.onrender.com](https://graphql-nexus.onrender.com)

---

## Dificultades encontradas

- Migrar la lógica de autorización de REST a GraphQL
- Implementar relaciones inversas y fragments en las queries
- Manejo de datos en memoria (sin persistencia real)

---

## Autores

* [David Donneys](https://github.com/Dantesiio)
* [Jhonatan Castaño](https://github.com/JhonatanCI)
* [Andrés Pino](https://github.com/AndresPin0)

---
