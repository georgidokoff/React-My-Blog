import React from 'react';

import {
    create,
    getAll,
    getThree,
} from '../services/articlesService';

export const ArticleContext = React.createContext();

async function createArticle(articleData) {
    let result = await create().cath((err)=>{console.log(err)});
    return result;
}

async function getAllArticles() {
    let result = await getAll();
    return result;
}

async function getLastThreeArticles() {
    let result = await getThree().cath((err)=>{console.log(err)});
    return result;
}

export const articleContextValues = {
    createArticle,
    getAllArticles,
    getLastThreeArticles,
};