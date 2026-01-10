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
      body: { redirectUrl: customRedirectUrl },
      headers: { host: 'localhost:5000' }
    });
    const res = httpMocks.createResponse();

    // Find the handler for /create-momo/:bookingId
    const layer = router.stack.find(l => l.route && l.route.path === '/create-momo/:bookingId');
    const handler = layer.route.stack[0].handle;

    await handler(req, res);

    // Should receive bookingId, customRedirectUrl, and constructed baseReturnUrl
    // Mock req.protocol is undefined in node-mocks-http by default unless set?
    // node-mocks-http defaults: protocol: 'http', get('host'): undefined
    
    // We can't easily mock req.get('host') with the current setup unless we explicitly set it on the mock request
    // The previous test passed because I didn't check the 3rd arg.
    // Let's verify it now.
    expect(PaymentService.createMomoPaymentUrl).toHaveBeenCalledWith(
      bookingId, 
      customRedirectUrl, 
      expect.stringContaining('/api/payments/momo/return')
    );
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
      body: { redirectUrl: customRedirectUrl },
      headers: { host: 'localhost:5000' }
    });
    const res = httpMocks.createResponse();

    const layer = router.stack.find(l => l.route && l.route.path === '/create/:bookingId');
    const handler = layer.route.stack[0].handle;

    await handler(req, res);

    expect(PaymentService.createMomoPaymentUrl).toHaveBeenCalledWith(
      bookingId, 
      customRedirectUrl, 
      expect.stringContaining('/api/payments/momo/return')
    );
  });

  it('should still work without redirectUrl in request body', async () => {
    const bookingId = 'booking123';
    
    PaymentService.createMomoPaymentUrl.mockResolvedValue('https://momo.vn/pay');

    const req = httpMocks.createRequest({
      method: 'POST',
      url: `/create-momo/${bookingId}`,
      params: { bookingId },
      body: {},
      headers: { host: 'localhost:5000' }
    });
    const res = httpMocks.createResponse();

    const layer = router.stack.find(l => l.route && l.route.path === '/create-momo/:bookingId');
    const handler = layer.route.stack[0].handle;

    await handler(req, res);

    // Should be called with undefined or null for redirectUrl
    expect(PaymentService.createMomoPaymentUrl).toHaveBeenCalledWith(
      bookingId, 
      undefined,
      expect.stringContaining('/api/payments/momo/return')
    );
  });

  it('should redirect to clientRedirect URL in /momo/return if present', async () => {
    const clientRedirect = 'exp://10.0.2.2:8081/--/payment/result';
    const orderId = 'booking123';
    
    // Mock verify and process logic if needed, or just focus on the redirect
    // But verifyMomoResponse is not called in return handler? 
    // Wait, the return handler calls processPaymentResult. We need to mock it.
    
    // Actually, processPaymentResult is imported from PaymentService.
    PaymentService.processPaymentResult = jest.fn().mockResolvedValue({ success: true });

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/momo/return',
      query: { 
        orderId, 
        resultCode: '0', 
        message: 'Success',
        clientRedirect 
      }
    });
    const res = httpMocks.createResponse();

    const layer = router.stack.find(l => l.route && l.route.path === '/momo/return');
    const handler = layer.route.stack[0].handle;

    await handler(req, res);

    const expectedRedirect = `${clientRedirect}?bookingId=${orderId}&paymentMethod=momo&resultCode=0&message=Success`;
    expect(res._getRedirectUrl()).toBe(expectedRedirect);
  });
});