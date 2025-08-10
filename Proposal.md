# TP-Desarrollo-de-Software
## Grupo
### Integrantes
* Cossia Colagioia, Lucas - 52777
* Soto, Nahir Yania - 47103
* Moratti, Augusto Franco - 52555
* Bertuccelli, Valentin - 52809

### Repositorios
* [BackEnd](https://github.com/AugustoMoratti/TP-Desarrollo-de-Software/tree/main/Backend)

* [FrontEnd](https://github.com/AugustoMoratti/TP-Desarrollo-de-Software/tree/main/Frontend)

## Tema

### Descripción
Nuestra propuesta se basa en una aplicacion online que logre conectar dos personas, un primer usuario que requiere de un servicio (como puede ser un electricista) y otro tipo de usuario que ofrezca sus servicios, en la cual los usuarios puedan encontrar, postular y puntuar profesionales que estén ofreciendo sus servicios. estos servicios están orientado a oficios como electricista, plomero o carpintero, todos con su debida acreditación y con reseñas de usuarios. La idea es crear un lugar donde se pueden encontrar profesionales con validaciones de usuarios previos con sus experiencia.

### Diagrama Entidad-Relacion (D-E-R)
![Captura de pantalla del Diagrama de Entidad-Relacion del TP](https://github.com/user-attachments/assets/bd5c4105-e9cd-4c32-a217-db27fa7ecbd3)


## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Provincia<br/>2. CRUD Profesiones<br/>3. CRUD Admin<br/>4. CRUD Trabajos<br/>|
|CRUD dependiente|1. CRUD Usuarios *{depende de}* CRUD Provincia<br/>2. CRUD Localidad *{depende de}* CRUD Provincia<br/>3. CRUD Cliente/Profesional *{depende de}* CRUD Usuarios|
|Listado + detalle|1. Listado de perfiles filtrado por Profesion, Localidad, Provincia Y Valoracion. Muestra Nombre y Valoracion => detalle CRUD Perfil<br/>2. Listado de Profesion. Muestra Nombre => detalle CRUD Profesion <br/>3. Listado de trabajos filtrado por Fecha, Profesional. Muestra trabajos => detalle CUU Trabajo|
|CUU/Epic|1. Agendar trabajo<br/>2. Aceptar trabajo<br/>3. Reseñar Trabajo<br/>4. Cancelar Trabajo<br/>5. Pagar Trabajo<br/>6. Ver estado de cuotas de pago|

Adicional para Aprobación:
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Provincia<br/>2. CRUD Profesiones<br/>3. CRUD Usuarios<br/>4. CRUD Localidad<br/>5. CRUD Admin<br/>6. CRUD Cliente/Profesional|
|CUU/Epic|1. Agendar trabajo<br/>2. Aceptar trabajo<br/>3. Reseñar Trabajo<br/>4. Cancelar Trabajo<br/>5. Pagar Trabajo<br/>6. Ver estado de cuotas de pago<br/>7. Solicitar nueva profesion<br/>8. Recuperar contraseña<br/>|
