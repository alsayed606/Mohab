const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static("public"));

const orders = [];

app.post("/api/order", (req, res) => {
  const order = req.body;
  order.status = "قيد المراجعة";
  order.timestamp = new Date().toISOString();
  orders.push(order);
  console.log("طلب جديد:", order);
  res.json({ message: "تم استلام الطلب", order });
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.post("/api/order/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (orders[id]) {
    orders[id].status = status;
    res.json({ message: "تم تحديث الحالة" });
  } else {
    res.status(404).json({ error: "الطلب غير موجود" });
  }
});

app.listen(3000, () => {
  console.log("السيرفر يعمل على المنفذ 3000");
});
