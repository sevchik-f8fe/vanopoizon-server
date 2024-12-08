import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import cors from 'cors';
import { config } from 'dotenv';
import mongoose from "mongoose";
import crypto from "crypto"

import { getProductsReq, getFilteredProductsReq, getMiniProductListReq, getCitiesReq, getPvzsReq, getProductBySpuReq, getSpuByLinkReq } from "./apiRequests.js";

config({ path: './.env' });
const app = express();

axiosRetry(axios, { retries: 5 });
app.use(express.json());
app.use(cors('https://sevchik-f8fe.github.io/vanopoizon/'));

const proxyMiddleware = createProxyMiddleware({
    target: 'https://poizon-api.com/api/dewu/',
    changeOrigin: true,
});

mongoose
    .connect(`mongodb+srv://${process.env.BD_TOKEN}@admin.qiupu.mongodb.net/?retryWrites=true&w=majority&appName=admin`)
    .then(() => console.log('db is ok'))
    .catch((err) => console.log('err: ' + err));

function hmacSHA256(data, key) {
    return crypto.createHmac('sha256', key).update(data).digest('hex');
}

const isTgUser = (req, res, next) => {
    console.log('start');
    let secret_key = hmacSHA256(process.env.TG_TOKEN, req.body.tg.initData);

    if (hmacSHA256(req.body.tg.initData, secret_key) == req.body.tg.initDataUnsafe.hash) {
        req.body.access = 'ok';
        next();
    } else {
        req.body.access = 'no';
        next();
    }

}

app.post('/vanopoizon/auth', isTgUser, async (req, res) => {
    console.log(req.body.access);

    res.json({ access: req.body.access });
})

app.use('/api', proxyMiddleware);
app.post('/vanopoizon/api/getProducts', getProductsReq)
app.post('/vanopoizon/api/getFilteredProducts', getFilteredProductsReq)
app.post('/vanopoizon/api/getMiniProductList', getMiniProductListReq)
app.get('/vanopoizon/api/getCities', getCitiesReq)
app.post('/vanopoizon/api/getPvzs', getPvzsReq)
app.post('/vanopoizon/api/getProductBySpu', getProductBySpuReq)
app.post('/vanopoizon/api/getSpuByLink', getSpuByLinkReq)

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server OK! on port ${PORT}`);
});