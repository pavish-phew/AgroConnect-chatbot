const { readJson, writeJson } = require('../utils/store');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

const USERS_FILE = 'users.json';
const PRODUCTS_FILE = 'products.json';
const CARTS_FILE = 'carts.json';
const ORDERS_FILE = 'orders.json';

const defaultAdminEmail = 'admin@agroconnect.test';
const defaultAdminPassword = 'password123';

const seedAdmin = async (users) => {
  if (users.some((u) => u.email === defaultAdminEmail)) return users;
  const passwordHash = await bcrypt.hash(defaultAdminPassword, 10);
  const admin = {
    id: uuid(),
    email: defaultAdminEmail,
    passwordHash,
    role: 'admin',
    name: 'Admin',
    createdAt: new Date().toISOString(),
  };
  const updated = [...users, admin];
  await writeJson(USERS_FILE, updated);
  return updated;
};

const getUsers = async () => {
  const users = await readJson(USERS_FILE, []);
  return seedAdmin(users);
};

const saveUsers = (users) => writeJson(USERS_FILE, users);
const getProducts = () => readJson(PRODUCTS_FILE, []);
const saveProducts = (products) => writeJson(PRODUCTS_FILE, products);
const getCarts = () => readJson(CARTS_FILE, []);
const saveCarts = (carts) => writeJson(CARTS_FILE, carts);
const getOrders = () => readJson(ORDERS_FILE, []);
const saveOrders = (orders) => writeJson(ORDERS_FILE, orders);

module.exports = {
  getUsers,
  saveUsers,
  getProducts,
  saveProducts,
  getCarts,
  saveCarts,
  getOrders,
  saveOrders,
};

