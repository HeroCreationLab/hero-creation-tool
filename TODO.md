HECHO

* reemplazar Class Features por usar los advancement de la Clase
** cuando obtengo los advancements, traigo el index del advancement (o lo indexo si no existe)
** mantengo la hidratacion del indice cuando se crea el personaje


POR HACER

* (preguntar a Jeff si hay un API para completar advancements a los bifes) completar advancement.value con las ref de los items creados para que puedan borrarse

* dejar de indexar eagerly los class features (borrar setting)

* reemplazar el manejo de HP por usar HitPointsAdvancements de la clase (no cambiar UI, solo guardar los values en el advancement para poder deshacerlo)

* cambiar la indexacion de Background Features por Backgrounds

* hacer una migracion para no romperle todo a todos

* cambiar selector (y UI) para elegir Background

* cambiar selector de background features por listado de features tomado del Advancement de Background

* agregar item del Background y Background Feature al actor 

* guardar en el Background el value del advancement para que borre el feature si borras el background

