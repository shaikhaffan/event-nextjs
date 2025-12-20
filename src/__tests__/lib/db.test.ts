import mongoose from 'mongoose';
import { connectDB } from '../../lib/db';

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

describe('connectDB', () => {
  let originalEnv: NodeJS.ProcessEnv;
  let mockMongoose: any;

  beforeEach(() => {
    // Save original environment
    originalEnv = process.env;
    process.env = { ...originalEnv };
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Clear cached connection
    delete (global as any).mongoose;
    
    // Setup mock mongoose
    mockMongoose = {
      connection: { readyState: 1 },
    };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    
    // Clean up global cache
    delete (global as any).mongoose;
  });

  describe('Environment Variable Validation', () => {
    it('should throw error when MONGODB_URI is not defined', () => {
      // Remove MONGODB_URI from environment
      delete process.env.MONGODB_URI;
      
      // Clear the module cache to force re-evaluation
      jest.resetModules();
      
      // Expect the module to throw when loaded without MONGODB_URI
      expect(() => {
        jest.isolateModules(() => {
          require('../../lib/db');
        });
      }).toThrow('Please define the MONGODB_URI environment variable');
    });

    it('should not throw error when MONGODB_URI is defined', () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
      
      expect(() => {
        jest.isolateModules(() => {
          require('../../lib/db');
        });
      }).not.toThrow();
    });

    it('should handle empty string MONGODB_URI', () => {
      process.env.MONGODB_URI = '';
      
      expect(() => {
        jest.isolateModules(() => {
          require('../../lib/db');
        });
      }).toThrow('Please define the MONGODB_URI environment variable');
    });
  });

  describe('Connection Caching', () => {
    beforeEach(() => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
    });

    it('should initialize global cache if not exists', async () => {
      (mongoose.connect as jest.Mock).mockResolvedValue(mockMongoose);
      
      expect((global as any).mongoose).toBeUndefined();
      
      await connectDB();
      
      expect((global as any).mongoose).toBeDefined();
      expect((global as any).mongoose).toHaveProperty('conn');
      expect((global as any).mongoose).toHaveProperty('promise');
    });

    it('should return cached connection if already exists', async () => {
      // Setup cached connection
      (global as any).mongoose = {
        conn: mockMongoose,
        promise: null,
      };
      
      const result = await connectDB();
      
      expect(result).toBe(mockMongoose);
      expect(mongoose.connect).not.toHaveBeenCalled();
    });

    it('should reuse existing promise if connection in progress', async () => {
      const connectPromise = Promise.resolve(mockMongoose);
      (global as any).mongoose = {
        conn: null,
        promise: connectPromise,
      };
      
      const result = await connectDB();
      
      expect(result).toBe(mockMongoose);
      expect(mongoose.connect).not.toHaveBeenCalled();
    });

    it('should cache connection after successful connect', async () => {
      (mongoose.connect as jest.Mock).mockResolvedValue(mockMongoose);
      
      const result = await connectDB();
      
      expect((global as any).mongoose.conn).toBe(mockMongoose);
      expect(result).toBe(mockMongoose);
    });
  });

  describe('Database Connection', () => {
    beforeEach(() => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
    });

    it('should connect to database with correct URI and options', async () => {
      (mongoose.connect as jest.Mock).mockResolvedValue(mockMongoose);
      
      await connectDB();
      
      expect(mongoose.connect).toHaveBeenCalledWith(
        'mongodb://localhost:27017/test-db',
        { bufferCommands: false }
      );
    });

    it('should use bufferCommands: false option', async () => {
      (mongoose.connect as jest.Mock).mockResolvedValue(mockMongoose);
      
      await connectDB();
      
      const callArgs = (mongoose.connect as jest.Mock).mock.calls[0];
      expect(callArgs[1]).toEqual({ bufferCommands: false });
    });

    it('should handle successful connection', async () => {
      (mongoose.connect as jest.Mock).mockResolvedValue(mockMongoose);
      
      const result = await connectDB();
      
      expect(result).toBe(mockMongoose);
      expect((global as any).mongoose.conn).toBe(mockMongoose);
    });

    it('should only connect once for multiple simultaneous calls', async () => {
      (mongoose.connect as jest.Mock).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockMongoose), 100))
      );
      
      // Make multiple simultaneous calls
      const promises = [connectDB(), connectDB(), connectDB()];
      const results = await Promise.all(promises);
      
      // Should only call connect once
      expect(mongoose.connect).toHaveBeenCalledTimes(1);
      // All should return the same connection
      results.forEach(result => expect(result).toBe(mockMongoose));
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
    });

    it('should clear cached promise on connection error', async () => {
      const error = new Error('Connection failed');
      (mongoose.connect as jest.Mock).mockRejectedValue(error);
      
      await expect(connectDB()).rejects.toThrow('Connection failed');
      
      expect((global as any).mongoose.promise).toBeNull();
      expect((global as any).mongoose.conn).toBeNull();
    });

    it('should allow retry after connection failure', async () => {
      const error = new Error('Connection failed');
      (mongoose.connect as jest.Mock)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(mockMongoose);
      
      // First attempt fails
      await expect(connectDB()).rejects.toThrow('Connection failed');
      expect((global as any).mongoose.promise).toBeNull();
      
      // Second attempt succeeds
      const result = await connectDB();
      expect(result).toBe(mockMongoose);
      expect((global as any).mongoose.conn).toBe(mockMongoose);
    });

    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('Connection timeout');
      timeoutError.name = 'MongoNetworkTimeoutError';
      (mongoose.connect as jest.Mock).mockRejectedValue(timeoutError);
      
      await expect(connectDB()).rejects.toThrow('Connection timeout');
      expect((global as any).mongoose.promise).toBeNull();
    });

    it('should handle authentication errors', async () => {
      const authError = new Error('Authentication failed');
      authError.name = 'MongoAuthenticationError';
      (mongoose.connect as jest.Mock).mockRejectedValue(authError);
      
      await expect(connectDB()).rejects.toThrow('Authentication failed');
      expect((global as any).mongoose.promise).toBeNull();
    });

    it('should handle malformed URI errors', async () => {
      const uriError = new Error('Invalid connection string');
      (mongoose.connect as jest.Mock).mockRejectedValue(uriError);
      
      await expect(connectDB()).rejects.toThrow('Invalid connection string');
      expect((global as any).mongoose.promise).toBeNull();
    });

    it('should propagate error and not cache failed connection', async () => {
      const error = new Error('Database error');
      (mongoose.connect as jest.Mock).mockRejectedValue(error);
      
      await expect(connectDB()).rejects.toThrow('Database error');
      
      // Connection should not be cached
      expect((global as any).mongoose.conn).toBeNull();
      // Promise should be cleared for retry
      expect((global as any).mongoose.promise).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
    });

    it('should handle undefined connection result', async () => {
      (mongoose.connect as jest.Mock).mockResolvedValue(undefined);
      
      const result = await connectDB();
      
      expect(result).toBeUndefined();
      expect((global as any).mongoose.conn).toBeUndefined();
    });

    it('should handle null connection result', async () => {
      (mongoose.connect as jest.Mock).mockResolvedValue(null);
      
      const result = await connectDB();
      
      expect(result).toBeNull();
      expect((global as any).mongoose.conn).toBeNull();
    });

    it('should handle connection with different URI formats', async () => {
      const uris = [
        'mongodb://localhost:27017/db',
        'mongodb://user:pass@host:27017/db',
        'mongodb+srv://cluster.mongodb.net/db',
        'mongodb://host1:27017,host2:27017/db?replicaSet=rs',
      ];
      
      for (const uri of uris) {
        delete (global as any).mongoose;
        process.env.MONGODB_URI = uri;
        (mongoose.connect as jest.Mock).mockResolvedValue(mockMongoose);
        
        await connectDB();
        
        expect(mongoose.connect).toHaveBeenCalledWith(uri, { bufferCommands: false });
        jest.clearAllMocks();
      }
    });

    it('should maintain separate cache per global context', async () => {
      (mongoose.connect as jest.Mock).mockResolvedValue(mockMongoose);
      
      // First connection
      const result1 = await connectDB();
      const cachedConn1 = (global as any).mongoose.conn;
      
      expect(result1).toBe(mockMongoose);
      expect(cachedConn1).toBe(mockMongoose);
      
      // Verify cache is being used
      const result2 = await connectDB();
      expect(result2).toBe(cachedConn1);
      expect(mongoose.connect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Concurrent Connection Handling', () => {
    beforeEach(() => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
    });

    it('should handle race condition with multiple concurrent calls', async () => {
      let resolveConnect: (value: any) => void;
      const connectPromise = new Promise(resolve => {
        resolveConnect = resolve;
      });
      
      (mongoose.connect as jest.Mock).mockReturnValue(connectPromise);
      
      // Start multiple connections simultaneously
      const call1 = connectDB();
      const call2 = connectDB();
      const call3 = connectDB();
      
      // Resolve the connection
      resolveConnect!(mockMongoose);
      
      const results = await Promise.all([call1, call2, call3]);
      
      // Should only connect once
      expect(mongoose.connect).toHaveBeenCalledTimes(1);
      // All should get the same result
      results.forEach(result => expect(result).toBe(mockMongoose));
    });

    it('should handle rapid sequential connection attempts', async () => {
      (mongoose.connect as jest.Mock).mockResolvedValue(mockMongoose);
      
      // First call
      await connectDB();
      
      // Subsequent rapid calls should use cached connection
      const results = await Promise.all([
        connectDB(),
        connectDB(),
        connectDB(),
      ]);
      
      expect(mongoose.connect).toHaveBeenCalledTimes(1);
      results.forEach(result => expect(result).toBe(mockMongoose));
    });
  });

  describe('Type Safety', () => {
    beforeEach(() => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
    });

    it('should return mongoose connection type', async () => {
      (mongoose.connect as jest.Mock).mockResolvedValue(mockMongoose);
      
      const connection = await connectDB();
      
      expect(connection).toHaveProperty('connection');
    });

    it('should handle MONGODB_URI as string type', async () => {
      const uri: string = 'mongodb://localhost:27017/test-db';
      process.env.MONGODB_URI = uri;
      (mongoose.connect as jest.Mock).mockResolvedValue(mockMongoose);
      
      await connectDB();
      
      expect(mongoose.connect).toHaveBeenCalledWith(uri, expect.any(Object));
    });
  });
});