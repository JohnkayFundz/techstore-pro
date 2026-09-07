import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createOrder } from "../api/orderApi";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";

import "./Checkout.css";
import "./CheckoutPremium.css";