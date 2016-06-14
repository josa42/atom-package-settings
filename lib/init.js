"use babel"

import { CompositeDisposable } from 'atom'
import promisify from 'native-promisify'

module.exports = {

  async activate() {
    if (atom.inDevMode()) {
      console.log('activate package-settings')
    }

    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.commands.add('atom-workspace', 'package-settings-show', (event)  => {
      this.showPackageSettings()
    }))

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

    const pkgs = await promisify(atom.packages).getAvailablePackageMetadata()
    pkgs.forEach(pkg => {
      const action = `package-settings:${pkg.name}`
      this.commands.add(atom.commands.add('atom-workspace', action, () => {
        atom.workspace.open(`atom://config/packages/${pkg.name}`)
      }))
    })
  },

  showPackageSettings() {
    let workspace = document.querySelector('atom-workspace')
    atom.commands.dispatch(workspace, 'command-palette:toggle')

    setTimeout(() => {
      let panel = atom.workspace.getModalPanels()
        .find((panel) => panel.visible)
      if (panel) {
        panel.item.filterEditorView.setText('package-settings: ')
      }
    }, 0)
  },

  deactivate() {
    this.subscriptions.dispose()
    this.commands.dispose()
  }
}
