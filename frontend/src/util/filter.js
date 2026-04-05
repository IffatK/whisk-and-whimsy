export const category = [
  { labelName: "Cookies & Biscuits",   for: "Cookies" },
  { labelName: "Cupcakes & Muffins",   for: "Cupcakes" },
  { labelName: "Cakes & Cheesecakes",  for: "Cakes" },
  { labelName: "Doughnuts & Pastries", for: "Pastries" },
  { labelName: "Puddings & Custards",  for: "Puddings" },
  { labelName: "Brownies",             for: "Brownies" },
  { labelName: "Mousses",              for: "Mousses" },
  { labelName: "Tarts",                for: "Tarts" },
];

export const price = [
  { labelName: "Under ₹200",    fn: (p) => parseFloat(p) < 200 },
  { labelName: "₹200 to ₹400", fn: (p) => parseFloat(p) >= 200 && parseFloat(p) <= 400 },
  { labelName: "₹400 to ₹600", fn: (p) => parseFloat(p) > 400 && parseFloat(p) <= 600 },
  { labelName: "Above ₹600",   fn: (p) => parseFloat(p) > 600 },
];