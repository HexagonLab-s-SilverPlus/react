export const PagingDiv8Calculate = (pageNumber, listCount, pageSize = 8) => {
    //초대 페이지 계산
    const maxPage = Math.ceil(listCount / pageSize);

    //현재 페이지가 속한 그룹의 시작 페이지와 끝 페이지 계산
    const startPage = Math.floor((pageNumber - 1) / groupSize) * groupSize + 1;
    let  endPage = startPage + pageSize - 1;

    //끝 페이지가 최대 페이지를 초과하지 않도록 조정
    if(maxPage < endPage){
      endPage = maxPage;
    }
    
    console.log("startPage : " + startPage);
    console.log("endPage : " + endPage);
  
    return {maxPage, startPage, endPage};
};