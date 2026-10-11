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

export interface SerializerDraftResponse {
  participants_count?: number;
  team_application_id?: number;
}

export interface SerializerErrorResponse {
  error?: string;
}

export interface SerializerJerseyNumberRequest {
  jersey_number: number;
}

export interface SerializerLoginRequest {
  /** @example "sever_rep" */
  login: string;
  /** @example "123456" */
  password: string;
}

export interface SerializerLoginResponse {
  access_token?: string;
  expires_at?: string;
  /** @example "Bearer" */
  token_type?: string;
  user?: SerializerUserResponse;
}

export interface SerializerMessageResponse {
  message?: string;
}

export interface SerializerModerateRequest {
  action: "complete" | "reject";
}

export interface SerializerParticipantResponse {
  birth_date?: string;
  city?: string;
  description?: string;
  full_name?: string;
  height_cm?: number;
  id?: number;
  image_url?: string;
  position?: string;
  sport_rank?: string;
  video_url?: string;
}

export interface SerializerRegisterRequest {
  full_name?: string;
  /**
   * @minLength 3
   * @maxLength 50
   */
  login: string;
  /** @minLength 6 */
  password: string;
}

export interface SerializerTeamApplicationDetailResponse {
  average_age?: number;
  coach_name?: string;
  competition_date?: string;
  completed_at?: string;
  created_at?: string;
  creator_login?: string;
  formed_at?: string;
  id?: number;
  institution?: string;
  moderator_login?: string;
  participants?: SerializerTeamApplicationParticipantResponse[];
  participants_count?: number;
  status?: string;
  team_name?: string;
}

export interface SerializerTeamApplicationParticipantResponse {
  birth_date?: string;
  city?: string;
  description?: string;
  full_name?: string;
  height_cm?: number;
  id?: number;
  image_url?: string;
  jersey_number?: number;
  position?: string;
  sport_rank?: string;
  video_url?: string;
}

export interface SerializerTeamApplicationResponse {
  average_age?: number;
  coach_name?: string;
  competition_date?: string;
  completed_at?: string;
  created_at?: string;
  creator_login?: string;
  formed_at?: string;
  id?: number;
  institution?: string;
  moderator_login?: string;
  participants_count?: number;
  status?: string;
  team_name?: string;
}

export interface SerializerTeamApplicationUpdateRequest {
  coach_name?: string;
  /** @example "2026-11-20" */
  competition_date?: string;
  institution?: string;
  team_name?: string;
}

export interface SerializerUpdateMeRequest {
  full_name?: string;
  password?: string;
}

