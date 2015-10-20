"use babel"

import { CompositeDisposable } from 'atom'
import promisify from 'native-promisify'

module.exports = {

  async activate() {
    if (atom.inDevMode()) {
      console.log('activate package-settings')
    }

    this.subscriptions = new CompositeDisposable()

    this.updateCommands()

    this.subscriptions.add(atom.packages.onDidLoadPackage(() => {
      this.updateCommands()
    }))

    this.subscriptions.add(atom.packages.onDidUnloadPackage(() => {
      this.updateCommands()
    }))
  },

  async updateCommands() {

    if (this.commands) {
      this.commands.dispose()
    }
    this.commands = new CompositeDisposable()

    const pkgs = await promisify(atom.packages).getLoadedPackages()
    pkgs.forEach(pkg => {
      const action = `package-settings:${pkg.name}`
      this.subscriptions.add(atom.commands.add('atom-workspace', action, () => {
        atom.workspace.open(`atom://config/packages/${pkg.name}`)
      }))
    })
  },

  deactivate() {
    this.subscriptions.dispose()
    this.commands.dispose()
  }
}
