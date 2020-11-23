// The required anchor-link includes
import AnchorLink from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'

class AnchorClass {
  constructor() {
    this.transport = null
    this.link = null
  }
  init(cb) {
    this.transport = new AnchorLinkBrowserTransport()
    this.link = new AnchorLink({transport: this.transport})
    cb()
  }
  async getIdentity(cb) {
    const identity = await this.link.login('apps.defis.network')
    // console.log(identity)
    const newId = {
      identity: {
        accounts: [{
          authority: identity.account.permissions[0].perm_name,
          blockchain: "eos",
          name: identity.account.account_name
        }]
      }
    }
    cb(newId)
  }
  transaction(params) {
    return new Promise((resolve, reject) => {
      this.link.transact(params).then((res) => {
        // console.log(`Transaction broadcast! Transaction id: ${ res.processed.id }`)
        resolve(res);
      }, err => {
        reject(err)
      })
    })
  }
}

export const Anchor = new AnchorClass();

// Anchor.login()
