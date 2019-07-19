export default {
  _config: {
    promiseGenericRes: "CommonRes"
  },
  vue: {
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
    _config: {
      disableEntity: true
    },
    getQiniuToken: {
      req: "", // default
      res: "GetQiniuTokenRes"
    }
  }
}
