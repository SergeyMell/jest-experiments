import ApiService from './api.service';
import ApiClient from './apiClient';

const mockData = {};
const mockError = {message: 'Smth Bad Happened'};

jest.mock('./apiClient', function () {
  return {
    get: jest.fn()
  }
});

describe('api service success flow', () => {

  beforeAll(() => {
    //@ts-ignore
    ApiClient.get.mockImplementation((url: string) => {
      return Promise.resolve({data: mockData});
    })
  });

  it('should call api client method', () => {
    ApiService.makeApiCall('test url', (data) => data, (res) => res);
    expect(ApiClient.get).toBeCalledTimes(1);
    expect(ApiClient.get).toBeCalledWith('test url');
  });

  it('should call callbacks consequently', (done) => {
    const firstCallback = jest.fn((data: any) => {
      return data;
    });
    const secondCallback = jest.fn((data: any) => {
      return data;
    });
    ApiService.makeApiCall('test url', firstCallback, secondCallback)
      .then(() => {
        expect(firstCallback).toBeCalledTimes(1);
        expect(firstCallback).toBeCalledWith(mockData);

        expect(secondCallback).toBeCalledTimes(1);
        expect(secondCallback).toBeCalledWith(firstCallback(mockData));
        done();
      });
  });

  it('should call callbacks consequently', (done) => {
    const firstCallback = jest.fn((data: any) => {
      return null;
    });
    const secondCallback = jest.fn((data: any) => {
      return data;
    });
    ApiService.makeApiCall('test url', firstCallback, secondCallback)
      .then(() => {
        expect(firstCallback).toBeCalledTimes(1);
        expect(firstCallback).toBeCalledWith(mockData);
        expect(secondCallback).toBeCalledTimes(1);
        done();
      });
  });

});

describe('api service error flow', () => {

  beforeAll(() => {
    //@ts-ignore
    ApiClient.get.mockImplementation((url: string) => {
      console.log('error result');
      return Promise.reject(mockError);
    })
  });

  it('should handle error', (done) => {
    console.error = jest.fn();

    const firstCallback = jest.fn((data: any) => {
      return data;
    });
    const secondCallback = jest.fn((data: any) => {
      return data;
    });
    ApiService.makeApiCall('test url', firstCallback, secondCallback)
      .then(() => {
        expect(firstCallback).toBeCalledTimes(0);
        expect(secondCallback).toBeCalledTimes(0);
        expect(console.error).toBeCalledTimes(1);
        expect(console.error).toBeCalledWith(mockError);
        done();
      });
  });

});

