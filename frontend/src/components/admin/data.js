export  const MOCK_PRODUCTS = [
  { id: 1, name: "Tiramisu Delight", category: "Cakes", price: 320, stock: 12, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&q=80", description: "Classic Italian dessert with layers mascarpone cream", sales: 145 },
  { id: 2, name: "Chocolate Lava Cake", category: "Cakes", price: 280, stock: 8, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=200&q=80", description: "A rich chocolate cake with a molten center", sales: 198 },
  { id: 3, name: "Raspberry Mousse", category: "Mousses", price: 260, stock: 15, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&q=80", description: "A light and airy raspberry-flavored dessert", sales: 89 },
  { id: 4, name: "Vanilla Panna Cotta", category: "Puddings", price: 240, stock: 20, image: "https://images.unsplash.com/photo-1488477304112-4944851de03d?w=200&q=80", description: "A silky Italian dessert made with vanilla-infused cream", sales: 67 },
  { id: 5, name: "Macaron Assortment", category: "Cookies", price: 220, stock: 30, image: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=200&q=80", description: "A selection of delicate, colorful almond-based cookies", sales: 234 },
  { id: 6, name: "Mango Sago Pudding", category: "Puddings", price: 210, stock: 18, image: "https://images.unsplash.com/photo-1488477304112-4944851de03d?w=200&q=80", description: "A refreshing dessert with mango puree and chewy sago pearls", sales: 112 },
  { id: 7, name: "Blueberry Cheesecake", category: "Cakes", price: 340, stock: 6, image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&q=80", description: "A creamy cheesecake topped with blueberry compote", sales: 176 },
  { id: 8, name: "Pistachio Baklava", category: "Pastries", price: 260, stock: 22, image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=200&q=80", description: "A flaky, honey-drenched pastry filled with pistachios", sales: 93 },
];

export  const MOCK_ORDERS = [
  { id: "#ORD-001", customer: "Priya Sharma", email: "priya@email.com", items: 3, total: 860, status: "Delivered", date: "2026-03-28", products: ["Tiramisu Delight", "Macaron Assortment"] },
  { id: "#ORD-002", customer: "Rahul Mehta", email: "rahul@email.com", items: 1, total: 280, status: "Preparing", date: "2026-03-29", products: ["Chocolate Lava Cake"] },
  { id: "#ORD-003", customer: "Ananya Iyer", email: "ananya@email.com", items: 2, total: 500, status: "Pending", date: "2026-03-30", products: ["Raspberry Mousse", "Vanilla Panna Cotta"] },
  { id: "#ORD-004", customer: "Karan Patel", email: "karan@email.com", items: 4, total: 1020, status: "Delivered", date: "2026-03-27", products: ["Blueberry Cheesecake", "Pistachio Baklava"] },
  { id: "#ORD-005", customer: "Sneha Gupta", email: "sneha@email.com", items: 2, total: 470, status: "Cancelled", date: "2026-03-26", products: ["Mango Sago Pudding", "Macaron Assortment"] },
  { id: "#ORD-006", customer: "Vikram Nair", email: "vikram@email.com", items: 1, total: 340, status: "Delivered", date: "2026-03-25", products: ["Blueberry Cheesecake"] },
  { id: "#ORD-007", customer: "Deepa Krishnan", email: "deepa@email.com", items: 3, total: 760, status: "Preparing", date: "2026-03-31", products: ["Tiramisu Delight", "Pistachio Baklava"] },
];

export  const MOCK_USERS = [
  { id: 1, name: "Priya Sharma", email: "priya@email.com", role: "customer", orders: 12, spent: 4320, joined: "2025-06-14", status: "active", avatar: "PS" },
  { id: 2, name: "Rahul Mehta", email: "rahul@email.com", role: "customer", orders: 5, spent: 1400, joined: "2025-09-22", status: "active", avatar: "RM" },
  { id: 3, name: "Ananya Iyer", email: "ananya@email.com", role: "customer", orders: 8, spent: 2760, joined: "2025-11-03", status: "active", avatar: "AI" },
  { id: 4, name: "Karan Patel", email: "karan@email.com", role: "customer", orders: 3, spent: 980, joined: "2026-01-18", status: "blocked", avatar: "KP" },
  { id: 5, name: "Sneha Gupta", email: "sneha@email.com", role: "customer", orders: 15, spent: 5890, joined: "2025-04-07", status: "active", avatar: "SG" },
  { id: 6, name: "Admin User", email: "admin@whiskwhimsy.com", role: "admin", orders: 0, spent: 0, joined: "2024-01-01", status: "active", avatar: "AU" },
];

export  const WEEKLY_REVENUE = [12400, 18600, 15200, 22800, 19400, 28600, 24200];
export  const WEEKLY_ORDERS = [38, 52, 45, 67, 58, 84, 72];
export  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export  const avatarColors = ["#FF8FAB","#D4845A","#A8C5A0","#C9B8E8","#F2A654","#7B4F2E"];
export const getAvatarColor = (str) => avatarColors[str.charCodeAt(0) % avatarColors.length];





