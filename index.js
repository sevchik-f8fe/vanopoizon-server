import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import mongoose from "mongoose";

import { getProductsReq, getFilteredProductsReq, getMiniProductListReq, getCitiesReq, getPvzsReq, getProductBySpuReq, getSpuByLinkReq } from "./apiRequests.js";
import { checkAuthMiddleware, auth, checkAuth } from "./adminAuthControllers.js";
import { isValidInitData, userTgAuth, saveDeliveryData } from "./tgUserControllers.js";
import { addToFavorites, removeFromFavorites, getFavorites } from "./favoriteControllers.js";

const app = express();

axiosRetry(axios, { retries: 3 });
app.use(express.json());

const proxyMiddleware = createProxyMiddleware({
    target: 'https://poizon-api.com/api/dewu/',
    changeOrigin: true,
});

mongoose
    .connect(`BD_LINK`)
    .then(() => console.log('db is ok'))
    .catch((err) => console.log('err: ' + err));

app.post('/vanopoizon/auth', isValidInitData, userTgAuth);
app.post('/vanopoizon/saveDeliveryData', isValidInitData, saveDeliveryData);

app.post('/vanopoizon/favorite/getProducts', isValidInitData, getFavorites);
app.post('/vanopoizon/favorite/addProduct', isValidInitData, addToFavorites);
app.delete('/vanopoizon/favorite/removeProduct', isValidInitData, removeFromFavorites);

app.post('/admin_dashboard/auth', auth);
app.get('/admin_dashboard/auth/check', checkAuthMiddleware, checkAuth);

app.use('/api', proxyMiddleware);

app.post('/vanopoizon/api/getProducts', getProductsReq)
app.post('/vanopoizon/api/getFilteredProducts', getFilteredProductsReq)
app.post('/vanopoizon/api/getMiniProductList', getMiniProductListReq)
app.post('/vanopoizon/api/getCities', getCitiesReq)
app.post('/vanopoizon/api/getPvzs', getPvzsReq)
app.post('/vanopoizon/api/getProductBySpu', getProductBySpuReq)
app.post('/vanopoizon/api/getSpuByLink', getSpuByLinkReq)

const server = app.listen(3000, '127.0.0.1', () => {
    console.log('Сервер запущен на http://127.0.0.1:3000/');
});
