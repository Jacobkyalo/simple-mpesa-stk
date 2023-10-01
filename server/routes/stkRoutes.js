import axios from "axios";
import express from "express";
const router = express.Router();
let token;

const generateToken = async (req, res, next) => {
  const auth = new Buffer.from(
    `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
  ).toString("base64");

  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    );

    console.log(response);
    token = response.data.access_token;

    next();
  } catch (error) {
    res.status(200).json(error.message);
  }
};

const handleStkPush = async (req, res) => {
  const phone = req.body.phone;
  const amount = req.body.amount;

  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + date.getMonth() + 1).slice("-2") +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  const password = new Buffer.from(
    process.env.MPESA_SHORT_CODE + process.env.MPESA_PASS_KEY + timestamp
  ).toString("base64");

  try {
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: `254${phone}`,
        PartyB: process.env.MPESA_SHORT_CODE,
        PhoneNumber: `254${phone}`,
        CallBackURL: "https://mydomain.com/pat",
        AccountReference: "Jacob Kyalo",
        TransactionDesc: "Test",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(200).json(error.message);
  }
};

router.post("/stk", generateToken, handleStkPush);

export default router;
