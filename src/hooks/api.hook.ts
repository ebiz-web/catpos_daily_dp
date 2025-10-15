import { axios } from '@/services/axios.ts';

export interface ApiMap {
  method: string;
  url: string;
}

type ApiCountType = {
  COUNT: number;
};

type ApiDataType<T> =
  | {
      LIST: T;
    }
  | {
      LIST: T;
      SUM: ApiCountType;
    }
  | T;

interface ApiResponse<T> {
  CODE: string;
  MSG: string;
  DATA: ApiDataType<T>;
}

export interface ApiCountResult<T> {
  list: T;
  count: number;
}

export interface ApiRequest {
  key?: (string | object)[];
  options?: object;
}

export interface ApiData extends ApiRequest {
  apiMap: ApiMap;
  data?: object | undefined;
  id?: string | null;
}

export const api = async <T>({
  apiMap,
  data,
  id,
}: ApiData): Promise<T | null> => {
  let apiUrl = id ? `${apiMap.url}/${id}` : apiMap.url;

  if (apiMap.method === 'GET' && data) {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item.trim() !== '') params.append(key, String(item));
        });
      } else {
        params.append(key, value ? String(value).trim() : '');
      }
    });

    apiUrl += `?${params.toString()}`;
  }

  try {
    const response: ApiResponse<T> = await axios({
      method: apiMap.method,
      url: `/api/${apiUrl}`,
      ...(data ? { data: data } : {}),
    });
    console.log('[', apiMap.method, ']', apiMap.url, ' : ', response);

    if (response.MSG) {
      //await alert({ message: response.message });
    }

    const dataObj = response.DATA as any;

    if (dataObj?.LIST && dataObj?.SUM) {
      return {
        list: dataObj.LIST,
        count: dataObj.SUM[0].COUNT,
      } as T;
    }

    if (dataObj?.LIST) {
      return dataObj.LIST as T;
    }

    return response.DATA as T;
  } catch (error: any) {
    console.log('api hook : ', error);

    if (error.response) {
      if (error.response.status === 401) {
        console.log('ERROR [401]');

        alert({ message: error.response.data.message });

        window.location.href = `/login`;
        return null;
      } else if (error.response.status === 404) {
        /*
        await alert({
          message: '요청한 리소스를 찾을 수 없습니다. 관리자에게 문의하세요.',
        });

         */
      } else if (error.response.status === 500) {
        /*
        await alert({
          message: '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        });
         */
      } else {
        /*
        await alert({
          message:
            error.response.data.code + ' : ' + error.response.data.message,
        });
         */
      }
    } else if (error.request) {
      // 요청은 보냈으나 응답 없음
      //alert({ message: '잠시 후 다시 시도해주세요.' });
    } else {
      // 기타 오류 발생
      /*
      await alert({
        message: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
      });
       */
    }

    throw error;
  } finally {
    console.log('FINALLY');
  }
};
