/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface BootstrapModelsResponseModelsBaseResponse {
  /** @format int32 */
  code?: number;
  message?: string | null;
}

export interface BootstrapModelsResponseModelsListResponse1InsideCollectorModelsEntitiesInsideList {
  /** @format int32 */
  code?: number;
  message?: string | null;
  data?: InsideCollectorModelsEntitiesInsideList[] | null;
}

export interface BootstrapModelsResponseModelsListResponse1InsideCollectorModelsEntitiesListData {
  /** @format int32 */
  code?: number;
  message?: string | null;
  data?: InsideCollectorModelsEntitiesListData[] | null;
}

export interface BootstrapModelsResponseModelsListResponse1InsideCollectorModelsEntitiesMyLists {
  /** @format int32 */
  code?: number;
  message?: string | null;
  data?: InsideCollectorModelsEntitiesMyLists[] | null;
}

export interface BootstrapModelsResponseModelsSingletonResponse1InsideCollectorModelsEntitiesListDataValue {
  /** @format int32 */
  code?: number;
  message?: string | null;
  data?: InsideCollectorModelsEntitiesListDataValue;
}

export interface BootstrapModelsResponseModelsSingletonResponse1InsideCollectorModelsEntitiesListData {
  /** @format int32 */
  code?: number;
  message?: string | null;
  data?: InsideCollectorModelsEntitiesListData;
}

export interface BootstrapModelsResponseModelsSingletonResponse1SystemCollectionsGenericDictionary2SystemInt32SystemInt32 {
  /** @format int32 */
  code?: number;
  message?: string | null;
  data?: Record<string, number | null>;
}

export interface BootstrapModelsResponseModelsSingletonResponse1SystemString {
  /** @format int32 */
  code?: number;
  message?: string | null;
  data?: string | null;
}

/**
 * [1: Multiple]
 * @format int32
 */
export enum InsideCollectorModelsConstantsListPropertyTag {
  Value1 = 1,
}

/**
 * [1: Number, 2: Input, 3: DateTime, 4: TimeSpan, 5: Select, 6: Date, 7: Text, 8: Image, 9: File, 100: External, 200: Computed]
 * @format int32
 */
export enum InsideCollectorModelsConstantsListPropertyType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value8 = 8,
  Value9 = 9,
  Value100 = 100,
  Value200 = 200,
}

export interface InsideCollectorModelsDtoRequestDataPutRequestModel {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  listId?: number;
  values?: Record<string, string>;
}

export interface InsideCollectorModelsDtoRequestDataReorderRequestModel {
  /** @format int32 */
  dataId?: number;
  /** @format int32 */
  newOrder?: number;
}

export interface InsideCollectorModelsDtoRequestListDataValuePutRequestModel {
  /** @format int32 */
  dataId?: number;
  /** @format int32 */
  propertyId?: number;
  value?: string | null;
}

export interface InsideCollectorModelsDtoRequestListPutRequestModel {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  myListsId?: number;
  /** @maxLength 64 */
  variableName?: string | null;
  /** @maxLength 64 */
  name?: string | null;
  /** @format int32 */
  order?: number;
  description?: string | null;
  dataNameConvention?: string | null;
  /**
   * @format int32
   * @min 0
   * @max 100
   */
  width?: number;
}

export interface InsideCollectorModelsEntitiesInsideList {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  myListsId?: number;
  /** @maxLength 64 */
  variableName?: string | null;
  /** @maxLength 64 */
  name?: string | null;
  /** @format int32 */
  order?: number;
  description?: string | null;
  dataNameConvention?: string | null;
  /**
   * @format int32
   * @min 0
   * @max 100
   */
  width?: number;
  properties?: InsideCollectorModelsEntitiesListProperty[] | null;
  data?: InsideCollectorModelsEntitiesListData[] | null;
}

export interface InsideCollectorModelsEntitiesListData {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  myListsId?: number;
  /** @format int32 */
  listId?: number;
  /** @format int32 */
  order?: number;
  values?: InsideCollectorModelsEntitiesListDataValue[] | null;
}

export interface InsideCollectorModelsEntitiesListDataValue {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  dataId?: number;
  /** @format int32 */
  propertyId?: number;
  value?: string | null;
}

export interface InsideCollectorModelsEntitiesListProperty {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  listId?: number;
  /** @maxLength 64 */
  variableName?: string | null;
  /** @maxLength 64 */
  name?: string | null;
  /** @format int32 */
  order?: number;
  description?: string | null;
  /** [1: Number, 2: Input, 3: DateTime, 4: TimeSpan, 5: Select, 6: Date, 7: Text, 8: Image, 9: File, 100: External, 200: Computed] */
  type?: InsideCollectorModelsConstantsListPropertyType;
  function?: string | null;
  /** @format int32 */
  externalListId?: number | null;
  /** @maxLength 64 */
  group?: string | null;
  /** [1: Multiple] */
  tags?: InsideCollectorModelsConstantsListPropertyTag;
  options?: InsideCollectorModelsEntitiesListPropertyOption[] | null;
  /**
   * @format int32
   * @min 0
   * @max 100
   */
  width?: number;
}

export interface InsideCollectorModelsEntitiesListPropertyOption {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  propertyId?: number;
  /** @format int32 */
  order?: number;
  /** @maxLength 64 */
  label?: string | null;
}

export interface InsideCollectorModelsEntitiesMyLists {
  /** @format int32 */
  id?: number;
  /** @maxLength 64 */
  name?: string | null;
  /** @format int32 */
  order?: number;
  description?: string | null;
  lists?: InsideCollectorModelsEntitiesInsideList[] | null;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data.data;
    });
  };
}

