export default {
  _config: {
    promiseGenericRes: "CommonRes"
  },
  vue: {
    addVue: {
      req: "AddVueReq",
      res: "any",
    },
    getVue: {
      req: "GetVueReq",
      res: "GetVueRes"
    }
  },
  noEntity: {
    _config: {
      disableEntity: true
    },
    getQiniuToken: {
      req: "", // default
      res: "GetQiniuTokenRes"
    }
  },
  noController: {
    _config: {
      disableController: true
    },
    getQiniuToken: {
      req: "", // default
      res: "GetQiniuTokenRes"
    }
  }
}
