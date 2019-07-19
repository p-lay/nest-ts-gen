export default {
  _config: {
    promiseGenericRes: "CommonRes"
  },
  vue: {
    _config: {
      entity: false
    },
    addVue: {
      req: "AddVueReq",
      res: "any",
      _config: {
        req: "AddVueReq",
        res: "any"
      }
    },
    getVue: {
      req: "GetVueReq",
      res: "GetVueRes"
    }
  },
  qiniu: {
    getQiniuToken: {
      req: "", // default
      res: "GetQiniuTokenRes"
    }
  }
}
