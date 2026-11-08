import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_vanilla_bites';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret_key_vanilla_bites';

    // If using mock test key, return a mock Razorpay order for test environments
    if (key_id.includes('mock') || !process.env.RAZORPAY_KEY_ID) {
      return NextResponse.json({
        id: `order_mock_${Date.now()}`,
        amount,
        currency,
        receipt: receipt || `rec_${Date.now()}`,
        status: 'created',
      });
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const order = await razorpay.orders.create({
      amount, // amount in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize payment gateway' },
      { status: 500 }
    );
  }
}

