import { User as IUser } from "@github/users/user.interfaces";


export class User {
  readonly id: number
  readonly nodeId: string
  readonly gravatarId: string | null
  readonly name?: string | null
  readonly email?: string | null
  readonly login: string
  readonly avatarUrl: string
  readonly url: string
  readonly htmlUrl: string
  readonly reposUrl: string
  readonly type: string

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
              }: IUser) {
    this.id = id
    this.nodeId = node_id
    this.gravatarId = gravatar_id
    this.name = name
    this.email = email
    this.login = login
    this.avatarUrl = avatar_url
    this.url = url
    this.htmlUrl = html_url
    this.reposUrl = repos_url
    this.type = type
  }
}