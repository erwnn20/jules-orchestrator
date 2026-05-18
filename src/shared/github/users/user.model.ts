export class User {
  readonly id: number
  readonly nodeId: string
  readonly gravatarId?: string

  readonly name?: string
  readonly email?: string
  readonly login: string
  readonly avatarUrl: string
  readonly type: string

  readonly apiUrl: string
  readonly htmlUrl: string
  readonly reposUrl: string

  constructor({
                id,
                node_id,
                gravatar_id,
                name,
                email,
                login,
                avatar_url,
                url,
                html_url,
                repos_url,
                type
              }: UserArgs) {
    this.id = id
    this.nodeId = node_id
    this.gravatarId = gravatar_id || undefined
    this.name = name || undefined
    this.email = email || undefined
    this.login = login
    this.avatarUrl = avatar_url
    this.apiUrl = url
    this.htmlUrl = html_url
    this.reposUrl = repos_url
    this.type = type
  }
}

export interface UserArgs {
  id: number;
  node_id: string;
  gravatar_id: string | null;
  name?: string | null;
  email?: string | null;
  login: string;
  avatar_url: string;
  url: string;
  html_url: string;
  repos_url: string;
  type: string;
}