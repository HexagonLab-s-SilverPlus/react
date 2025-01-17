import React from 'react';
import { Route } from 'react-router-dom';

import BookList from '../pages/book/BookList';
import BookWrite from '../pages/book/BookWrite';
import BookUpdate from '../pages/book/BookUpdate';
import BookDetail from '../pages/book/BookDetail';
import ProtectedRoute from '../components/common/ProtectedRoute';
const bookRouter = [
 <>
    <Route path="/bookRouter/book" element={<ProtectedRoute element={<BookList/>} />}/>,
    <Route path="/bookRouter/book/write" element={<ProtectedRoute element={<BookWrite/>} />}/>,
    <Route path="/bookRouter/book/update/:bookUUID" element={<ProtectedRoute element={<BookUpdate/>} />}/>,
    <Route path="/bookRouter/book/detail/:bookUUID" element={<ProtectedRoute element={<BookDetail/>} />}/>,
 </>
];

export default bookRouter;
