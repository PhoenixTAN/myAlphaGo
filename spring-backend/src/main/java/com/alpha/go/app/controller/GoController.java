package com.alpha.go.app.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GoController {

    @RequestMapping("/")
    public String helloWorld() {
        return "Hello World!";
    }

}
