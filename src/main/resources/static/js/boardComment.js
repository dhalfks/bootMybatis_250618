console.log("Comment js in");
console.log(bnoValue);
let cmtWriter = document.querySelectorAll(".cmtWriter");
console.log(cmtWriter[0].innerText);

document.getElementById('cmtAddBtn').addEventListener('click',()=>{
    const cmtText = document.getElementById('cmtText');
    const cmtWriter = document.getElementById('cmtWriter');

    if(cmtText == "" || cmtText == null){
        alert('댓글입력');
        cmtText.focus();
        return false;
    }
    const cmtData = {
        bno : bnoValue,
        content : cmtText.value,
        writer : cmtWriter.innerText
    }

    postCommentToServer(cmtData).then(result =>{
        if(result === "1"){
            alert("댓글등록성공");
            cmtText.value="";
        }
        // 댓글 호출
        spreadCommentList(cmtData.bno);
    })
});

function spreadCommentList(bnoValue, page=1){
    getCommentListFromServer(bnoValue, page).then(result =>{
        console.log(result);
        
        const ul = document.getElementById('cmtListArea');
        if(result.commentList.length > 0){
            if(page == 1){
                ul.innerHTML=""; // 기존 샘플값 비우기.
            }
            for(let cvo of result.commentList){
                let li = `<li data-cno = "${cvo.cno}" class="list-group-item">`;
                li +=`<div class="ms-2 me-auto">`;
				li +=`<div class="fw-bold">${cvo.writer}</div>`;
				li +=`${cvo.content}`;
				li +=`</div>`;
				li +=`<span class="badge bg-dark rounded-pill">${cvo.regDate}</span>`;
				if(cmtWriter[0].innerText !== "로그인을 해주세요."){
                    if(userEmail === cvo.writer){
                        li +=`<button type="button" class="btn btn-outline-warning mod" data-bs-toggle="modal" data-bs-target="#myModal">e</button>`;
                        li +=`<button type="button" class="btn btn-outline-danger del">x</button>`;
                    }
                }
               
				li +=`</li>`;
                ul.innerHTML += li;
            }

            //page 처리
            let moreBtn = document.getElementById('moreBtn');
            // 전체 페이지가 현재 페이지보다 크다면...  (나와야 할 페이지가 존재한다면...)
            if(result.pagingVO.pageNo < result.realEndPage){
                moreBtn.style.visibility = "visible"; // 표시
                moreBtn.dataset.page = page + 1;
            }else{
                moreBtn.style.visibility = "hidden"; // 숨김
            }

        }else{
            let li = `<li class="list-group-item">Comment List Empty</li>`;
            ul.innerHTML = li;
        }
        
    });
};

document.addEventListener('click',(e)=>{
    if(e.target.id == 'moreBtn'){
        let page = parseInt(e.target.dataset.page);
        spreadCommentList(bnoValue, page);
    }
    if(e.target.classList.contains('del')){
        let cno = e.target.closest('li').dataset.cno;
        removeCommentToServer(cno).then(result =>{
            if(result >0){
                alert('삭제 성공!!');
                spreadCommentList(bnoValue);
            }
        })
    }
    if(e.target.classList.contains('mod')){
        let li = e.target.closest('li');
        let modWriter = li.querySelector(".fw-bold").innerText;
        document.getElementById('cmtWriterMod').innerText = modWriter;
        let cmtText = li.querySelector('.fw-bold').nextSibling; // 쿼리 값의 같은 부모의 다른 형제 값 
        document.getElementById('cmtTextMod').value = cmtText.nodeValue; // 그냥 넣으면 Object 로 입력

        // 수정 버튼 id =cmtModBtn dataset 달기.
        document.getElementById('cmtModBtn').setAttribute("data-cno", li.dataset.cno);
    }
    if(e.target.id == 'cmtModBtn'){
        let cmtModData={
            cno : e.target.dataset.cno,
            content : document.getElementById('cmtTextMod').value
        }
        console.log(cmtModData);
        
        //비동기 처리
        updateCommentToServer(cmtModData).then(result =>{
            if(result >0){
                alert('수정 성공!!');
            }
            //모달창 닫기
            document.querySelector('.btn-close').click();
            spreadCommentList(bnoValue);
        })
    }
});


// 비동기 데이터 호출 CRUD

async function postCommentToServer(cmtData) {
    try {
        const url = "/comment/post";
        const config={
            method:'post',
            headers : {
                'content-type' : 'application/json; charset=utf-8'
            },
            body: JSON.stringify(cmtData)
        };
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (error) {
        console.log(error);
    }
    
}

async function getCommentListFromServer(bno, page){
    try {
        const resp = await fetch('/comment/list/'+bnoValue+'/'+page);
        const result = await resp.json();
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function updateCommentToServer(cmtModData){
    try {
        const url ="/comment/update"
        const config={
            method : "put",
            headers:{
                'content-type':'application/json; charset=utf-8'
            },
            body : JSON.stringify(cmtModData)
        }
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (error) {
        console.log(error);
        
    }
}

async function removeCommentToServer(cno) {
    try {
        const url = "/comment/remove/"+cno;
        const config={
            method:'delete'
        }
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (error) {
        console.log(error);
    }
}