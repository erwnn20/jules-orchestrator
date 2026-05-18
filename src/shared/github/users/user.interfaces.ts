import { RestEndpointMethodTypes } from "@octokit/rest";


export type User = RestEndpointMethodTypes["users"]["list"]["response"]["data"][number]

export type Team = Omit<RestEndpointMethodTypes["teams"]["list"]["response"]["data"][number], 'parent'>
