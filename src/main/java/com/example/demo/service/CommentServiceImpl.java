package com.example.demo.service;

import com.example.demo.domain.CommentVO;
import com.example.demo.domain.PagingVO;
import com.example.demo.handler.PagingHandler;
import com.example.demo.repository.CommentMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Slf4j
@Service
public class CommentServiceImpl implements CommentService{
    private final CommentMapper commentMapper;

    @Override
    public int post(CommentVO commentVO) {
        return commentMapper.post(commentVO);
    }

    @Override
    public PagingHandler getList(long bno, PagingVO pagingVO) {
        PagingHandler pagingHandler = new PagingHandler(
            pagingVO,
                commentMapper.getTotalCount(bno),
                commentMapper.getCommentList(bno, pagingVO)
        );

        return pagingHandler;
    }

    @Override
    public int update(CommentVO commentVO) {
        return commentMapper.update(commentVO);
    }

    @Override
    public int remove(long cno) {
        return commentMapper.remove(cno);
    }
}
