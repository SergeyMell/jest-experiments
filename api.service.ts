import UserInfoModel from './UserInfo.model';
import ApiClient from './apiClient';
import ApiNormalizer from './apiNormalizer';

export interface ResponseData {
  [key: string]: any;
}

export default class ApiService {
  static makeApiCall(
    url: string,
    normalizeCallback: (d: ResponseData) => ResponseData | null,
    callback: (d: any) => any
  ) {
    return ApiClient.get(url)
      .then((res: any) => {
        callback(normalizeCallback(res.data));
      })
      .catch(error => {
        console.error(error);
      });
  }


  static getProfile(callback: (a: UserInfoModel) => void) {
    return ApiService.makeApiCall(`profile`, ApiNormalizer.normalizeProfile, callback);
  }
}
