import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import mongoose from "mongoose";

import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import mongoose from "mongoose";

import { getCartBySpu, getProductsReq, getFilteredProductsReq, getMiniProductListReq, getCitiesReq, getPvzsReq, getProductBySpuReq, getSpuByLinkReq } from "./apiRequests.js"
import { checkAuthMiddleware, auth } from "./adminAuthControllers.js";
import { isValidInitData, userTgAuth, saveDeliveryData } from "./tgUserControllers.js";
import { addToFavorites, removeFromFavorites } from "./favoriteControllers.js";
import { addToCart, removeFromCart } from "./cartControllers.js";
import { getArticles, addArticle, removeArticle } from "./articleControllers.js";

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

app.post('/vanopoizon/addToFavorites', isValidInitData, addToFavorites);
app.post('/vanopoizon/removeFromFavorites', isValidInitData, removeFromFavorites);

app.post('/vanopoizon/removeFromCart', isValidInitData, removeFromCart);
app.post('/vanopoizon/addToCart', isValidInitData, addToCart);

app.post('/admin_dashboard/auth', auth);
app.get('/admin_dashboard/getArticles', getArticles);
app.post('/admin_dashboard/addArticle', checkAuthMiddleware, addArticle);
app.post('/admin_dashboard/removeArticle', checkAuthMiddleware, removeArticle);

app.use('/api', proxyMiddleware);

app.post('/vanopoizon/api/getProducts', getProductsReq)
app.post('/vanopoizon/api/getFilteredProducts', getFilteredProductsReq)
app.post('/vanopoizon/api/getMiniProductList', getMiniProductListReq)
app.post('/vanopoizon/api/getCities', getCitiesReq)
app.post('/vanopoizon/api/getPvzs', getPvzsReq)
app.post('/vanopoizon/api/getProductBySpu', getProductBySpuReq)
app.post('/vanopoizon/api/getSpuByLink', getSpuByLinkReq)
app.post('/vanopoizon/api/getCartBySpuIds', getCartBySpu)

const server = app.listen(3000, '127.0.0.1', () => {
    console.log('server is ok');
});