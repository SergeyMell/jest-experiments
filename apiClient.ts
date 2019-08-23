export default class ApiClient {

  static get(url: string) {
    console.log('calling real');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({data: true});
      }, 1000)
    })
  }

}
