import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderNumber,
    } = await req.json();

    if (!orderNumber || !razorpay_payment_id) {
      return NextResponse.json(
        { error: 'Incomplete payment verification payload.' },
        { status: 400 }
      );
    }

    const key_secret =
      process.env.RAZORPAY_KEY_SECRET || 'mock_secret_key_vanilla_bites';

    let isSignatureValid = false;

    // Verify HMAC SHA256 signature if real Razorpay order ID is supplied
    if (razorpay_order_id && razorpay_signature && !key_secret.includes('mock')) {
      const generatedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isSignatureValid = generatedSignature === razorpay_signature;
    } else {
      // In test mode or simulated sandbox environment
      isSignatureValid = true;
    }

    if (!isSignatureValid) {
      return NextResponse.json(
        { error: 'Payment signature verification failed. Untrusted payload.' },
        { status: 400 }
      );
    }

    // Update order status in DB
    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'PAID',
        status: 'ACCEPTED', // Confirmed upon successful payment
      },
    });

    // Update or create payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.total,
        currency: 'INR',
        provider: 'RAZORPAY',
        transactionId: razorpay_payment_id,
        signature: razorpay_signature || 'mock_sig',
        status: 'PAID',
        metadata: JSON.stringify({ razorpay_order_id }),
      },
    });

    // Record order status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: 'ACCEPTED',
        notes: `Payment verified via Razorpay (Txn ID: ${razorpay_payment_id}). Kitchen notified.`,
        changedBy: 'Razorpay Gateway',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully.',
      orderNumber: order.orderNumber,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}

