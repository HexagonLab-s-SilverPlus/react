import React from 'react';
import { Route } from 'react-router-dom';

import BookList from '../pages/book/BookList';

const bookRouter = [
 <>
    <Route path="/book" element={<BookList/>}/>,
 </>
];

export default bookRouter;
