import express from 'express'
import User from '../models/userModel.js'
// const Article = require("../models/article");
// import  auth from "../middleware/auth.js";
import { stripe } from "../utils/stripe.js";

const router = express.Router();

router.get("/prices",  async (req, res) => {
const prices = await stripe.prices.list({
apiKey: process.env.STRIPE_SECRET_KEY,
});

return res.json(prices);
});

router.post("/session",async (req, res) => {
// const user = await User.findOne({ email: req.user});
// console.log(req);
const session = await stripe.checkout.sessions.create(
{
mode: "subscription",
payment_method_types: ["card"],
line_items: [
{
price: req.body.priceId,
quantity: 1,
},
],
success_url: "http://localhost:3000/AskQuestion",
cancel_url: "http://localhost:3000/article-plans",
// customer: user.stripeCustomerId,
},
{
apiKey: process.env.STRIPE_SECRET_KEY,
}
);

return res.json(session);
});



export default router;