TODO

* buscar y agregar class features de la subclase
* BUGFIX 1er render de background features no tiene img !?
* indexar advancements
* (preguntar a Jeff si hay un API para completar advancements a los bifes) completar class advancement con las ref de los items creados para que puedan borrarse los class features
* idem anterior para background features
* dejar de indexar los class features
* reemplazar el manejo de HP por usar HitPointsAdvancements de la clase (no cambiar UI, solo guardar los values en el advancement para poder deshacerlo)

==============================================
DONE

* reemplazar Class Features por usar los advancement de la Clase
** cuando obtengo los advancements, traigo el index del advancement (o lo indexo si no existe)
** mantengo la hidratacion del indice cuando se crea el personaje
* hacer una migracion para no romperle todo a todos
* cambiar la indexacion de Background Features por Backgrounds
* cambiar selector (y UI) para elegir Background
* agregar item del Background y Background Feature al actor 
* cambiar selector de background features por listado de features tomado del Advancement de Background
* indexar subclasses
* agregar subclase al actor creado