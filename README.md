## Description

El proyecto permite:
  ---> crear, leer, editar y eliminar personas de una lista de personas
  ---> crear, leer, editar y eliminar peliculas de una lista de peliculas
  ---> añadir y quitar peliculas de favoritos de cada persona.
  ---> tiene una constante de maximas peliclas favoritas.


Requiere una base de datos de tipo mysql vacía en el localHost con estos datos:

  DB_HOST=localhost
  DB_PORT=3306
  DB_USERNAME=root
  DB_PASSWORD=root
  DB_NAME=favoriteFilms

La estructura de personas esta dada:
  {
    "id": number,
    "firstName": string,
    "lastName": string,
    "birtdate": Date,
    "hasInsurance": boolean,
    "favouriteMovies": film[]
  }

La estructura de peliculas esta dada:
  {
    "id": number,
    "title": string,
    "genre": string,
    "favoritePerson": person[]
  }

Tiene una relación de ManyToMany (favoriteMovies-favoritePerson)

Las rutas para acceder desde la base de datos a personas son:

Get:  localhost:3000/person    ---> Muestra la lista completa de personas en la base de datos, con su relación 
                               ---> de peliculas favoritas.
      localhost:3000/person/id ---> Id puede ser tanto el nombre de la persona a buscar, como el id, 
                               ---> te muestra la persona con ese id, o la lista de personas que encuentra 
                               ---> con el nombre dado.   

Post:  localhost:3000/person    ---> Crea un nuevo registro de persona y muestra los datos de la persona creada
                                ---> tiene como campos obligatorios firstName y lastName

Delete:  localhost:3000/person/id    ---> Donde id es el id del registro de la persona a eliminar. 
                                     ---> Elimina la persona y devuelve true si la pudo eliminar y false si fallo.
                                             
Patch:  localhost:3000/person/id         ---> Requiere el id del registro de la persona a editar. 
                                         ---> Solo modifica los campos que se le pasa para modificar.
        localhost:3000/person/addMovie/id    ---> id es el registro de la persona a la que se le asigna
                                             ---> una pelicula favorita. 
                                             ---> Debe llevar en el body, el id de la pelicula a agregar,
                                             ---> o los datos de la pelicula a agregar, si no tiene id, la crea.
                                             ---> Si exede el n° de peliculas máximas dadas no la agrega y devuelve
                                             ---> un mensaje de error.
                                             ---> devuelve la persona con la lista actualizada.
        localhost:3000/person/subtractMovie/id    ---> id es el registro de la persona a la que se le quita
                                                  ---> una pelicula favorita. 
                                                  ---> Debe llevar en el body, el id de la pelicula a quitar,
                                                  ---> Si la pelicula se encuentra en la lista de favoritas
                                                  ---> la quita. devuelve la persona con la lista actualizada

Las rutas para acceder desde la base de datos a film son:

Get:  localhost:3000/film    ---> Muestra la lista completa de peliculas en la base de datos.
      localhost:3000/film/id ---> Id debe ser el id de la pelicula que se quiere acceder
                             ---> te muestra la pelicula con ese id

Post:  localhost:3000/person    ---> Crea un nuevo registro de persona y muestra los datos de la persona creada
                                ---> tiene como campos obligatorios firstName y lastName

Delete:  localhost:3000/film/id    ---> Donde id es el id del registro de la pelicula a eliminar. 
                                   ---> Elimina la pelicula y devuelve true si la pudo eliminar y false si fallo.
                                             
Patch:  localhost:3000/film/id         ---> Requiere el id del registro de la pelicula a editar. 
                                       ---> Solo modifica los campos que se le pasa para modificar.
        