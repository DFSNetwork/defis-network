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
  async login(cb) {
    const identity = await this.link.login('apps.defis.network')
    console.log(identity)
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
}

export const Anchor = new AnchorClass();

// Anchor.login()
