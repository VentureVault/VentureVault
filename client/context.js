import { createContext } from 'react';

export const userContext = createContext({ user: null, setUser: () => { }});
export const categoryContext = createContext({ category: null, setCategory: () => { } });
export const pageContext = createContext({ current: null });