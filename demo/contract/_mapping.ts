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
  noEntity: {
    _config: {
      disableEntity: true
    },
    getQiniuToken: {
      res: "GetQiniuTokenRes"
    }
  },
  noController: {
    _config: {
      disableController: true
    },
    getQiniuToken: {
      res: "GetQiniuTokenRes"
    }
  }
}
