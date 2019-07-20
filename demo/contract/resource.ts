export interface BaseResource {
  url: string
  type?: 'image' | 'video'
  description?: string
}

export interface AddResourceReq {
  resources: BaseResource[]
}

export interface GetResourceReq {
  resource_ids: number[]
}

export interface GetResourceRes {
  resources: ({ id: number } & BaseResource)[]
}

export interface UpdateResourceReq {}
