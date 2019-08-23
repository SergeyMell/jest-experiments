import ApiService from './api.service';

const mockError = {message: 'Smth Bad Happened'};

jest.mock('./apiClient', function () {

  return {
    get: jest.fn().mockImplementation((url: string) => {
      console.log('error result');
      return Promise.reject(mockError);
    })
  }
});

describe( 't1', () => {
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

