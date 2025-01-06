# API de Gestión de Habilidades

Esta API permite gestionar habilidades almacenadas en una base de datos SQLite. Puedes listar, agregar, editar y eliminar habilidades. Además, incluye la funcionalidad de gestionar microskills relacionadas con las habilidades y asignarles niveles del 1 al 4.

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

### **5. Listar microskills por habilidad**
- **Método:** `GET`
- **URL:** `/skills/:skillId/microskills`
- **Descripción:** Devuelve los microskills relacionados con una habilidad específica.
- **Ejemplo de respuesta:**
  ```json
  {
      "microskills": [
          { "id": 1, "name": "Subhabilidad 1", "level": 2 },
          { "id": 2, "name": "Subhabilidad 2", "level": 3 }
      ]
  }
  ```

### **6. Agregar un microskill a una habilidad**
- **Método:** `POST`
- **URL:** `/skills/:skillId/microskills`
- **Descripción:** Agrega un microskill relacionado con una habilidad existente.
- **Cuerpo de la petición:**
  ```json
  {
      "name": "Subhabilidad nueva",
      "level": 2
  }
  ```
- **Ejemplo de respuesta:**
  ```json
  {
      "message": "Microskill 'Subhabilidad nueva' agregado con éxito",
      "id": 5
  }
  ```
- **Errores comunes:**
  - Nivel inválido:
    ```json
    {
        "message": "Nombre o nivel inválido. El nivel debe estar entre 1 y 4."
    }
    ```

### **7. Editar un microskill**
- **Método:** `PUT`
- **URL:** `/microskills/:id`
- **Descripción:** Edita un microskill existente.
- **Cuerpo de la petición:**
  ```json
  {
      "name": "Subhabilidad actualizada",
      "level": 4
  }
  ```
- **Ejemplo de respuesta:**
  ```json
  {
      "message": "Microskill con ID 2 actualizado con éxito"
  }
  ```
- **Errores comunes:**
  - Microskill no encontrado:
    ```json
    {
        "message": "Microskill no encontrado"
    }
    ```

### **8. Eliminar un microskill**
- **Método:** `DELETE`
- **URL:** `/microskills/:id`
- **Descripción:** Elimina un microskill existente.
- **Ejemplo de respuesta:**
  ```json
  {
      "message": "Microskill con ID 1 eliminado con éxito"
  }
  ```
- **Errores comunes:**
  - Microskill no encontrado:
    ```json
    {
        "message": "Microskill no encontrado"
    }
    ```

### **9. Listar todas las habilidades con sus microskills**
- **Método:** `GET`
- **URL:** `/skills-with-microskills`
- **Descripción:** Devuelve todas las habilidades junto con sus microskills relacionados.
- **Ejemplo de respuesta:**
  ```json
  {
      "skills": [
          {
              "id": 1,
              "name": "Trabajo en equipo",
              "microskills": [
                  { "id": 1, "name": "Subhabilidad 1", "level": 2 },
                  { "id": 2, "name": "Subhabilidad 2", "level": 3 }
              ]
          },
          {
              "id": 2,
              "name": "Comunicación efectiva",
              "microskills": []
          }
      ]
  }
  ```

## **Errores Comunes**
- `400 Bad Request`: Datos inválidos o falta de parámetros obligatorios.
- `404 Not Found`: Recurso no encontrado (como un ID inexistente).
- `500 Internal Server Error`: Error en el servidor.

