import express from 'express'
import axios from 'axios';
import axiosRetry from 'axios-retry';
import cors from 'cors';
import { config } from 'dotenv';

config({ path: './src/.env' });

const app = express();

axiosRetry(axios, { retries: 5 });

app.use(express.json());
//app.use(cors());

export const getProductsReq = async (req, res) => {
    try {
        const productsList = await axios.get(`https://poizon-api.com/api/dewu/productDiscountList?pageSize=20&pageNo=${req.body.page}`, {
            headers: {
                'Accept': 'application/json',
                'apikey': 'POIZON_KEY',
            },
        })
            .then((response) => {
                return response.data;
            });

        res.status(200).json({ products: productsList?.data });
    } catch (e) {
        res.status(500).json({ err: 'Ошибка при получении данных: ' + e });
    }
}

export const getFilteredProductsReq = async (req, res) => {
    try {
        const productList = await axios.get(`https://poizon-api.com/api/dewu/searchProducts/v2?limit=20&page=${req.body.page}${req.body.props}`, {
            headers: {
                'Accept': 'application/json',
                'apikey': 'POIZON_KEY',
            },
        })
            .then(response => {
                return response.data.productList
            });

        res.status(200).json({ products: productList });
    } catch (err) {
        res.status(500).json({ err: 'Ошибка при получении данных: ' + err });
    }
}

export const getMiniProductListReq = async (req, res) => {
    try {
        const productList = await axios.get(`https://poizon-api.com/api/dewu/searchProducts/v2?limit=3&page=1&keyword=${req.body.props}`, {
            headers: {
                'Accept': 'application/json',
                'apikey': 'POIZON_KEY',
            },
        })
            .then(response => {
                return response.data.productList
            });

        res.status(200).json({ products: productList });
    } catch (err) {
        res.status(500).json({ err: 'Ошибка при получении данных: ' + err });
    }
}

export const getCitiesReq = async (req, res) => {
    try {
        const token = await axios.post('https://api.cdek.ru/v2/oauth/token?parameters',
            { 'grant_type': 'client_credentials', 'client_id': 'CDEK_ACC', 'client_secret': 'CDEK_KEY' },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
            })
            .then(response => {
                return response.data.access_token
            })

        const secret_token = `Bearer ${token}`

        const cities = await axios.get(`https://api.cdek.ru/v2/location/cities?country_codes=RU,BY&page=${req.body.page}&size=3000`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': secret_token
                },
            })
            .then(response => {
                return response.data;
            })

        res.status(200).json({ cities });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при получении cities: ' + err });
    }
}

export const getPvzsReq = async (req, res) => {
    try {
        const token = await axios.post('https://api.cdek.ru/v2/oauth/token?parameters',
            { 'grant_type': 'client_credentials', 'client_id': 'CDEK_ACC', 'client_secret': 'CDEK_KEY' },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
            })
            .then(response => {
                return response.data.access_token
            })

        const secret_token = `Bearer ${token}`

        const pvzs = await axios.get(`http://api.cdek.ru/v2/deliverypoints?city_code=${req.body.code}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': secret_token
                },
            })
            .then(response => response.data)

        res.status(200).json({ pvzs });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при получении cities: ' + err });
    }
}

export const getProductBySpuReq = async (req, res) => {
    try {
        const productDetailRes = await axios.get(`https://poizon-api.com/api/dewu/productDetail?spuId=${req.body.spu}`, {
            headers: {
                'Accept': 'application/json',
                'apikey': 'POIZON_KEY',
            },
        }).catch(e => console.log('1 ' + e.message))

        const productPriceRes = await axios.get(`https://poizon-api.com/api/dewu/priceInfo?spuId=${req.body.spu}`, {
            headers: {
                'Accept': 'application/json',
                'apikey': 'POIZON_KEY',
            },
        }).catch(e => console.log('2 ' + e.message))

        res.json({
            product: productDetailRes?.data,
            price: productPriceRes?.data,
        });

    } catch (err) {
        res.status(500).json({ err: 'Ошибка при отправки данных: ' + err });
    }
}

export const getSpuByLinkReq = async (req, res) => {
    try {
        const spuIdRes = await axios.get(`https://poizon-api.com/api/dewu/convertLinkToSpuId?link=${encodeURIComponent(req.body.link)}`, {
            headers: {
                'Accept': 'application/json',
                'apikey': 'POIZON_KEY',
            },
        })

        res.json({
            spuId: spuIdRes?.data.spuId,
        });
    } catch (err) {
        res.status(500).json({ err: 'Ошибка при отправки данных: ' + err });
    }
}
