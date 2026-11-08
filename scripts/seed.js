const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Vanilla Bites luxury culinary database...');

  // Clean old data if any
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.couponRedemption.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.foodCustomizationOption.deleteMany();
  await prisma.foodCustomizationGroup.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.deliveryStaff.deleteMany();
  await prisma.restaurantMember.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  const hashedPw = await bcrypt.hash('password123', 10);
  const adminPw = await bcrypt.hash('admin123', 10);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'Aria Vance (Admin)',
      email: 'admin@vanillabites.com',
      passwordHash: adminPw,
      role: 'ADMIN',
      phone: '+91 98765 00001',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
      emailVerified: true,
    },
  });

  const chefMarcus = await prisma.user.create({
    data: {
      name: 'Chef Marcus Delacroix',
      email: 'chef.marcus@vanillabites.com',
      passwordHash: hashedPw,
      role: 'RESTAURANT_OWNER',
      phone: '+91 98765 00002',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200&fit=crop',
      emailVerified: true,
    },
  });

  const isabella = await prisma.user.create({
    data: {
      name: 'Isabella Rossi',
      email: 'isabella@vanillabites.com',
      passwordHash: hashedPw,
      role: 'RESTAURANT_OWNER',
      phone: '+91 98765 00003',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
      emailVerified: true,
    },
  });

  const customerSophia = await prisma.user.create({
    data: {
      name: 'Sophia Montgomery',
      email: 'sophia@example.com',
      passwordHash: hashedPw,
      role: 'CUSTOMER',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      emailVerified: true,
      addresses: {
        create: [
          {
            label: 'Penthouse (Home)',
            street: '702, The Heritage Boulevard',
            area: 'Indiranagar 100ft Road',
            city: 'Bengaluru',
            pincode: '560038',
            landmark: 'Opposite Cinnamon Oak Club',
            instructions: 'Call on arrival, leave at reception concierge.',
            isDefault: true,
          },
          {
            label: 'Design Studio',
            street: 'Suite 4B, Apex Creative Tower',
            area: 'Koramangala 4th Block',
            city: 'Bengaluru',
            pincode: '560034',
            landmark: 'Near Sony World Signal',
            instructions: 'Deliver to 4th floor reception.',
            isDefault: false,
          },
        ],
      },
    },
  });

  // 2. Categories
  const catBurgers = await prisma.category.create({
    data: {
      name: 'Gourmet Burgers',
      slug: 'burgers',
      description: 'Artisanal brioche, dry-aged cuts & handcrafted glaze patties',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
      icon: 'sandwich',
      order: 1,
    },
  });

  const catDesserts = await prisma.category.create({
    data: {
      name: 'Artisan Pâtisserie',
      slug: 'desserts',
      description: 'Bourbon vanilla tarts, mille-feuille & velvety chocolate ganache',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=400&fit=crop',
      icon: 'cake',
      order: 2,
    },
  });

  const catItalian = await prisma.category.create({
    data: {
      name: 'Wood-Fired Pizza',
      slug: 'italian',
      description: '48hr fermented Neapolitan sourdough crusts & buffalo fior di latte',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop',
      icon: 'pizza',
      order: 3,
    },
  });

  const catAsian = await prisma.category.create({
    data: {
      name: 'Pan-Asian & Dim Sum',
      slug: 'chinese',
      description: 'Handmade truffle har gow, slow-cooked broths & glazed baos',
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&h=400&fit=crop',
      icon: 'utensils',
      order: 4,
    },
  });

  const catBeverages = await prisma.category.create({
    data: {
      name: 'Botanical Elixirs',
      slug: 'beverages',
      description: 'Cold-pressed tonics, roasted vanilla lattes & craft brew infusions',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=400&fit=crop',
      icon: 'coffee',
      order: 5,
    },
  });

  // 3. Restaurants
  // Restaurant 1: The Caramel Truffle Burger Co.
  const restBurger = await prisma.restaurant.create({
    data: {
      name: 'The Caramel Truffle Burger Co.',
      slug: 'caramel-truffle-burger-co',
      description: 'Luxury gourmet smash burgers layered with smoked caramel bacon jam, 24-month aged cheddar, black truffle frites, and Madagascar vanilla-infused brioche.',
      logo: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200&h=200&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&h=600&fit=crop',
      phone: '+91 99881 12233',
      email: 'hello@carameltruffle.com',
      address: 'Plot 42, 12th Main Road, HAL 2nd Stage',
      area: 'Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      lat: 12.9716,
      lng: 77.5946,
      openingHours: '11:30 AM - 11:30 PM',
      deliveryFee: 3500, // ₹35 in paise
      minOrder: 25000, // ₹250 in paise
      estimatedDeliveryTime: '25-35 min',
      cuisine: 'Gourmet Burgers, Truffle Fries, Shakes',
      rating: 4.9,
      totalReviews: 348,
      isOpen: true,
      isApproved: true,
      ownerId: chefMarcus.id,
      deliveryStaff: {
        create: [
          {
            name: 'Vikram Sharma',
            phone: '+91 98111 22334',
            status: 'ACTIVE',
            vehicleType: 'Triumph Scrambler 400X',
          },
          {
            name: 'Arjun Das',
            phone: '+91 98222 33445',
            status: 'ACTIVE',
            vehicleType: 'Ather 450X EV',
          },
        ],
      },
    },
  });

  // Restaurant 2: L'Amour Vanilla Bistro & Pâtisserie
  const restVanilla = await prisma.restaurant.create({
    data: {
      name: "L'Amour Vanilla Bistro & Pâtisserie",
      slug: 'lamour-vanilla-bistro',
      description: 'Fine French culinary patisserie featuring hand-scraped Bourbon vanilla pods, flaky artisanal croissants, caramelized cream cruffins, and bespoke dessert tasting flights.',
      logo: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=200&h=200&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=600&fit=crop',
      phone: '+91 99882 23344',
      email: 'concierge@lamourbistro.com',
      address: 'Villa 18, 5th Cross, Lavelle Road',
      area: 'Lavelle Road',
      city: 'Bengaluru',
      pincode: '560001',
      lat: 12.9702,
      lng: 77.5985,
      openingHours: '08:00 AM - 10:30 PM',
      deliveryFee: 4500, // ₹45 in paise
      minOrder: 30000, // ₹300 in paise
      estimatedDeliveryTime: '20-30 min',
      cuisine: 'French Pâtisserie, Artisanal Viennoiserie, Coffee',
      rating: 4.95,
      totalReviews: 512,
      isOpen: true,
      isApproved: true,
      ownerId: isabella.id,
      deliveryStaff: {
        create: [
          {
            name: 'Karan Mehra',
            phone: '+91 98333 44556',
            status: 'ACTIVE',
            vehicleType: 'Vespa Elegante 150',
          },
        ],
      },
    },
  });

  // Restaurant 3: Bella Napoli Wood-Fired
  const restPizza = await prisma.restaurant.create({
    data: {
      name: 'Bella Napoli Sourdough Pizzeria',
      slug: 'bella-napoli-sourdough',
      description: 'Authentic 48-hour slow fermented sourdough pizzas baked inside a 900°F Stefano Ferrara stone oven with San Marzano tomatoes, buffalo mozzarella, and cold-pressed olive oil.',
      logo: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=200&h=200&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&h=600&fit=crop',
      phone: '+91 99883 34455',
      email: 'ciao@bellanapoli.in',
      address: '88, 80ft Road, 4th Block',
      area: 'Koramangala',
      city: 'Bengaluru',
      pincode: '560034',
      lat: 12.9352,
      lng: 77.6245,
      openingHours: '12:00 PM - 11:00 PM',
      deliveryFee: 4000,
      minOrder: 35000,
      estimatedDeliveryTime: '30-40 min',
      cuisine: 'Neapolitan Pizza, Handmade Gnocchi, Italian Gelato',
      rating: 4.85,
      totalReviews: 290,
      isOpen: true,
      isApproved: true,
      ownerId: chefMarcus.id,
    },
  });

  // 4. Menu Items with Customization Groups
  // Item 1: The Signature Truffle Vanilla Glaze Burger
  const item1 = await prisma.menuItem.create({
    data: {
      restaurantId: restBurger.id,
      categoryId: catBurgers.id,
      name: 'Signature Vanilla-Glazed Truffle Burger',
      slug: 'signature-vanilla-truffle-burger',
      description: 'Double aged black angus smash patties, vanilla bourbon caramelized onion jam, melted raclette cheese, crisp pickled shallots, and fresh black truffle aioli on toasted brioche.',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=600&fit=crop',
      price: 49900, // ₹499
      isVeg: false,
      isAvailable: true,
      preparationTime: 20,
      spicyLevel: 'Medium',
      customizationGroups: {
        create: [
          {
            name: 'Choice of Brioche Bun',
            minSelections: 1,
            maxSelections: 1,
            isRequired: true,
            options: {
              create: [
                { name: 'Classic Golden Butter Brioche', price: 0, isDefault: true },
                { name: 'Charcoal Sesame Brioche', price: 3000, isDefault: false },
                { name: 'Keto Gluten-Free Almond Bun', price: 6000, isDefault: false },
              ],
            },
          },
          {
            name: 'Luxury Add-ons & Extra Toppings',
            minSelections: 0,
            maxSelections: 3,
            isRequired: false,
            options: {
              create: [
                { name: 'Melted Smoked Scamorza Cheese', price: 7000, isDefault: false },
                { name: 'Double Crispy Caramel Bacon Strip', price: 9000, isDefault: false },
                { name: 'Extra Shaved Summer Truffle Aioli', price: 8000, isDefault: false },
              ],
            },
          },
          {
            name: 'Spice Infusion Level',
            minSelections: 1,
            maxSelections: 1,
            isRequired: true,
            options: {
              create: [
                { name: 'Mild Botanical Herb (Gentle)', price: 0, isDefault: true },
                { name: 'Smoked Paprika & Chipotle Kick', price: 0, isDefault: false },
                { name: 'Habanero Bourbon Blaze (Hot)', price: 2000, isDefault: false },
              ],
            },
          },
        ],
      },
    },
  });

  // Item 2: Golden Camembert & Truffle Frites
  await prisma.menuItem.create({
    data: {
      restaurantId: restBurger.id,
      categoryId: catBurgers.id,
      name: 'Parmigiano & Truffle Frites',
      slug: 'parmigiano-truffle-frites',
      description: 'Triple-cooked Idaho potatoes tossed with white truffle oil, 24-month aged Parmigiano Reggiano, and Maldon sea salt, served with garlic vanilla aioli.',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=600&fit=crop',
      price: 26000, // ₹260
      isVeg: true,
      isAvailable: true,
      preparationTime: 12,
      spicyLevel: 'Mild',
    },
  });

  // Item 3: Madagascar Vanilla Bean Mille-Feuille
  const item3 = await prisma.menuItem.create({
    data: {
      restaurantId: restVanilla.id,
      categoryId: catDesserts.id,
      name: 'Madagascar Vanilla Bean Mille-Feuille',
      slug: 'madagascar-vanilla-mille-feuille',
      description: 'Caramelized inverted puff pastry layered with ultra-velvety Madagascar Bourbon vanilla bean crème diplomate and golden honey leaf crunch.',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop',
      price: 42000, // ₹420
      isVeg: true,
      isAvailable: true,
      preparationTime: 15,
      spicyLevel: 'Mild',
      customizationGroups: {
        create: [
          {
            name: 'Bespoke Drizzle & Garnish',
            minSelections: 0,
            maxSelections: 2,
            isRequired: false,
            options: {
              create: [
                { name: 'Salted Caramel Fleur de Sel Drizzle', price: 4000, isDefault: true },
                { name: 'Raspberry Rose Coulis', price: 4500, isDefault: false },
                { name: '24K Edible Gold Leaf Shimmer', price: 9500, isDefault: false },
              ],
            },
          },
        ],
      },
    },
  });

  // Item 4: Burnt Caramel Tahitian Cruffin
  await prisma.menuItem.create({
    data: {
      restaurantId: restVanilla.id,
      categoryId: catDesserts.id,
      name: 'Burnt Caramel Tahitian Cruffin',
      slug: 'burnt-caramel-tahitian-cruffin',
      description: 'A cross between an airy French croissant and muffin, injected with molten burnt caramel custard and rolled in vanilla sugar dust.',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=600&fit=crop',
      price: 28000, // ₹280
      isVeg: true,
      isAvailable: true,
      preparationTime: 10,
      spicyLevel: 'Mild',
    },
  });

  // Item 5: San Marzano Burrata Tartufo Pizza
  await prisma.menuItem.create({
    data: {
      restaurantId: restPizza.id,
      categoryId: catItalian.id,
      name: 'San Marzano Burrata Tartufo Pizza',
      slug: 'san-marzano-burrata-tartufo-pizza',
      description: 'Slow-charred leopard-spotted sourdough crust, San Marzano tomato reduction, entire fresh Puglia burrata ball, truffle cream, and wild baby arugula.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=600&fit=crop',
      price: 68000, // ₹680
      isVeg: true,
      isAvailable: true,
      preparationTime: 25,
      spicyLevel: 'Mild',
      customizationGroups: {
        create: [
          {
            name: 'Crust Preference',
            minSelections: 1,
            maxSelections: 1,
            isRequired: true,
            options: {
              create: [
                { name: 'Traditional 48hr Neapolitan Crust', price: 0, isDefault: true },
                { name: 'Garlic Butter Stuffed Crust', price: 9000, isDefault: false },
              ],
            },
          },
        ],
      },
    },
  });

  // Item 6: Cold-Brewed Vanilla Bean Tonic
  await prisma.menuItem.create({
    data: {
      restaurantId: restVanilla.id,
      categoryId: catBeverages.id,
      name: 'Cold-Brewed Vanilla Bean Tonic',
      slug: 'cold-brewed-vanilla-bean-tonic',
      description: 'Single-origin Ethiopian Yirgacheffe slow-dripped for 24 hours, infused with pure vanilla syrup, sparkling botanical tonic, and orange peel twist.',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&h=600&fit=crop',
      price: 24000, // ₹240
      isVeg: true,
      isAvailable: true,
      preparationTime: 5,
      spicyLevel: 'Mild',
    },
  });

  // 5. Coupons
  await prisma.coupon.create({
    data: {
      code: 'VANILLA20',
      description: '20% off on all luxury epicurean orders over ₹400',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderValue: 40000, // ₹400
      maxDiscount: 15000, // ₹150 max cap
      validUntil: new Date('2027-12-31'),
      usageLimit: 500,
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'FEAST100',
      description: 'Flat ₹100 instant rebate on orders above ₹600',
      discountType: 'FIXED',
      discountValue: 10000, // ₹100
      minOrderValue: 60000, // ₹600
      validUntil: new Date('2027-12-31'),
      usageLimit: 200,
      isActive: true,
    },
  });

  // 6. Demo Sample Order with Lifecycle Status
  const demoStaff = await prisma.deliveryStaff.findFirst({
    where: { restaurantId: restBurger.id },
  });

  const demoOrder = await prisma.order.create({
    data: {
      orderNumber: 'VB-251108-8821',
      userId: customerSophia.id,
      restaurantId: restBurger.id,
      deliveryStaffId: demoStaff ? demoStaff.id : null,
      status: 'OUT_FOR_DELIVERY',
      subtotal: 75900, // ₹759
      deliveryFee: 3500, // ₹35
      tax: 3795, // ₹37.95 (5%)
      discount: 15000, // ₹150 (VANILLA20)
      total: 68195, // ₹681.95
      deliveryAddress: '702, The Heritage Boulevard, Indiranagar 100ft Road, Bengaluru - 560038',
      customerName: 'Sophia Montgomery',
      customerPhone: '+91 98765 43210',
      deliveryNotes: 'Ring bell twice, leave on patio table.',
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'PAID',
      items: {
        create: [
          {
            menuItemId: item1.id,
            name: 'Signature Vanilla-Glazed Truffle Burger',
            price: 49900,
            quantity: 1,
            customizations: JSON.stringify([
              { groupName: 'Choice of Brioche Bun', optionName: 'Classic Golden Butter Brioche', price: 0 },
              { groupName: 'Luxury Add-ons', optionName: 'Melted Smoked Scamorza Cheese', price: 7000 },
            ]),
            itemTotal: 56900,
          },
          {
            name: 'Parmigiano & Truffle Frites',
            price: 26000,
            quantity: 1,
            customizations: '[]',
            itemTotal: 26000,
          },
        ],
      },
      statusHistory: {
        create: [
          {
            status: 'PENDING',
            notes: 'Customer placed order online via Razorpay test mode.',
            changedBy: 'System',
            createdAt: new Date(Date.now() - 35 * 60 * 1000),
          },
          {
            status: 'ACCEPTED',
            notes: 'Kitchen confirmed order. Executive chef assigned prep.',
            changedBy: 'Chef Marcus',
            createdAt: new Date(Date.now() - 30 * 60 * 1000),
          },
          {
            status: 'PREPARING',
            notes: 'Smash patties sizzling, brioche undergoing golden glaze toast.',
            changedBy: 'Kitchen Staff',
            createdAt: new Date(Date.now() - 25 * 60 * 1000),
          },
          {
            status: 'READY_FOR_PICKUP',
            notes: 'Order packaged in temperature-controlled thermal container.',
            changedBy: 'Kitchen Staff',
            createdAt: new Date(Date.now() - 10 * 60 * 1000),
          },
          {
            status: 'OUT_FOR_DELIVERY',
            notes: 'Dispatched with Vikram Sharma (Triumph Scrambler 400X). Arriving in ~10 minutes.',
            changedBy: 'Chef Marcus',
            createdAt: new Date(Date.now() - 5 * 60 * 1000),
          },
        ],
      },
      payments: {
        create: [
          {
            amount: 68195,
            currency: 'INR',
            provider: 'RAZORPAY',
            transactionId: 'pay_test_vb99281726',
            signature: 'sig_mock_verified_signature_abc123',
            status: 'PAID',
            metadata: JSON.stringify({ razorpay_order_id: 'order_test_99281' }),
          },
        ],
      },
    },
  });

  // 7. Reviews
  await prisma.review.create({
    data: {
      userId: customerSophia.id,
      restaurantId: restVanilla.id,
      menuItemId: item3.id,
      rating: 5,
      comment: "The vanilla bean mille-feuille is pure architectural poetry. The crust shatters like glass and the Madagascar cream is sublime!",
    },
  });

  console.log('Seeding completed successfully!');
  console.log(`Demo accounts created:
  - Admin: admin@vanillabites.com (password: admin123)
  - Restaurant Owner: chef.marcus@vanillabites.com (password: password123)
  - Customer: sophia@example.com (password: password123)
  - Sample Order ID: ${demoOrder.id} (${demoOrder.orderNumber})
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

