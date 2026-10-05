import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// In-memory store for demo purposes
const orders = new Map();

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Sajjad Imran Catering backend is running.",
  });
});

app.post("/api/create-order", (req, res) => {
  const { item, amount, customerName } = req.body;

  if (!item || !amount) {
    return res.status(400).json({
      success: false,
      message: "Item and amount are required.",
    });
  }

  const orderId = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const order = {
    orderId,
    item,
    amount,
    customerName: customerName || "Customer",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  orders.set(orderId, order);

  return res.json({
    success: true,
    order,
  });
});

app.post("/api/complete-order", (req, res) => {
  const { orderId, paymentId, txid } = req.body;

  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: "orderId is required.",
    });
  }

  const order = orders.get(orderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  order.status = "completed";
  order.paymentId = paymentId || null;
  order.txid = txid || null;

  orders.set(orderId, order);

  return res.json({
    success: true,
    message: "Order marked as completed.",
    order,
  });
});

async function verifyPiPayment(paymentId) {
  // TODO: Replace with official Pi server verification logic
  return {
    success: true,
    paymentId,
    status: "approved",
  };
}

app.post("/api/verify-payment", async (req, res) => {
  const { paymentId, orderId } = req.body;

  if (!paymentId || !orderId) {
    return res.status(400).json({
      success: false,
      message: "paymentId and orderId are required.",
    });
  }

  try {
    const verification = await verifyPiPayment(paymentId);

    const order = orders.get(orderId);
    if (order) {
      order.status = verification.success ? "verified" : "failed";
    }

    return res.json({
      success: verification.success,
      verification,
      orderId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Payment verification failed.",
      error: error.message,
    });
  }
});

// Catch-all for frontend routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Sajjad Imran Catering server running on http://localhost:${PORT}`);
});
