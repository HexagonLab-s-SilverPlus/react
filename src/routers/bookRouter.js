import React from 'react';
import { Route } from 'react-router-dom';

import BookList from '../pages/book/BookList';
import BookWrite from '../pages/book/BookWrite';

const bookRouter = [
 <>
    <Route path="/book" element={<BookList/>}/>,
    <Route path="/book/write" element={<BookWrite/>}/>,
 </>
];

export default bookRouter;
