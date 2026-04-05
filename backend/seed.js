
  import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();
const pool = new Pool({
  connectionString: "postgresql://postgres:whiskandwhimsy@123@db.eniriyzmymueytrxadps.supabase.co:5432/postgres",
  ssl: {
    rejectUnauthorized: false
  }
});
const products = [
    {
      "id": 1,
      "slug": "tiramisu-delight",
      "name": "Tiramisu Delight",
      "subtitle": "Classic Italian dessert with layers mascarpone cream",
      "category": "Cakes & Cheesecakes",
      "price": 320,
      "image": "../src/images/img-1.jpg",
      "description": "This traditional Italian dessert features layers of espresso-soaked ladyfingers, mascarpone cheese, and a dusting of cocoa powder. Light, creamy, and rich in flavor.",
      "ingredients": [
        "Mascarpone cheese",
        "Ladyfingers",
        "Espresso",
        "Cocoa powder",
        "Sugar",
        "Egg yolks"
      ],
      "nutrition": {
        "calories": 320,
        "fat": "20g",
        "carbs": "30g",
        "protein": "5g"
      },
      "availability": "In Stock",
      "rating": 4.6,
      "reviews": [
        "Absolutely delicious and authentic!",
        "Tastes just like the ones I had in Italy."
      ],
      "servingSize": "1 slice",
      "preparationTime": "6 hours (including chilling)",
      "stock": 12,
      "createdAt": "2026-03-31T14:04:23.670Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 2,
      "slug": "chocolate-lava-cake",
      "name": "Chocolate Lava Cake",
      "subtitle": "A rich chocolate cake with a molten center",
      "category": "Cakes & Cheesecakes",
      "price": 280,
      "image": "../src/images/img-2.jpg",
      "description": "Decadent chocolate cake with a gooey molten center, best served warm. A favorite for chocolate lovers looking for a rich, indulgent dessert.",
      "ingredients": [
        "Dark chocolate",
        "Butter",
        "Eggs",
        "Flour",
        "Sugar"
      ],
      "nutrition": {
        "calories": 420,
        "fat": "28g",
        "carbs": "36g",
        "protein": "6g"
      },
      "availability": "In Stock",
      "rating": 4.9,
      "reviews": [
        "Heaven in every bite!",
        "Perfectly gooey center. A must-try!"
      ],
      "servingSize": "1 cake",
      "preparationTime": "20 minutes",
      "stock": 13,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 3,
      "slug": "raspberry-mousse",
      "name": "Raspberry Mousse",
      "subtitle": "A light and airy raspberry-flavored dessert with a creamy texture",
      "category": "Puddings & Custards",
      "price": 260,
      "image": "../src/images/img-3.jpg",
      "description": "This elegant dessert offers a burst of raspberry flavor in a smooth and fluffy mousse. Ideal for warm days or as a light finish to any meal.",
      "ingredients": [
        "Fresh raspberries",
        "Whipped cream",
        "Gelatin",
        "Sugar",
        "Lemon juice"
      ],
      "nutrition": {
        "calories": 650,
        "fat": "12g",
        "carbs": "29g",
        "protein": "3g"
      },
      "availability": "Limited Stock",
      "rating": 4.6,
      "reviews": [
        "Refreshing and just the right amount of sweet.",
        "Beautiful presentation and taste."
      ],
      "servingSize": "1 cup",
      "preparationTime": "3 hours (includes setting time)",
      "stock": 8,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 4,
      "slug": "vanilla-panna-cotta",
      "name": "Vanilla Panna Cotta",
      "subtitle": "A silky Italian dessert made with vanilla-infused cream",
      "category": "Puddings & Custards",
      "price": 240,
      "image": "../src/images/img-4.jpg",
      "description": "Smooth and creamy, this vanilla panna cotta melts in your mouth with each spoonful. It's the perfect balance of sweetness and elegance.",
      "ingredients": [
        "Heavy cream",
        "Vanilla extract",
        "Sugar",
        "Gelatin",
        "Milk"
      ],
      "nutrition": {
        "calories": 280,
        "fat": "18g",
        "carbs": "24g",
        "protein": "4g"
      },
      "availability": "In Stock",
      "rating": 4.5,
      "reviews": [
        "Creamy and comforting dessert.",
        "Loved the vanilla flavor!"
      ],
      "servingSize": "1 cup",
      "preparationTime": "4 hours (including chilling)",
      "stock": 15,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 5,
      "slug": "macaron-assortment",
      "name": "Macaron Assortment",
      "subtitle": "A selection of delicate, colorful almond-based cookies",
      "category": "Cookies & Biscuits",
      "price": 220,
      "image": "../src/images/img-5.jpg",
      "description": "These Parisian-style macarons come in assorted flavors and colors, offering a delightful crisp shell with a chewy center.",
      "ingredients": [
        "Almond flour",
        "Egg whites",
        "Powdered sugar",
        "Granulated sugar",
        "Food coloring",
        "Buttercream filling"
      ],
      "nutrition": {
        "calories": 150,
        "fat": "8g",
        "carbs": "17g",
        "protein": "2g"
      },
      "availability": "In Stock",
      "rating": 4.7,
      "reviews": [
        "A feast for the eyes and taste buds!",
        "Perfect texture and flavor variety."
      ],
      "servingSize": "3 macarons",
      "preparationTime": "2 hours",
      "stock": 16,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 6,
      "slug": "mango-sago-pudding",
      "name": "Mango Sago Pudding",
      "subtitle": "A refreshing dessert with mango puree and chewy sago pearls",
      "category": "Puddings & Custards",
      "price": 210,
      "image": "../src/images/img-6.jpg",
      "description": "A tropical treat made with ripe mangoes and soft sago pearls in a creamy coconut milk base. Chilled and refreshing.",
      "ingredients": [
        "Mango puree",
        "Sago pearls",
        "Coconut milk",
        "Sugar",
        "Milk"
      ],
      "nutrition": {
        "calories": 290,
        "fat": "10g",
        "carbs": "45g",
        "protein": "3g"
      },
      "availability": "Limited Stock",
      "rating": 4.4,
      "reviews": [
        "Perfect summer dessert!",
        "Creamy, fruity, and light."
      ],
      "servingSize": "1 bowl",
      "preparationTime": "2 hours (includes chilling)",
      "stock": 6,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 7,
      "slug": "blueberry-cheesecake",
      "name": "Blueberry Cheesecake",
      "subtitle": "A creamy cheesecake topped with blueberry compote",
      "category": "Cakes & Cheesecakes",
      "price": 340,
      "image": "../src/images/img-7.jpg",
      "description": "Classic New York-style cheesecake with a smooth texture, topped generously with tangy blueberry compote.",
      "ingredients": [
        "Cream cheese",
        "Blueberries",
        "Graham crackers",
        "Sugar",
        "Eggs",
        "Butter"
      ],
      "nutrition": {
        "calories": 410,
        "fat": "26g",
        "carbs": "34g",
        "protein": "6g"
      },
      "availability": "In Stock",
      "rating": 4.8,
      "reviews": [
        "Rich and creamy, just the way I like it.",
        "The blueberry topping is delicious!"
      ],
      "servingSize": "1 slice",
      "preparationTime": "5 hours (including baking and chilling)",
      "stock": 18,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 8,
      "slug": "pistachio-baklava",
      "name": "Pistachio Baklava",
      "subtitle": "A flaky, honey-drenched pastry filled with pistachios",
      "category": "Doughnuts & Pastries",
      "price": 260,
      "image": "../src/images/img-8.jpg",
      "description": "A Middle Eastern delight made with layers of filo pastry, crushed pistachios, and sweetened with aromatic honey syrup.",
      "ingredients": [
        "Filo dough",
        "Pistachios",
        "Honey",
        "Butter",
        "Sugar",
        "Cinnamon"
      ],
      "nutrition": {
        "calories": 320,
        "fat": "18g",
        "carbs": "35g",
        "protein": "4g"
      },
      "availability": "In Stock",
      "rating": 4.7,
      "reviews": [
        "Crispy and sweet, just perfect!",
        "Authentic and full of flavor."
      ],
      "servingSize": "2 pieces",
      "preparationTime": "3 hours",
      "stock": 12,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 9,
      "slug": "chocolate-chip-cookies",
      "name": "Chocolate Chip Cookies",
      "subtitle": "Classic cookies with rich chocolate chips",
      "category": "Cookies & Biscuits",
      "price": 180,
      "image": "../src/images/img-9.jpg",
      "description": "Golden brown cookies baked with generous amounts of semi-sweet chocolate chips. Crisp edges with a chewy center.",
      "ingredients": [
        "Flour",
        "Butter",
        "Sugar",
        "Brown sugar",
        "Eggs",
        "Chocolate chips",
        "Vanilla extract"
      ],
      "nutrition": {
        "calories": 220,
        "fat": "11g",
        "carbs": "28g",
        "protein": "2g"
      },
      "availability": "In Stock",
      "rating": 4.5,
      "reviews": [
        "Soft in the middle, crunchy outside. Perfect combo.",
        "Tastes homemade and fresh."
      ],
      "servingSize": "2 cookies",
      "preparationTime": "30 minutes",
      "stock": 13,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 10,
      "slug": "red-velvet-cupcakes",
      "name": "Red Velvet Cupcakes",
      "subtitle": "Soft red velvet cupcakes with cream cheese frosting",
      "category": "Cupcakes & Muffins",
      "price": 220,
      "image": "../src/images/img-10.jpg",
      "description": "Moist and fluffy red velvet cupcakes topped with a rich and tangy cream cheese frosting.",
      "ingredients": [
        "All-purpose flour",
        "Cocoa powder",
        "Buttermilk",
        "Butter",
        "Eggs",
        "Red food coloring",
        "Cream cheese"
      ],
      "nutrition": {
        "calories": 290,
        "fat": "16g",
        "carbs": "34g",
        "protein": "3g"
      },
      "availability": "In Stock",
      "rating": 4.8,
      "reviews": [
        "Super soft and tasty!",
        "That frosting is heavenly."
      ],
      "servingSize": "1 cupcake",
      "preparationTime": "45 minutes",
      "stock": 14,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 11,
      "slug": "strawberry-shortcake",
      "name": "Strawberry Shortcake",
      "subtitle": "Delicious shortcake layered with fresh strawberries and cream",
      "category": "Cakes & Cheesecakes",
      "price": 300,
      "image": "../src/images/img-11.jpg",
      "description": "Fluffy shortcake layered with sweet cream and juicy strawberries.",
      "ingredients": [
        "Shortcake biscuits",
        "Fresh strawberries",
        "Whipped cream",
        "Sugar",
        "Vanilla extract"
      ],
      "nutrition": {
        "calories": 280,
        "fat": "14g",
        "carbs": "32g",
        "protein": "4g"
      },
      "availability": "In Stock",
      "rating": 4.7,
      "reviews": [
        "Perfect summer dessert!",
        "Light and not overly sweet."
      ],
      "servingSize": "1 slice",
      "preparationTime": "1 hour",
      "stock": 15,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 12,
      "slug": "donut-holes",
      "name": "Donut Holes",
      "subtitle": "Soft and fluffy donut holes coated with powdered sugar",
      "category": "Doughnuts & Pastries",
      "price": 160,
      "image": "../src/images/img-12.jpg",
      "description": "Mini deep-fried balls of dough coated generously in powdered sugar.",
      "ingredients": [
        "Flour",
        "Yeast",
        "Milk",
        "Butter",
        "Eggs",
        "Powdered sugar"
      ],
      "nutrition": {
        "calories": 180,
        "fat": "9g",
        "carbs": "22g",
        "protein": "2g"
      },
      "availability": "In Stock",
      "rating": 4.3,
      "reviews": [
        "Poppable and addictive!",
        "Loved the sugar dusting."
      ],
      "servingSize": "6 pieces",
      "preparationTime": "1 hour",
      "stock": 16,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 13,
      "slug": "lemon-meringue-pie",
      "name": "Lemon Meringue Pie",
      "subtitle": "A tangy lemon filling topped with fluffy meringue",
      "category": "Cakes & Cheesecakes",
      "price": 290,
      "image": "../src/images/img-13.jpg",
      "description": "Zesty lemon custard encased in a buttery crust and crowned with airy meringue that's lightly toasted.",
      "ingredients": [
        "Lemon juice",
        "Eggs",
        "Sugar",
        "Cornstarch",
        "Pie crust",
        "Egg whites"
      ],
      "nutrition": {
        "calories": 350,
        "fat": "14g",
        "carbs": "50g",
        "protein": "4g"
      },
      "availability": "Limited Stock",
      "rating": 4.6,
      "reviews": [
        "So tangy and smooth!",
        "The meringue was perfectly toasted."
      ],
      "servingSize": "1 slice",
      "preparationTime": "1.5 hours",
      "stock": 8,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 14,
      "slug": "carrot-cake",
      "name": "Carrot Cake",
      "subtitle": "A spiced cake filled with grated carrots and topped with cream cheese frosting",
      "category": "Cakes & Cheesecakes",
      "price": 270,
      "image": "../src/images/img-14.jpg",
      "description": "Moist and warmly spiced carrot cake loaded with grated carrots and nuts, topped with thick cream cheese frosting.",
      "ingredients": [
        "Grated carrots",
        "Cinnamon",
        "Nutmeg",
        "Walnuts",
        "All-purpose flour",
        "Eggs",
        "Cream cheese"
      ],
      "nutrition": {
        "calories": 380,
        "fat": "22g",
        "carbs": "40g",
        "protein": "5g"
      },
      "availability": "In Stock",
      "rating": 4.5,
      "reviews": [
        "Soft and flavorful!",
        "Perfect amount of spice and sweetness."
      ],
      "servingSize": "1 slice",
      "preparationTime": "1.5 hours",
      "stock": 18,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 15,
      "slug": "chocolate-truffles",
      "name": "Chocolate Truffles",
      "subtitle": "Rich chocolate ganache coated in cocoa powder",
      "category": "Chocolates & Truffles",
      "price": 210,
      "image": "../src/images/img-15.jpg",
      "description": "Decadent bite-sized chocolate truffles with a silky ganache center rolled in rich cocoa powder.",
      "ingredients": [
        "Dark chocolate",
        "Heavy cream",
        "Butter",
        "Cocoa powder"
      ],
      "nutrition": {
        "calories": 90,
        "fat": "7g",
        "carbs": "6g",
        "protein": "1g"
      },
      "availability": "In Stock",
      "rating": 4.9,
      "reviews": [
        "Melt-in-the-mouth perfection.",
        "Loved the dark chocolate flavor."
      ],
      "servingSize": "3 pieces",
      "preparationTime": "2 hours (includes chilling)",
      "stock": 12,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 16,
      "slug": "fruit-tart",
      "name": "Fruit Tart",
      "subtitle": "A buttery tart shell filled with pastry cream and topped with fresh fruits",
      "category": "Cakes & Cheesecakes",
      "price": 310,
      "image": "../src/images/img-16.jpg",
      "description": "A crisp pastry shell filled with smooth vanilla pastry cream and topped with colorful fresh fruits.",
      "ingredients": [
        "Tart shell",
        "Pastry cream",
        "Strawberries",
        "Kiwi",
        "Blueberries",
        "Apricot glaze"
      ],
      "nutrition": {
        "calories": 300,
        "fat": "15g",
        "carbs": "35g",
        "protein": "3g"
      },
      "availability": "In Stock",
      "rating": 4.7,
      "reviews": [
        "Looks and tastes amazing!",
        "Perfect for a dinner party dessert."
      ],
      "servingSize": "1 slice",
      "preparationTime": "2.5 hours",
      "stock": 13,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 17,
      "slug": "pineapple-upside-down-cake",
      "name": "Pineapple Upside-Down Cake",
      "subtitle": "A caramelized pineapple topping on a moist cake",
      "category": "Cakes & Cheesecakes",
      "price": 260,
      "image": "../src/images/img-17.jpg",
      "description": "Caramelized pineapple slices baked into a soft vanilla cake creating a sweet and nostalgic dessert.",
      "ingredients": [
        "Pineapple rings",
        "Brown sugar",
        "Butter",
        "Vanilla cake batter",
        "Cherries"
      ],
      "nutrition": {
        "calories": 340,
        "fat": "16g",
        "carbs": "45g",
        "protein": "4g"
      },
      "availability": "In Stock",
      "rating": 4.4,
      "reviews": [
        "Just like grandma used to make!",
        "Love the caramelized top."
      ],
      "servingSize": "1 slice",
      "preparationTime": "1 hour",
      "stock": 14,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 18,
      "slug": "churros",
      "name": "Churros",
      "subtitle": "Crispy fried dough sticks coated in cinnamon sugar",
      "category": "Doughnuts & Pastries",
      "price": 190,
      "image": "../src/images/img-18.jpg",
      "description": "Golden crispy churros coated in cinnamon sugar and perfect when dipped in chocolate sauce.",
      "ingredients": [
        "All-purpose flour",
        "Butter",
        "Eggs",
        "Sugar",
        "Cinnamon"
      ],
      "nutrition": {
        "calories": 260,
        "fat": "12g",
        "carbs": "34g",
        "protein": "4g"
      },
      "availability": "In Stock",
      "rating": 4.7,
      "reviews": [
        "Crispy and sweet—perfect snack!",
        "Best when dipped in warm chocolate."
      ],
      "servingSize": "5 sticks",
      "preparationTime": "30 minutes",
      "stock": 15,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 19,
      "slug": "peach-cobbler",
      "name": "Peach Cobbler",
      "subtitle": "Sweet peaches topped with a biscuit crust",
      "category": "Puddings & Custards",
      "price": 240,
      "image": "../src/images/img-19.jpg",
      "description": "Warm peach cobbler with juicy peaches and golden biscuit topping.",
      "ingredients": [
        "Peaches",
        "Flour",
        "Butter",
        "Sugar",
        "Baking powder",
        "Cinnamon"
      ],
      "nutrition": {
        "calories": 310,
        "fat": "14g",
        "carbs": "40g",
        "protein": "3g"
      },
      "availability": "Limited Stock",
      "rating": 4.5,
      "reviews": [
        "Warm and cozy flavor!",
        "A perfect southern-style dessert."
      ],
      "servingSize": "1 bowl",
      "preparationTime": "45 minutes",
      "stock": 9,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 20,
      "slug": "ice-cream-sandwiches",
      "name": "Ice Cream Sandwiches",
      "subtitle": "A scoop of ice cream between two cookies",
      "category": "Ice Cream & Sorbets",
      "price": 170,
      "image": "../src/images/img-20.jpg",
      "description": "Creamy vanilla ice cream sandwiched between two chewy chocolate chip cookies.",
      "ingredients": [
        "Vanilla ice cream",
        "Chocolate chip cookies",
        "Milk",
        "Sugar"
      ],
      "nutrition": {
        "calories": 290,
        "fat": "15g",
        "carbs": "34g",
        "protein": "4g"
      },
      "availability": "In Stock",
      "rating": 4.6,
      "reviews": [
        "Kids loved it!",
        "Soft cookies and creamy ice cream combo is a win."
      ],
      "servingSize": "1 sandwich",
      "preparationTime": "15 minutes",
      "stock": 17,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 21,
      "slug": "chocolate-eclairs",
      "name": "Chocolate Eclairs",
      "subtitle": "Flaky pastry filled with chocolate cream",
      "category": "Doughnuts & Pastries",
      "price": 230,
      "image": "../src/images/img-21.jpg",
      "description": "Classic French choux pastry filled with chocolate custard and topped with chocolate glaze.",
      "ingredients": [
        "Choux pastry",
        "Chocolate custard",
        "Chocolate glaze",
        "Butter",
        "Eggs"
      ],
      "nutrition": {
        "calories": 340,
        "fat": "19g",
        "carbs": "35g",
        "protein": "5g"
      },
      "availability": "In Stock",
      "rating": 4.8,
      "reviews": [
        "Elegant and delicious!",
        "The cream filling is heavenly."
      ],
      "servingSize": "1 éclair",
      "preparationTime": "1.5 hours",
      "stock": 18,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 22,
      "slug": "coconut-macaroons",
      "name": "Coconut Macaroons",
      "subtitle": "Chewy coconut cookies dipped in chocolate",
      "category": "Cookies & Biscuits",
      "price": 180,
      "image": "../src/images/img-22.jpg",
      "description": "Chewy coconut macaroons lightly dipped in dark chocolate for a rich tropical treat.",
      "ingredients": [
        "Shredded coconut",
        "Sweetened condensed milk",
        "Vanilla extract",
        "Egg whites",
        "Dark chocolate"
      ],
      "nutrition": {
        "calories": 180,
        "fat": "10g",
        "carbs": "20g",
        "protein": "2g"
      },
      "availability": "In Stock",
      "rating": 4.4,
      "reviews": [
        "Perfectly chewy and coconutty!",
        "The chocolate dip is a great touch."
      ],
      "servingSize": "2 pieces",
      "preparationTime": "30 minutes",
      "stock": 12,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 23,
      "slug": "mango-cheesecake",
      "name": "Mango Cheesecake",
      "subtitle": "A creamy cheesecake topped with mango puree",
      "category": "Cakes & Cheesecakes",
      "price": 320,
      "image": "../src/images/img-23.jpg",
      "description": "Smooth creamy cheesecake layered with sweet mango puree.",
      "ingredients": [
        "Cream cheese",
        "Mango puree",
        "Digestive biscuits",
        "Butter",
        "Sugar",
        "Gelatin"
      ],
      "nutrition": {
        "calories": 340,
        "fat": "22g",
        "carbs": "30g",
        "protein": "5g"
      },
      "availability": "In Stock",
      "rating": 4.7,
      "reviews": [
        "Best cheesecake I’ve had in a while!",
        "Not overly sweet—just perfect."
      ],
      "servingSize": "1 slice",
      "preparationTime": "4 hours (includes chilling)",
      "stock": 13,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 24,
      "slug": "choco-lava-cupcakes",
      "name": "Choco Lava Cupcakes",
      "subtitle": "Cupcakes filled with molten chocolate center",
      "category": "Cupcakes & Muffins",
      "price": 240,
      "image": "../src/images/img-24.jpg",
      "description": "Soft chocolate cupcakes with a gooey molten chocolate center.",
      "ingredients": [
        "Dark chocolate",
        "All-purpose flour",
        "Eggs",
        "Butter",
        "Baking powder",
        "Sugar"
      ],
      "nutrition": {
        "calories": 360,
        "fat": "21g",
        "carbs": "38g",
        "protein": "6g"
      },
      "availability": "In Stock",
      "rating": 4.9,
      "reviews": [
        "Ooey gooey and chocolaty!",
        "Surprise inside made it so fun!"
      ],
      "servingSize": "1 cupcake",
      "preparationTime": "25 minutes",
      "stock": 14,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    },
    {
      "id": 25,
      "slug": "nutella-doughnuts",
      "name": "Nutella Doughnuts",
      "subtitle": "Soft doughnuts filled with Nutella chocolate spread",
      "category": "Doughnuts & Pastries",
      "price": 260,
      "image": "../src/images/img-25.jpg",
      "description": "Fluffy golden doughnuts filled generously with creamy Nutella.",
      "ingredients": [
        "All-purpose flour",
        "Yeast",
        "Milk",
        "Butter",
        "Eggs",
        "Nutella"
      ],
      "nutrition": {
        "calories": 390,
        "fat": "22g",
        "carbs": "40g",
        "protein": "5g"
      },
      "availability": "In Stock",
      "rating": 4.8,
      "reviews": [
        "Nutella makes everything better!",
        "Soft, fresh, and so satisfying."
      ],
      "servingSize": "1 doughnut",
      "preparationTime": "2 hours (includes proofing)",
      "stock": 15,
      "createdAt": "2026-03-31T14:04:23.671Z",
      "updatedAt": "2026-03-31T14:04:23.671Z"
    }
  ]

async function seed() {
  for (let p of products) {
    await pool.query(
      `INSERT INTO product 
      (product_name, category, price, stock_quantity, description, is_available)
      VALUES ($1,$2,$3,$4,$5,true)`,
      [
        p.name,
        p.category,
        p.price,
        p.stock,
        p.description,
       
      ]
    );
  }

  console.log("Seed complete");
}

seed();
