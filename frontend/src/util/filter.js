export const category = [
  { for: "Cookies & Biscuits", labelName: "Cookies & Biscuits" },
  { for: "Cupcakes & Muffins", labelName: "Cupcakes & Muffins" },
  { for: "Cakes & Cheesecakes", labelName: "Cakes & Cheesecakes" },
  { for: "Doughnuts & Pastries", labelName: "Doughnuts & Pastries" },
  { for: "Puddings & Custards", labelName: "Puddings & Custards" },
  { for: "Chocolates & Truffles", labelName: "Chocolates & Truffles" },
];
export const price = [
  { for: (price) => price > 10 && price <= 50, labelName: "$10 to $50" },
  { for: (price) => price > 50 && price <= 150, labelName: "$50 to $150" },
  { for: (price) => price > 150, labelName: "$150 +" },
];
