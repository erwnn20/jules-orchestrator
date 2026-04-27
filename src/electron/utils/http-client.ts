import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestHeaders
} from 'axios'


export class HttpClient {
  private readonly client: AxiosInstance

  constructor(
    baseUrl: string,
    token: string,
    tokenApplication?: ((token: string) => RawAxiosRequestHeaders) | 'default'
  ) {
    const authHeaders = tokenApplication
      ? tokenApplication === 'default'
        ? { Authorization: `Bearer ${token}` }
        : tokenApplication(token)
      : {}

    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    })

    this.client.interceptors.response.use(
      res => res,
      err => {
        const status = err.response?.status
        const path = err.config?.url ?? 'unknown'
        throw new Error(`HTTP ${status ?? 'unknown'} — ${path}: ${err.message}`)
      }
    )
  }

  async request<T, D = unknown>(args: {
    method: HttpNoBodyMethod, path: string, config?: AxiosRequestConfig<D>
  }): Promise<AxiosResponse<T>>;
  async request<T, D = unknown>(args: {
    method: HttpBodyMethod, path: string, body?: D, config?: AxiosRequestConfig<D>
  }): Promise<AxiosResponse<T>>;
  async request<T, D = unknown>({ method, path, body, config }: {
    method: HttpMethod, path: string, body?: D, config?: AxiosRequestConfig<D>
  }) {
    const noBody = method === 'get' || method === 'delete'
    return noBody
      ? this.client[method]<T, AxiosResponse<T>, D>(path, config)
      : this.client[method]<T, AxiosResponse<T>, D>(path, body, config)
  }

  async get<T, D = unknown>({ path, config }: {
    path: string,
    config?: AxiosRequestConfig<D>
  }) {
    return this.request<T, D>({ method: 'get', path, config })
    // const response = await this.client.get<T>(path, config)
    // return response.data
  }

  async post<T, D = unknown>({ path, body, config }: {
    path: string,
    body?: D,
    config?: AxiosRequestConfig<D>
  }) {
    return this.request<T, D>({ method: 'post', path, body, config })
    // const response = await this.client.post<T>(path, body, config)
    // return response.data
  }

  async put<T, D = unknown>({ path, body, config }: {
    path: string,
    body?: D,
    config?: AxiosRequestConfig<D>
  }) {
    return this.request<T, D>({ method: 'put', path, body, config })
    // const response = await this.client.put<T>(path, body, config)
    // return response.data
  }

  async patch<T, D = unknown>({ path, body, config }: {
    path: string,
    body?: D,
    config?: AxiosRequestConfig<D>
  }) {
    return this.request<T, D>({ method: 'patch', path, body, config })
    // const response = await this.client.patch<T>(path, body, config)
    // return response.data
  }

  async delete<T, D = unknown>({ path, config }: {
    path: string,
    config?: AxiosRequestConfig<D>
  }) {
    return this.request<T, D>({ method: 'delete', path, config })
    // const response = await this.client.delete<T>(path, config)
    // return response.data
  }
}

type HttpNoBodyMethod = 'get' | 'delete'
type HttpBodyMethod = 'post' | 'put' | 'patch'
type HttpMethod = HttpBodyMethod | HttpNoBodyMethod
