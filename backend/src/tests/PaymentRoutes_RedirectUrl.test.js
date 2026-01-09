const express = require('express');
const httpMocks = require('node-mocks-http');
const PaymentService = require('../application/PaymentService');
const MongoBookingRepository = require('../infrastructure/repositories/MongoBookingRepository');

// Mock dependencies
jest.mock('../application/PaymentService');
jest.mock('../infrastructure/repositories/MongoBookingRepository');

describe('PaymentRoutes - Dynamic Redirect URL', () => {
  let router;

  beforeEach(() => {
    jest.clearAllMocks();
    // Use isolateModules to ensure we get a fresh router instance with our mocks
    jest.isolateModules(() => {
      router = require('../interfaces/paymentRoutes');
    });
  });

  it('should pass redirectUrl from request body to createMomoPaymentUrl in /create-momo/:bookingId', async () => {
    const bookingId = 'booking123';
    const customRedirectUrl = 'exp://10.0.2.2:8081/--/payment/result';
    
    PaymentService.createMomoPaymentUrl.mockResolvedValue('https://momo.vn/pay');

    const req = httpMocks.createRequest({
      method: 'POST',
      url: `/create-momo/${bookingId}`,
      params: { bookingId },
      body: { redirectUrl: customRedirectUrl }
    });
    const res = httpMocks.createResponse();

    // Find the handler for /create-momo/:bookingId
    const layer = router.stack.find(l => l.route && l.route.path === '/create-momo/:bookingId');
    const handler = layer.route.stack[0].handle;

    await handler(req, res);

    expect(PaymentService.createMomoPaymentUrl).toHaveBeenCalledWith(bookingId, customRedirectUrl);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData()).data).toBe('https://momo.vn/pay');
  });

  it('should pass redirectUrl from request body to createMomoPaymentUrl in /create/:bookingId', async () => {
    const bookingId = 'booking123';
    const customRedirectUrl = 'exp://10.0.2.2:8081/--/payment/result';
    
    // Mock booking repository to return a MoMo booking
    MongoBookingRepository.prototype.findById.mockResolvedValue({
      _id: bookingId,
      paymentMethod: 'momo'
    });
    
    PaymentService.createMomoPaymentUrl.mockResolvedValue('https://momo.vn/pay');

    const req = httpMocks.createRequest({
      method: 'POST',
      url: `/create/${bookingId}`,
      params: { bookingId },
      body: { redirectUrl: customRedirectUrl }
    });
    const res = httpMocks.createResponse();

    const layer = router.stack.find(l => l.route && l.route.path === '/create/:bookingId');
    const handler = layer.route.stack[0].handle;

    await handler(req, res);

    expect(PaymentService.createMomoPaymentUrl).toHaveBeenCalledWith(bookingId, customRedirectUrl);
  });

  it('should still work without redirectUrl in request body', async () => {
    const bookingId = 'booking123';
    
    PaymentService.createMomoPaymentUrl.mockResolvedValue('https://momo.vn/pay');

    const req = httpMocks.createRequest({
      method: 'POST',
      url: `/create-momo/${bookingId}`,
      params: { bookingId },
      body: {}
    });
    const res = httpMocks.createResponse();

    const layer = router.stack.find(l => l.route && l.route.path === '/create-momo/:bookingId');
    const handler = layer.route.stack[0].handle;

    await handler(req, res);

    // Should be called with undefined or null for redirectUrl
    expect(PaymentService.createMomoPaymentUrl).toHaveBeenCalledWith(bookingId, undefined);
  });
});