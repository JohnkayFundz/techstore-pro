import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FiCheckCircle,
  FiXCircle,
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiArrowRight,
  FiShoppingBag,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";

import { getOrderById } from "../api/orderApi";

import "./OrderSuccess.css";
import "./OrderSuccessPremium.css";
