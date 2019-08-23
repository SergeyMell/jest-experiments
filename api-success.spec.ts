import ApiService from './api.service';
import ApiClient from './apiClient';

const mockData = {};

jest.mock('./apiClient', function () {

  return {
    get: jest.fn().mockImplementation((url: string) => {
      console.log('calling mock');
      return Promise.resolve({data: mockData});
    })
  }
});

describe('api service success flow', () => {

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
