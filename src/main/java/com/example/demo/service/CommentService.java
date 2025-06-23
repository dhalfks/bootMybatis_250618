package com.example.demo.service;

import com.example.demo.domain.CommentVO;
import com.example.demo.domain.PagingVO;
import com.example.demo.handler.PagingHandler;

public interface CommentService {
    int post(CommentVO commentVO);

    PagingHandler getList(long bno, PagingVO pagingVO);

    int update(CommentVO commentVO);

    int remove(long cno);
}
