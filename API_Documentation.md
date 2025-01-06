# API de Gestión de Habilidades

Esta API permite gestionar habilidades almacenadas en una base de datos SQLite. Puedes listar, agregar, editar y eliminar habilidades.

## **Base URL**
```
http://localhost:3000/api
```

## **Endpoints**

### **1. Listar habilidades**
- **Método:** `GET`
- **URL:** `/skills`
- **Descripción:** Devuelve una lista de todas las habilidades.
- **Ejemplo de respuesta:**
  ```json
  {
      "skills": [
          { "id": 1, "name": "Trabajo en equipo" },
          { "id": 2, "name": "Comunicación efectiva" }
      ]
  }
  ```

### **2. Agregar una habilidad**
- **Método:** `POST`
- **URL:** `/skills`
- **Descripción:** Agrega una nueva habilidad.
- **Cuerpo de la petición:**
  ```json
  {
      "skill": "Nueva habilidad"
  }
  ```
- **Ejemplo de respuesta:**
  ```json
  {
      "message": "Habilidad 'Nueva habilidad' agregada con éxito",
      "id": 3
  }
  ```
- **Errores comunes:**
  - Habilidad duplicada:
    ```json
    {
        "message": "La habilidad ya existe"
    }
    ```

### **3. Editar una habilidad**
- **Método:** `PUT`
- **URL:** `/skills/:id`
- **Descripción:** Edita una habilidad existente por su ID.
- **Cuerpo de la petición:**
  ```json
  {
      "skill": "Habilidad actualizada"
  }
  ```
- **Ejemplo de respuesta:**
  ```json
  {
      "message": "Habilidad con ID 1 actualizada a 'Habilidad actualizada'"
  }
  ```
- **Errores comunes:**
  - ID inexistente:
    ```json
    {
        "message": "Habilidad no encontrada"
    }
    ```

### **4. Eliminar una habilidad**
- **Método:** `DELETE`
- **URL:** `/skills/:id`
- **Descripción:** Elimina una habilidad existente por su ID.
- **Ejemplo de respuesta:**
  ```json
  {
      "message": "Habilidad con ID 1 eliminada con éxito"
  }
  ```
- **Errores comunes:**
  - ID inexistente:
    ```json
    {
        "message": "Habilidad no encontrada"
    }
    ```

## **Errores Comunes**
- `400 Bad Request`: Datos inválidos o falta de parámetros obligatorios.
- `404 Not Found`: Recurso no encontrado (como un ID inexistente).
- `500 Internal Server Error`: Error en el servidor.

