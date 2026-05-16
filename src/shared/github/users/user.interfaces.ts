export interface User {
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

  //

  site_admin: boolean;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  events_url: string;
  received_events_url: string;
  starred_at?: string;
  user_view_type?: string;
}

export interface Team {
  id: number;
  node_id: string;
  url: string;
  members_url: string;
  name: string;
  description: string | null;
  permission: string;
  privacy?: string;
  notification_setting?: string;
  html_url: string;
  repositories_url: string;
  slug: string;
  /** Distinguished Name (DN) that team maps to within LDAP environment */
  ldap_dn?: string;
  type: "enterprise" | "organization";
  organization_id?: number;
  enterprise_id?: number;
}
