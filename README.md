#### what it is

`nest-ts-gen` is a code generator to generate back-end nest template code(controller, service, module) and front-end ts type, see in the demo `demo/`

#### requirement

1. `contract/`: write back-end type and controller mapping configuration in the contract folder
2. setup codeGen in your code: setup mapping, output folder and output file name
3. `mkdir` your all output folder, make sure it exist

#### notification

1. `nest-ts-gen` will replace controller output file and module output file, and as you know nest.service is not a template file, so the service file will be keep if exist, and only replace service method and related type :)

#### mapping config

write the key `_config` in the mapping config like this:

```javascript
export default {
  _config: {
    // specify Controller promised common response type, it should be a generic type, // cause response type will be generated as CommonRes or CommonRes<SomeDto>
    promiseGenericRes: "CommonRes"
  },
  // controller, service, entity => we name it as model name
  controller1: {
      // method name
      getStr: {
          // request dto type, you should define it in your contract folder first
          req: 'GetStrRequest'
          // response dto type, define before you write
          res: 'GetStrResponse'
      }
  },
  controller2: {
      _config: {
          // don't generate controller file
          disableController: true,
          // don't generate entity
          disableEntity: true
      }
      getStr: {
          // if you don't write req and res, default req: any and res: _config.promiseGenericRes will be generated
      }
  }

```

and see props in the file `src/type/global.ts`
