// Seed data created on first run. All users share the password "Aa1234!"
const address = (city, street, houseNumber) => ({
  state: "",
  country: "Israel",
  city,
  street,
  houseNumber,
  zip: 0,
});

const users = [
  {
    name: { first: "Regular", middle: "", last: "User" },
    phone: "050-0000001",
    email: "regular@gmail.com",
    password: "Aa1234!",
    address: address("Tel Aviv", "Magnive", 5),
    isBusiness: false,
    isAdmin: false,
  },
  {
    name: { first: "Business", middle: "", last: "User" },
    phone: "050-0000002",
    email: "business@gmail.com",
    password: "Aa1234!",
    address: address("Haifa", "Herzl", 10),
    isBusiness: true,
    isAdmin: false,
  },
  {
    name: { first: "Admin", middle: "", last: "User" },
    phone: "050-0000003",
    email: "admin@gmail.com",
    password: "Aa1234!",
    address: address("Jerusalem", "Jaffa", 20),
    isBusiness: true,
    isAdmin: true,
  },
];

const cards = [
  {
    title: "Green Coffee",
    subtitle: "Specialty coffee shop",
    description: "Freshly roasted beans and homemade pastries every morning.",
    phone: "050-1111111",
    email: "hello@greencoffee.co.il",
    web: "https://www.greencoffee.co.il",
    address: address("Tel Aviv", "Dizengoff", 100),
  },
  {
    title: "Code Studio",
    subtitle: "Web development agency",
    description: "Websites and web apps built with modern technologies.",
    phone: "050-2222222",
    email: "contact@codestudio.co.il",
    web: "https://www.codestudio.co.il",
    address: address("Haifa", "Herzl", 12),
  },
  {
    title: "Blue Flowers",
    subtitle: "Flower shop",
    description: "Bouquets and arrangements for every occasion.",
    phone: "050-3333333",
    email: "shop@blueflowers.co.il",
    web: "https://www.blueflowers.co.il",
    address: address("Jerusalem", "Ben Yehuda", 7),
  },
];

module.exports = { users, cards };
