package ru.rea.webstore.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class AppController {

    /**
     * Определим универсальный маршрут,
     * который будет обслуживает основной HTML-файл
     * для всех запрошенных маршрутов.
     */

    /**
     * Путь / в фигурных скобках {path:[^\\.]*} задает переменную пути {path},
     * которая будет соответствовать любому значению, не содержащему точку.
     * Например, /users, /about, /contact, и т.д.
     * 
     * @PathVariable указывает, что значение переменной path будет получено из пути
     *               запроса.
     */

    /* @GetMapping("/")
    public String getIndexPage() {
        return "index";
    } */

    @GetMapping("/{path:[^\\.]*}") 
    public String forwardToIndex(@PathVariable String path) {

        /** 
         * Здесь мы проверяем значение переменной path. 
         * Если оно не равно "index", то выполняется перенаправление (forward) на путь /index. 
         * Перенаправление означает, что запрос будет передан на другой путь без изменения URL. 
         * Если же значение path равно "index", то возвращается строка "index", 
         * что означает, что контроллер вернет представление с именем "index". 
         * 
         * В результате, при обращении к любому пути, кроме /index, 
         * контроллер будет перенаправлять запрос на /index, 
         * а при обращении к пути /index будет возвращаться представление с именем "index". 
         * Это позволяет отображать одно и то же представление для различных путей.
         */

         /** 
          * path != null && !path.isEmpty() && 
          * перенаправление на /index будет выполняться только для непустых значений path, 
          * отличных от "index". Это предотвратит зацикливание и позволит обрабатывать другие запросы корректно.
          */

        if (path != null && !path.isEmpty() && !"index".equals(path)) {
            return "forward:/index";
        }
        return "index";
    }

}
