import chai from 'chai'
import { BigNumber as BN } from 'ethers'

chai.Assertion.overwriteMethod(
  'eql',
  (_super) =>
    function (this: any, ...args: any[]) {
      const obj = chai.util.flag(this, 'object')
      if (BN.isBigNumber(obj) || BN.isBigNumber(args[0])) {
        new chai.Assertion(obj.toString()).to.eql(
          args[0].toString(),
          ...args.slice(1)
        )
      } else {
        _super.apply(this, args)
      }
    }
)
