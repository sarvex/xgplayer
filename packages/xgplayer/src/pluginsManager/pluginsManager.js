/**
* a plugins manager to register and search
**/
const pluginsManager = {
  init (player) {
    // 标记每一个播放器实例
    let cgid = player._pluginInfoId
    if (!cgid) {
      cgid = new Date().getTime()
      player._pluginInfoId = cgid
    }
    if (!this.pluginGroup) {
      this.pluginGroup = {}
    }
    this.pluginGroup[cgid] = {
      '_player': player,
      '_originalOptions': player.config || {}
    }
  },
  /**
  * register a Plugin
  * @param { object } player the plugins install
  * @param { function } plugin the plugin contructor
  * @param { object } options the plugin configuration
  * @return { object } Plugin the plugin instance
  **/
  register (player, plugin, options = {}) {
    if (!player || !plugin || typeof plugin !== 'function' || plugin.prototype === undefined) {
      return
    }
    let cgid = player._pluginInfoId
    if (!this.pluginGroup || !this.pluginGroup[cgid]) {
      this.init(player)
      cgid = player._pluginInfoId
    }
    if (!this.pluginGroup[cgid]._plugins) {
      this.pluginGroup[cgid]._plugins = {}
    }
    const plugins = this.pluginGroup[cgid]._plugins
    const originalOptions = this.pluginGroup[cgid]._originalOptions
    options.player = this.pluginGroup[cgid]._player
    const name = plugin.name
    options.name = name
    for (const item of Object.keys(originalOptions)) {
      if (name.toLowerCase() === item.toLowerCase()) {
        options.config = originalOptions[item]
      } else {
        options.config = {}
      }
    }
    if (!options.root) {
      options.root = player.root
    }
    if (options.disabled && name !== 'dashboard') {
      return null
    }
    // eslint-disable-next-line new-cap
    plugins[name.toLowerCase()] = new plugin(options)
    plugins[name.toLowerCase()].func = plugin
    return plugins[name.toLowerCase()]
  },

  unRegister (cgid, name) {
    try {
      this.pluginGroup[cgid]._plugins[name].destroy()
      this.pluginGroup[cgid]._plugins[name] = null
    } catch (e) {
      this.pluginGroup[cgid]._plugins[name] = null
    }
  },

  findPlugin (player, name) {
    if (!this.pluginGroup) {
      return null;
    }
    const cgid = player._pluginInfoId
    const cName = name.toLowerCase()
    return this.pluginGroup[cgid]._plugins[cName]
  },

  beforeInit (player) {
    if (!this.pluginGroup) {
      return;
    }
    const cgid = player._pluginInfoId
    const plugins = this.pluginGroup[cgid]._plugins
    for (const item of Object.keys(plugins)) {
      if (plugins[item] && plugins[item].beforePlayerInit) {
        plugins[item].beforePlayerInit()
      }
    }
  },

  afterInit (player) {
    if (!this.pluginGroup) {
      return;
    }
    const cgid = player._pluginInfoId
    const plugins = this.pluginGroup[cgid]._plugins
    for (const item of Object.keys(plugins)) {
      if (plugins[item] && plugins[item].afterPlayerInit) {
        plugins[item].afterPlayerInit()
      }
    }
  },

  reRender (player) {
    const cgid = player._pluginInfoId
    const pluginsMap = {}
    const plugins = this.pluginGroup[cgid]._plugins
    for (const item of Object.keys(plugins)) {
      pluginsMap[item] = {
        plugin: plugins[item].func,
        options: plugins[item]._args
      }
      this.unRegister(cgid, item)
    }
    for (const item of Object.keys(pluginsMap)) {
      this.register(cgid, item, pluginsMap[item].plugin, pluginsMap[item].options)
    }
  },

  destroy (player) {
    const cgid = player._pluginInfoId
    const plugins = this.pluginGroup[cgid]._plugins
    for (const item of Object.keys(plugins)) {
      this.unRegister(cgid, item)
    }
    delete this.pluginGroup[cgid]
  }
}
window.pluginsManager = pluginsManager;
export default pluginsManager