export interface SerializerUserResponse {
  full_name?: string;
  id?: number;
  is_organizer?: boolean;
  login?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title VolleyReg API
 * @version 1.0
 * @contact
 *
 * Регистрация участников на спортивное соревнование (Первенство ЗГУ по волейболу 2026): участники, заявки команд, состав заявки, пользователи.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  participants = {
    /**
     * @description Действующие участники с фильтрацией по ФИО и амплуа. Доступно гостю.
     *
     * @tags Участники
     * @name ParticipantsList
     * @summary Список участников
     * @request GET:/api/participants
     */
    participantsList: (
      query?: {
        /** фрагмент ФИО */
        participant_name?: string;
        /** амплуа (Связующая, Либеро, ...) */
        position?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SerializerParticipantResponse[], any>({
        path: `/api/participants`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Новый участник с фото и коротким видео. Файлы сохраняются в Minio под латинскими именами. Только организатор.
     *
     * @tags Участники
     * @name ParticipantsCreate
     * @summary Добавить участника
     * @request POST:/api/participants
     * @secure
     */
    participantsCreate: (
      data: {
        /** ФИО */
        full_name: string;
        /** описание */
        description: string;
        /** дата рождения YYYY-MM-DD */
        birth_date: string;
        /** амплуа */
        position: string;
        /** рост, см */
        height_cm: number;
        /** спортивный разряд */
        sport_rank: string;
        /** город */
        city: string;
        /**
         * фото
         * @format binary
         */
        image?: File;
        /**
         * короткое видео
         * @format binary
         */
        video?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<SerializerParticipantResponse, SerializerErrorResponse>({
        path: `/api/participants`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Участники
     * @name ParticipantsDetail
     * @summary Один участник
     * @request GET:/api/participants/{id}
     */
    participantsDetail: (id: number, params: RequestParams = {}) =>
      this.request<SerializerParticipantResponse, SerializerErrorResponse>({
        path: `/api/participants/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  teamApplications = {
    /**
     * @description Без удалённых и черновиков. Представитель видит только свои заявки, организатор — все.
     *
     * @tags Заявки команд
     * @name TeamApplicationsList
     * @summary Список заявок
     * @request GET:/api/team-applications
     * @secure
     */
    teamApplicationsList: (
      query?: {
        /** статус: formed, completed, rejected */
        status?: string;
        /** дата формирования с (YYYY-MM-DD) */
        formed_from?: string;
        /** дата формирования по (YYYY-MM-DD) */
        formed_to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SerializerTeamApplicationResponse[], SerializerErrorResponse>({
        path: `/api/team-applications`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description id заявки-черновика текущего представителя и количество участников в ней (без входных параметров).
     *
     * @tags Заявки команд
     * @name TeamApplicationsDraftList
     * @summary Иконка корзины
     * @request GET:/api/team-applications/draft
     * @secure
     */
    teamApplicationsDraftList: (params: RequestParams = {}) =>
      this.request<SerializerDraftResponse, SerializerErrorResponse>({
        path: `/api/team-applications/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет участника в заявку-черновик текущего представителя. Черновик создаётся автоматически.
     *
     * @tags Состав заявки (м-м)
     * @name TeamApplicationsDraftParticipantsCreate
     * @summary Добавить участника в черновик
     * @request POST:/api/team-applications/draft/participants/{participant_id}
     * @secure
     */
    teamApplicationsDraftParticipantsCreate: (participantId: number, params: RequestParams = {}) =>
      this.request<SerializerDraftResponse, SerializerErrorResponse>({
        path: `/api/team-applications/draft/participants/${participantId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Поля заявки и её состав с картинками участников. Представителю доступны только свои заявки.
     *
     * @tags Заявки команд
     * @name TeamApplicationsDetail
     * @summary Одна заявка
     * @request GET:/api/team-applications/{id}
     * @secure
     */
    teamApplicationsDetail: (id: number, params: RequestParams = {}) =>
      this.request<SerializerTeamApplicationDetailResponse, SerializerErrorResponse>({
        path: `/api/team-applications/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Поля по теме (команда, учебное заведение, тренер, дата соревнования). Только черновик своего представителя.
     *
     * @tags Заявки команд
     * @name TeamApplicationsUpdate
     * @summary Изменить поля заявки
     * @request PUT:/api/team-applications/{id}
     * @secure
     */
    teamApplicationsUpdate: (id: number, body: SerializerTeamApplicationUpdateRequest, params: RequestParams = {}) =>
      this.request<SerializerTeamApplicationDetailResponse, SerializerErrorResponse>({
        path: `/api/team-applications/${id}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Логическое удаление: статус deleted, проставляется дата формирования.
     *
     * @tags Заявки команд
     * @name TeamApplicationsDelete
     * @summary Удалить черновик
     * @request DELETE:/api/team-applications/{id}
     * @secure
     */
    teamApplicationsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, SerializerErrorResponse>({
        path: `/api/team-applications/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Представитель формирует черновик: проверяются обязательные поля и рассчитывается средний возраст команды.
     *
     * @tags Заявки команд
     * @name TeamApplicationsFormUpdate
     * @summary Сформировать заявку
     * @request PUT:/api/team-applications/{id}/form
     * @secure
     */
    teamApplicationsFormUpdate: (id: number, params: RequestParams = {}) =>
      this.request<SerializerTeamApplicationDetailResponse, SerializerErrorResponse>({
        path: `/api/team-applications/${id}/form`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Организатор соревнования завершает (complete — допуск) или отклоняет (reject) сформированную заявку.
     *
     * @tags Заявки команд
     * @name TeamApplicationsModerateUpdate
     * @summary Допустить или отклонить заявку
     * @request PUT:/api/team-applications/{id}/moderate
     * @secure
     */
    teamApplicationsModerateUpdate: (id: number, body: SerializerModerateRequest, params: RequestParams = {}) =>
      this.request<SerializerTeamApplicationDetailResponse, SerializerErrorResponse>({
        path: `/api/team-applications/${id}/moderate`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Поле м-м: игровой номер участника в черновике заявки (без PK м-м).
     *
     * @tags Состав заявки (м-м)
     * @name TeamApplicationsParticipantsUpdate
     * @summary Изменить игровой номер
     * @request PUT:/api/team-applications/{id}/participants/{participant_id}
     * @secure
     */
    teamApplicationsParticipantsUpdate: (
      id: number,
      participantId: number,
      body: SerializerJerseyNumberRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, number>, SerializerErrorResponse>({
        path: `/api/team-applications/${id}/participants/${participantId}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Состав заявки (м-м)
     * @name TeamApplicationsParticipantsDelete
     * @summary Убрать участника из заявки
     * @request DELETE:/api/team-applications/{id}/participants/{participant_id}
     * @secure
     */
    teamApplicationsParticipantsDelete: (id: number, participantId: number, params: RequestParams = {}) =>
      this.request<void, SerializerErrorResponse>({
        path: `/api/team-applications/${id}/participants/${participantId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  users = {
    /**
     * @description Проверяет логин и пароль и выдаёт JWT. Токен передаётся в заголовке Authorization: Bearer <токен>.
     *
     * @tags Пользователи
     * @name UsersLoginCreate
     * @summary Аутентификация
     * @request POST:/api/users/login
     */
    usersLoginCreate: (body: SerializerLoginRequest, params: RequestParams = {}) =>
      this.request<SerializerLoginResponse, SerializerErrorResponse>({
        path: `/api/users/login`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Отзывает текущий JWT: его идентификатор (jti) помещается в чёрный список Redis до конца срока действия.
     *
     * @tags Пользователи
     * @name UsersLogoutCreate
     * @summary Деавторизация
     * @request POST:/api/users/logout
     * @secure
     */
    usersLogoutCreate: (params: RequestParams = {}) =>
      this.request<SerializerMessageResponse, SerializerErrorResponse>({
        path: `/api/users/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Пользователи
     * @name UsersMeList
     * @summary Профиль текущего пользователя
     * @request GET:/api/users/me
     * @secure
     */
    usersMeList: (params: RequestParams = {}) =>
      this.request<SerializerUserResponse, SerializerErrorResponse>({
        path: `/api/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Меняет ФИО и/или пароль текущего пользователя.
     *
     * @tags Пользователи
     * @name UsersMeUpdate
     * @summary Изменение профиля
     * @request PUT:/api/users/me
     * @secure
     */
    usersMeUpdate: (body: SerializerUpdateMeRequest, params: RequestParams = {}) =>
      this.request<SerializerUserResponse, SerializerErrorResponse>({
        path: `/api/users/me`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт представителя команды. Пароль хранится в виде bcrypt-хэша.
     *
     * @tags Пользователи
     * @name UsersRegisterCreate
     * @summary Регистрация пользователя
     * @request POST:/api/users/register
     */
    usersRegisterCreate: (body: SerializerRegisterRequest, params: RequestParams = {}) =>
      this.request<SerializerUserResponse, SerializerErrorResponse>({
        path: `/api/users/register`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
