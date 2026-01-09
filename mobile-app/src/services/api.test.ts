import api from './api';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

jest.mock('axios');
jest.mock('expo-secure-store');
jest.mock('expo-constants', () => ({
  expoConfig: {
    hostUri: '192.168.1.1:8081'
  }
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds Authorization header if token exists', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('test-token');
    
    // We need to trigger a request to check interceptors
    // This is tricky with the default export which is an instance
    // but we can check the interceptors array or mock the adapter
  });
});
