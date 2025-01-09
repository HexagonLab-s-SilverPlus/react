import React from 'react';
import { Route } from 'react-router-dom';

import BookList from '../pages/book/BookList';
import BookWrite from '../pages/book/BookWrite';
import BookUpdate from '../pages/book/BookUpdate';
import BookDetail from '../pages/book/BookDetail';

const bookRouter = [
 <>
    <Route path="/book" element={<BookList/>}/>,
    <Route path="/book/write" element={<BookWrite/>}/>,
    <Route path="/book/update/:bookUUID" element={<BookUpdate/>}/>,
    <Route path="/book/detail/:bookUUID" element={<BookDetail/>}/>,
 </>
];

export default bookRouter;
