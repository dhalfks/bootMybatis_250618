package com.example.demo.controller;

import com.example.demo.domain.CommentVO;
import com.example.demo.domain.PagingVO;
import com.example.demo.handler.PagingHandler;
import com.example.demo.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@Slf4j
@RequestMapping("/comment")
@RestController
public class CommentController {
    private final CommentService commentService;

    @PostMapping("/post")
    @ResponseBody
    public String post(@RequestBody CommentVO commentVO){
        log.info(">>>> commentVO >> {}", commentVO);
        int isOk = commentService.post(commentVO);
        return isOk >0 ? "1":"0";
    }

    @GetMapping("/list/{bno}/{page}")
    @ResponseBody
    public PagingHandler list (@PathVariable("bno")long bno, @PathVariable("page")int page){
        PagingVO pagingVO = new PagingVO(page, 5);
        PagingHandler pagingHandler = commentService.getList(bno, pagingVO);
        log.info(">>> pagingHandler >> {}", pagingHandler);
        return pagingHandler;
    }


    @PutMapping("/update")
    @ResponseBody
    public String update(@RequestBody CommentVO commentVO){
        int isOk = commentService.update(commentVO);
        return isOk >0 ? "1" : "0";
    }

    @DeleteMapping("/remove/{cno}")
    @ResponseBody
    public String remove(@PathVariable("cno") long cno){
        int isOk = commentService.remove(cno);
        return isOk >0 ? "1" : "0";
    }
}
