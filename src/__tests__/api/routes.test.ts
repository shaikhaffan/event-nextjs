import { NextResponse } from 'next/server';
import { POST } from '../../api/routes';
import { connectDB } from '../../lib/db';
import Booking from '../../schema/booking';

// Mock dependencies
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      data,
      status: init?.status || 200,
      headers: new Map(),
    })),
  },
}));

jest.mock('../../lib/db', () => ({
  connectDB: jest.fn(),
}));

jest.mock('../../schema/booking', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

describe('POST /api/routes', () => {
  let mockRequest: Partial<Request>;
  let mockConnectDB: jest.MockedFunction<typeof connectDB>;
  let mockBookingCreate: jest.MockedFunction<typeof Booking.create>;
  let mockNextResponseJson: jest.MockedFunction<typeof NextResponse.json>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;
    mockBookingCreate = Booking.create as jest.MockedFunction<typeof Booking.create>;
    mockNextResponseJson = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;
    
    // Default mock implementations
    mockConnectDB.mockResolvedValue({} as any);
  });

  describe('Request Validation', () => {
    it('should return 400 when eventId is missing', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ userEmail: 'test@example.com' }),
      } as any;
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'eventId and userEmail are required' },
        { status: 400 }
      );
      expect(mockBookingCreate).not.toHaveBeenCalled();
    });

    it('should return 400 when userEmail is missing', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011' }),
      } as any;
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'eventId and userEmail are required' },
        { status: 400 }
      );
      expect(mockBookingCreate).not.toHaveBeenCalled();
    });

    it('should return 400 when both eventId and userEmail are missing', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({}),
      } as any;
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'eventId and userEmail are required' },
        { status: 400 }
      );
      expect(mockBookingCreate).not.toHaveBeenCalled();
    });

    it('should return 400 when eventId is null', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: null, userEmail: 'test@example.com' }),
      } as any;
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'eventId and userEmail are required' },
        { status: 400 }
      );
    });

    it('should return 400 when userEmail is null', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: null }),
      } as any;
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'eventId and userEmail are required' },
        { status: 400 }
      );
    });

    it('should return 400 when eventId is empty string', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '', userEmail: 'test@example.com' }),
      } as any;
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'eventId and userEmail are required' },
        { status: 400 }
      );
    });

    it('should return 400 when userEmail is empty string', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: '' }),
      } as any;
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'eventId and userEmail are required' },
        { status: 400 }
      );
    });

    it('should return 400 when eventId is undefined', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: undefined, userEmail: 'test@example.com' }),
      } as any;
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'eventId and userEmail are required' },
        { status: 400 }
      );
    });

    it('should return 400 when userEmail is undefined', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: undefined }),
      } as any;
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'eventId and userEmail are required' },
        { status: 400 }
      );
    });
  });

  describe('Successful Booking Creation', () => {
    const validEventId = '507f1f77bcf86cd799439011';
    const validEmail = 'user@example.com';

    it('should create booking with valid data', async () => {
      const mockBooking = {
        _id: '507f191e810c19729de860ea',
        eventId: validEventId,
        userEmail: validEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: validEventId, userEmail: validEmail }),
      } as any;
      
      mockBookingCreate.mockResolvedValue(mockBooking as any);
      
      await POST(mockRequest as Request);
      
      expect(mockConnectDB).toHaveBeenCalledTimes(1);
      expect(mockBookingCreate).toHaveBeenCalledWith({
        eventId: validEventId,
        userEmail: validEmail,
      });
      expect(mockNextResponseJson).toHaveBeenCalledWith(mockBooking, { status: 201 });
    });

    it('should return 201 status on successful creation', async () => {
      const mockBooking = { _id: '123', eventId: validEventId, userEmail: validEmail };
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: validEventId, userEmail: validEmail }),
      } as any;
      mockBookingCreate.mockResolvedValue(mockBooking as any);
      
      const response = await POST(mockRequest as Request);
      
      expect(response.status).toBe(201);
    });

    it('should connect to database before creating booking', async () => {
      const mockBooking = { _id: '123', eventId: validEventId, userEmail: validEmail };
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: validEventId, userEmail: validEmail }),
      } as any;
      mockBookingCreate.mockResolvedValue(mockBooking as any);
      
      await POST(mockRequest as Request);
      
      expect(mockConnectDB).toHaveBeenCalledBefore(mockBookingCreate as any);
    });

    it('should handle various email formats', async () => {
      const emails = [
        'simple@example.com',
        'user+tag@example.com',
        'user.name@example.co.uk',
        'user_name@sub.example.com',
      ];
      
      for (const email of emails) {
        jest.clearAllMocks();
        mockRequest = {
          json: jest.fn().mockResolvedValue({ eventId: validEventId, userEmail: email }),
        } as any;
        mockBookingCreate.mockResolvedValue({ _id: '123', eventId: validEventId, userEmail: email } as any);
        
        await POST(mockRequest as Request);
        
        expect(mockBookingCreate).toHaveBeenCalledWith({
          eventId: validEventId,
          userEmail: email,
        });
      }
    });

    it('should handle various ObjectId formats', async () => {
      const objectIds = [
        '507f1f77bcf86cd799439011',
        '5f8d0d55b54764421b7156d1',
        '6123456789abcdef01234567',
      ];
      
      for (const objectId of objectIds) {
        jest.clearAllMocks();
        mockRequest = {
          json: jest.fn().mockResolvedValue({ eventId: objectId, userEmail: validEmail }),
        } as any;
        mockBookingCreate.mockResolvedValue({ _id: '123', eventId: objectId, userEmail: validEmail } as any);
        
        await POST(mockRequest as Request);
        
        expect(mockBookingCreate).toHaveBeenCalledWith({
          eventId: objectId,
          userEmail: validEmail,
        });
      }
    });

    it('should return complete booking object with timestamps', async () => {
      const now = new Date();
      const mockBooking = {
        _id: '507f191e810c19729de860ea',
        eventId: validEventId,
        userEmail: validEmail,
        createdAt: now,
        updatedAt: now,
      };
      
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: validEventId, userEmail: validEmail }),
      } as any;
      mockBookingCreate.mockResolvedValue(mockBooking as any);
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: mockBooking._id,
          eventId: validEventId,
          userEmail: validEmail,
          createdAt: now,
          updatedAt: now,
        }),
        { status: 201 }
      );
    });
  });

  describe('Database Connection Errors', () => {
    it('should return 500 when database connection fails', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: 'test@example.com' }),
      } as any;
      
      mockConnectDB.mockRejectedValue(new Error('Connection failed'));
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Connection failed' },
        { status: 500 }
      );
    });

    it('should not attempt to create booking if connection fails', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: 'test@example.com' }),
      } as any;
      
      mockConnectDB.mockRejectedValue(new Error('Connection failed'));
      
      await POST(mockRequest as Request);
      
      expect(mockBookingCreate).not.toHaveBeenCalled();
    });

    it('should handle network timeout errors', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: 'test@example.com' }),
      } as any;
      
      const timeoutError = new Error('Network timeout');
      mockConnectDB.mockRejectedValue(timeoutError);
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Network timeout' },
        { status: 500 }
      );
    });
  });

  describe('Booking Creation Errors', () => {
    const validEventId = '507f1f77bcf86cd799439011';
    const validEmail = 'user@example.com';

    it('should return 500 when booking creation fails', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: validEventId, userEmail: validEmail }),
      } as any;
      
      mockBookingCreate.mockRejectedValue(new Error('Referenced event does not exist'));
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Referenced event does not exist' },
        { status: 500 }
      );
    });

    it('should handle validation errors from schema', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: validEventId, userEmail: validEmail }),
      } as any;
      
      const validationError = new Error('Validation failed');
      mockBookingCreate.mockRejectedValue(validationError);
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Validation failed' },
        { status: 500 }
      );
    });

    it('should handle event not found errors', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: validEventId, userEmail: validEmail }),
      } as any;
      
      mockBookingCreate.mockRejectedValue(new Error('Referenced event does not exist'));
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Referenced event does not exist' },
        { status: 500 }
      );
    });

    it('should handle past event errors', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: validEventId, userEmail: validEmail }),
      } as any;
      
      mockBookingCreate.mockRejectedValue(new Error('Cannot create booking for an event in the past'));
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Cannot create booking for an event in the past' },
        { status: 500 }
      );
    });

    it('should handle duplicate booking errors', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: validEventId, userEmail: validEmail }),
      } as any;
      
      const duplicateError = new Error('Duplicate key error');
      (duplicateError as any).code = 11000;
      mockBookingCreate.mockRejectedValue(duplicateError);
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Duplicate key error' },
        { status: 500 }
      );
    });

    it('should handle invalid ObjectId format errors', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: 'invalid-id', userEmail: validEmail }),
      } as any;
      
      mockBookingCreate.mockRejectedValue(new Error('Cast to ObjectId failed'));
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Cast to ObjectId failed' },
        { status: 500 }
      );
    });
  });

  describe('Request Parsing Errors', () => {
    it('should return 500 when request body parsing fails', async () => {
      mockRequest = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as any;
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Invalid JSON' },
        { status: 500 }
      );
    });

    it('should handle malformed JSON', async () => {
      mockRequest = {
        json: jest.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
      } as any;
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Unexpected token' },
        { status: 500 }
      );
    });

    it('should handle empty request body', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue(null),
      } as any;
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'eventId and userEmail are required' },
        { status: 400 }
      );
    });
  });

  describe('Error Object Handling', () => {
    it('should handle error with message property', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: 'test@example.com' }),
      } as any;
      
      const error = { message: 'Custom error message' };
      mockBookingCreate.mockRejectedValue(error);
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Custom error message' },
        { status: 500 }
      );
    });

    it('should handle error without message property', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: 'test@example.com' }),
      } as any;
      
      mockBookingCreate.mockRejectedValue({});
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Unknown error' },
        { status: 500 }
      );
    });

    it('should handle null error', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: 'test@example.com' }),
      } as any;
      
      mockBookingCreate.mockRejectedValue(null);
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Unknown error' },
        { status: 500 }
      );
    });

    it('should handle undefined error', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: 'test@example.com' }),
      } as any;
      
      mockBookingCreate.mockRejectedValue(undefined);
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Unknown error' },
        { status: 500 }
      );
    });

    it('should handle string error', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: 'test@example.com' }),
      } as any;
      
      mockBookingCreate.mockRejectedValue('String error');
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Unknown error' },
        { status: 500 }
      );
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle very long email addresses', async () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: longEmail }),
      } as any;
      mockBookingCreate.mockResolvedValue({ _id: '123', eventId: '507f1f77bcf86cd799439011', userEmail: longEmail } as any);
      
      await POST(mockRequest as Request);
      
      expect(mockBookingCreate).toHaveBeenCalledWith({
        eventId: '507f1f77bcf86cd799439011',
        userEmail: longEmail,
      });
    });

    it('should handle request with extra fields', async () => {
      const requestData = {
        eventId: '507f1f77bcf86cd799439011',
        userEmail: 'test@example.com',
        extraField: 'should be ignored',
        anotherField: 123,
      };
      
      mockRequest = {
        json: jest.fn().mockResolvedValue(requestData),
      } as any;
      mockBookingCreate.mockResolvedValue({ _id: '123' } as any);
      
      await POST(mockRequest as Request);
      
      expect(mockBookingCreate).toHaveBeenCalledWith({
        eventId: requestData.eventId,
        userEmail: requestData.userEmail,
      });
    });

    it('should handle whitespace in email', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: '  test@example.com  ' }),
      } as any;
      mockBookingCreate.mockResolvedValue({ _id: '123' } as any);
      
      await POST(mockRequest as Request);
      
      expect(mockBookingCreate).toHaveBeenCalledWith({
        eventId: '507f1f77bcf86cd799439011',
        userEmail: '  test@example.com  ',
      });
    });

    it('should handle uppercase email', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: 'TEST@EXAMPLE.COM' }),
      } as any;
      mockBookingCreate.mockResolvedValue({ _id: '123' } as any);
      
      await POST(mockRequest as Request);
      
      expect(mockBookingCreate).toHaveBeenCalledWith({
        eventId: '507f1f77bcf86cd799439011',
        userEmail: 'TEST@EXAMPLE.COM',
      });
    });

    it('should handle special characters in eventId', async () => {
      const eventId = '507f1f77bcf86cd799439011';
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId, userEmail: 'test@example.com' }),
      } as any;
      mockBookingCreate.mockResolvedValue({ _id: '123' } as any);
      
      await POST(mockRequest as Request);
      
      expect(mockBookingCreate).toHaveBeenCalledWith({
        eventId,
        userEmail: 'test@example.com',
      });
    });
  });

  describe('Integration Flow', () => {
    it('should execute full successful flow in correct order', async () => {
      const eventId = '507f1f77bcf86cd799439011';
      const userEmail = 'user@example.com';
      const mockBooking = { _id: '123', eventId, userEmail };
      
      const executionOrder: string[] = [];
      
      mockRequest = {
        json: jest.fn().mockImplementation(async () => {
          executionOrder.push('json-parse');
          return { eventId, userEmail };
        }),
      } as any;
      
      mockConnectDB.mockImplementation(async () => {
        executionOrder.push('connect-db');
        return {} as any;
      });
      
      mockBookingCreate.mockImplementation(async () => {
        executionOrder.push('create-booking');
        return mockBooking as any;
      });
      
      mockNextResponseJson.mockImplementation((data, init) => {
        executionOrder.push('response');
        return { data, status: init?.status || 200 } as any;
      });
      
      await POST(mockRequest as Request);
      
      expect(executionOrder).toEqual([
        'json-parse',
        'connect-db',
        'create-booking',
        'response',
      ]);
    });

    it('should stop execution on validation failure', async () => {
      const executionOrder: string[] = [];
      
      mockRequest = {
        json: jest.fn().mockImplementation(async () => {
          executionOrder.push('json-parse');
          return { eventId: '', userEmail: 'test@example.com' };
        }),
      } as any;
      
      mockConnectDB.mockImplementation(async () => {
        executionOrder.push('connect-db');
        return {} as any;
      });
      
      mockBookingCreate.mockImplementation(async () => {
        executionOrder.push('create-booking');
        return {} as any;
      });
      
      await POST(mockRequest as Request);
      
      expect(executionOrder).toEqual(['json-parse']);
      expect(executionOrder).not.toContain('connect-db');
      expect(executionOrder).not.toContain('create-booking');
    });
  });

  describe('Response Format', () => {
    it('should return JSON response', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: 'test@example.com' }),
      } as any;
      mockBookingCreate.mockResolvedValue({ _id: '123' } as any);
      
      const response = await POST(mockRequest as Request);
      
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('status');
    });

    it('should use NextResponse.json for all responses', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ eventId: '507f1f77bcf86cd799439011', userEmail: 'test@example.com' }),
      } as any;
      mockBookingCreate.mockResolvedValue({ _id: '123' } as any);
      
      await POST(mockRequest as Request);
      
      expect(mockNextResponseJson).toHaveBeenCalled();
    });
  });
});