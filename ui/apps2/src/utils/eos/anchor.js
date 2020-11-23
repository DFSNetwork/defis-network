// The required anchor-link includes
import AnchorLink from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'

class AnchorClass {
  constructor() {
    const transport = new AnchorLinkBrowserTransport()
    this.link = new AnchorLink({transport})
  }
  async login() {
    const identity = await this.link.login('apps.defis.network')
    console.log(identity)
  }
}

export const Anchor = new AnchorClass();

// Anchor.login()
