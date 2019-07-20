export default {
  _config: {
    promiseGenericRes: "CommonRes"
  },
  vue: {
    addVue: {
      req: "AddVueReq"
    },
    getVue: {
      req: "GetVueReq",
      res: "GetVueRes"
    }
  },
  qiniu: {
    _config: {
      disableEntity: true
    },
    getQiniuToken: {
      res: "GetQiniuTokenRes"
    }
  },
  resource: {
    _config: {
      disableController: true
    },
    getResource: {
      req: "GetResourceReq",
      res: "GetResourceRes"
    }
  }
}
