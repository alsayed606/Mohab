const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static("public"));

// Firebase Admin
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const ordersRef = db.collection("orders");

// استقبال الطلب
app.post("/api/order", async (req, res) => {
  const order = req.body;
  order.status = "قيد المراجعة";
  order.timestamp = new Date().toISOString();

  try {
    const docRef = await ordersRef.add(order);
    res.json({ message: "تم استلام الطلب", id: docRef.id });
  } catch (error) {
    console.error("خطأ في الإضافة إلى Firestore:", error);
    res.status(500).json({ error: "فشل تسجيل الطلب" });
  }
});

// عرض كل الطلبات
app.get("/api/orders", async (req, res) => {
  try {
    const snapshot = await ordersRef.orderBy("timestamp", "desc").get();
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    res.json(orders);
  } catch (error) {
    console.error("فشل جلب الطلبات:", error);
    res.status(500).json({ error: "تعذر جلب الطلبات" });
  }
});

// تغيير الحالة
app.post("/api/order/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await ordersRef.doc(id).update({ status });
    res.json({ message: "تم تحديث الحالة" });
  } catch (error) {
    res.status(500).json({ error: "فشل تحديث الحالة" });
  }
});

app.listen(3000, () => {
  console.log("السيرفر يعمل على المنفذ 3000");
});
