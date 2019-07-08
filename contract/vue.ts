import { BaseResource } from "./resource"
import { Tag } from "./tag"

export interface BaseVue {
  title: string
  feeling?: string
  resources: BaseResource[]
  tags: Tag[]
  music?: string
}

// user info should be set in request
export interface AddVueReq extends BaseVue {
  user_id: number
}

export interface GetVueReq {
  vue_id: number
}

export interface GetVueRes extends BaseVue {
  vue_id: number
  comments: string[]
  // TODO: should be type User not number
  create_by: number
  create_time: number
  update_time: number
}

export interface UpdateVueReq extends BaseVue {
  vue_id: number
}