/**
 * @title API
 * @version v1
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Constant
     * @name ConstantList
     * @request GET:/api/constant
     */
    constantList: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/constant`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  myLists = {
    /**
     * No description
     *
     * @tags Data
     * @name GetMyListsData
     * @request GET:/my-lists/{myListsId}/data
     */
    getMyListsData: (myListsId: number, params: RequestParams = {}) =>
      this.request<BootstrapModelsResponseModelsListResponse1InsideCollectorModelsEntitiesListData, any>({
        path: `/my-lists/${myListsId}/data`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags List
     * @name GetListsInMyLists
     * @request GET:/my-lists/{myListsId}/list
     */
    getListsInMyLists: (myListsId: number, params: RequestParams = {}) =>
      this.request<BootstrapModelsResponseModelsListResponse1InsideCollectorModelsEntitiesInsideList, any>({
        path: `/my-lists/${myListsId}/list`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MyLists
     * @name GetAllMyLists
     * @request GET:/my-lists
     */
    getAllMyLists: (params: RequestParams = {}) =>
      this.request<BootstrapModelsResponseModelsListResponse1InsideCollectorModelsEntitiesMyLists, any>({
        path: `/my-lists`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MyLists
     * @name PutMyLists
     * @request PUT:/my-lists
     */
    putMyLists: (data: InsideCollectorModelsEntitiesMyLists, params: RequestParams = {}) =>
      this.request<BootstrapModelsResponseModelsBaseResponse, any>({
        path: `/my-lists`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MyLists
     * @name DeleteMyLists
     * @request DELETE:/my-lists/{id}
     */
    deleteMyLists: (id: number, params: RequestParams = {}) =>
      this.request<BootstrapModelsResponseModelsBaseResponse, any>({
        path: `/my-lists/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  data = {
    /**
     * No description
     *
     * @tags Data
     * @name PutListData
     * @request PUT:/data
     */
    putListData: (data: InsideCollectorModelsDtoRequestDataPutRequestModel, params: RequestParams = {}) =>
      this.request<BootstrapModelsResponseModelsSingletonResponse1InsideCollectorModelsEntitiesListData, any>({
        path: `/data`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Data
     * @name DeleteListData
     * @request DELETE:/data/{id}
     */
    deleteListData: (id: number, params: RequestParams = {}) =>
      this.request<BootstrapModelsResponseModelsBaseResponse, any>({
        path: `/data/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Data
     * @name ReorderListData
     * @request PUT:/data/order
     */
    reorderListData: (data: InsideCollectorModelsDtoRequestDataReorderRequestModel, params: RequestParams = {}) =>
      this.request<
        BootstrapModelsResponseModelsSingletonResponse1SystemCollectionsGenericDictionary2SystemInt32SystemInt32,
        any
      >({
        path: `/data/order`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DataValue
     * @name PutListDataValue
     * @request PUT:/data/value
     */
    putListDataValue: (data: InsideCollectorModelsDtoRequestListDataValuePutRequestModel, params: RequestParams = {}) =>
      this.request<BootstrapModelsResponseModelsSingletonResponse1InsideCollectorModelsEntitiesListDataValue, any>({
        path: `/data/value`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  file = {
    /**
     * No description
     *
     * @tags File
     * @name UploadFile
     * @request POST:/file
     */
    uploadFile: (
      data: {
        /** @format binary */
        file?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<BootstrapModelsResponseModelsSingletonResponse1SystemString, any>({
        path: `/file`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  list = {
    /**
     * No description
     *
     * @tags List
     * @name PutList
     * @request PUT:/list
     */
    putList: (data: InsideCollectorModelsDtoRequestListPutRequestModel, params: RequestParams = {}) =>
      this.request<BootstrapModelsResponseModelsBaseResponse, any>({
        path: `/list`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags List
     * @name ReorderLists
     * @request PUT:/list/order
     */
    reorderLists: (data: InsideCollectorModelsDtoRequestDataReorderRequestModel, params: RequestParams = {}) =>
      this.request<
        BootstrapModelsResponseModelsSingletonResponse1SystemCollectionsGenericDictionary2SystemInt32SystemInt32,
        any
      >({
        path: `/list/order`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags List
     * @name DeleteList
     * @request DELETE:/list/{id}
     */
    deleteList: (id: number, params: RequestParams = {}) =>
      this.request<BootstrapModelsResponseModelsBaseResponse, any>({
        path: `/list/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  property = {
    /**
     * No description
     *
     * @tags Property
     * @name PutListProperty
     * @request PUT:/property
     */
    putListProperty: (data: InsideCollectorModelsEntitiesListProperty, params: RequestParams = {}) =>
      this.request<BootstrapModelsResponseModelsBaseResponse, any>({
        path: `/property`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name ReorderProperties
     * @request PUT:/property/order
     */
    reorderProperties: (data: InsideCollectorModelsDtoRequestDataReorderRequestModel, params: RequestParams = {}) =>
      this.request<
        BootstrapModelsResponseModelsSingletonResponse1SystemCollectionsGenericDictionary2SystemInt32SystemInt32,
        any
      >({
        path: `/property/order`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name DeleteListProperty
     * @request DELETE:/property/{id}
     */
    deleteListProperty: (id: number, params: RequestParams = {}) =>
      this.request<BootstrapModelsResponseModelsBaseResponse, any>({
        path: `/property/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PropertyOption
     * @name ReorderPropertyOptions
     * @request PUT:/property/option/order
     */
    reorderPropertyOptions: (
      data: InsideCollectorModelsDtoRequestDataReorderRequestModel,
      params: RequestParams = {},
    ) =>
      this.request<
        BootstrapModelsResponseModelsSingletonResponse1SystemCollectionsGenericDictionary2SystemInt32SystemInt32,
        any
      >({
        path: `/property/option/order`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
