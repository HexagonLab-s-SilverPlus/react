export const PagingCalculate = (pageNumber, listCount, pageSize) => {
    
    const maxPage = Math.ceil(listCount / pageSize);
    const startPage = Math.floor(pageNumber / 10 - 0.1) + 1;
    let  endPage = startPage + pageSize - 1;
    if(maxPage < endPage){
    endPage = maxPage;
    }
    console.log("startPage : " + startPage);
    console.log("endPage : " + endPage);
  
    return {pageNumber, listCount, maxPage, startPage, endPage };
  };