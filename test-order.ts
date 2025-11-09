import orderService from './src/lib/services/OrderService.js';

async function testOrder() {
  console.log('Testing order creation...');
  
  try {
    const order = await orderService.createOrder({
      merchantId: BigInt(2),
      orderType: 'DINE_IN',
      tableNumber: 'Table 5',
      customerName: 'Budi Santoso',
      customerEmail: 'budi@example.com',
      customerPhone: '+628123456789',
      items: [
        {
          menuId: BigInt(1),
          quantity: 2,
          selectedAddons: [],
          specialInstructions: 'Less sugar'
        }
      ],
      notes: 'Please serve quickly'
    });
    
    console.log('✅ Order created successfully!');
    console.log('Order ID:', order.id.toString());
    console.log('Order Number:', order.orderNumber);
    console.log('Status:', order.status);
    console.log('Total:', order.totalAmount);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testOrder();
