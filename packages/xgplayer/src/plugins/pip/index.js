import { Events, Util, POSITIONS } from '../../plugin'
import { xgIconTips } from '../common/iconTools'
import IconPlugin from '../common/iconPlugin'
import PipIcon from '../assets/pipIcon.svg'
import PipIconExit from '../assets/pipIconExit.svg'
import './index.scss'

/**
 * @description picture-in-picture plugin
 * @doc https://www.w3.org/TR/picture-in-picture/
 * @doc https://developer.apple.com/documentation/webkitjs/adding_picture_in_picture_to_your_safari_media_controls
 */

const PresentationMode = {
  PIP: 'picture-in-picture',
  INLINE: 'inline',
  FULLSCREEN: 'fullscreen'
}

class PIP extends IconPlugin {
  static get pluginName () {
    return 'pip'
  }

  static get defaultConfig () {
    return {
      position: POSITIONS.CONTROLS_RIGHT,
      index: 6,
      showIcon: false
    }
  }

  static checkWebkitSetPresentationMode (video) {
    return typeof video.webkitSetPresentationMode === 'function'
  }

  beforeCreate (args) {
    if (typeof args.player.config.pip === 'boolean') {
      args.config.showIcon = args.player.config.pip
    }
  }

  afterCreate () {
    // 非可用状态不做初始化
    if (!this.isPIPAvailable()) {
      return
    }
    super.afterCreate()
    this.pMode = PresentationMode.INLINE
    this.initPipEvents()
    // 确认开启按钮的情况下才初始化按钮
    if (this.config.showIcon) {
      this.initIcons()
    }
    // video初始化之后再做判断是否显示
    this.once(Events.COMPLETE, () => {
      if (this.config.showIcon) {
        Util.removeClass(this.find('.xgplayer-icon'), 'xg-icon-disable')
        this.bind('click', this.switchPIP)
      }
    })
  }

  registerIcons () {
    return {
      pipIcon: { icon: PipIcon, class: 'xg-get-pip' },
      pipIconExit: { icon: PipIconExit, class: 'xg-exit-pip' }
    }
  }

  initIcons () {
    const { icons } = this
    this.appendChild('.xgplayer-icon', icons.pipIcon)
    this.appendChild('.xgplayer-icon', icons.pipIconExit)
  }

  initPipEvents () {
    const { player } = this
    this.leavePIPCallback = () => {
      // 处理点击x关闭画中画的时候暂停问题
      const paused = player.paused
      Util.setTimeout(this, () => {
        // 使用mediaPlay避免多次触发 playhooks
        !paused && player.mediaPlay()
      }, 0)
      !paused && player.mediaPlay()
      this.setAttr('data-state', 'normal')
      player.emit(Events.PIP_CHANGE, false)
    }

    this.enterPIPCallback = (e) => {
      player.emit(Events.PIP_CHANGE, true)
      this.pipWindow = e.pictureInPictureWindow
      this.setAttr('data-state', 'pip')
    }

    this.onWebkitpresentationmodechanged = (e) => {
      const mode = player.media.webkitPresentationMode
      // 如果在全屏下进入了该逻辑,调用退出全屏处理
      if (this.pMode === PresentationMode.FULLSCREEN && mode !== PresentationMode.FULLSCREEN) {
        player.onFullscreenChange(null, false)
      }
      this.pMode = mode
      if (mode === PresentationMode.PIP) {
        this.enterPIPCallback(e)
      } else if (mode === PresentationMode.INLINE) {
        this.leavePIPCallback(e)
      }
    }

    if (player.media) {
      player.media.addEventListener('enterpictureinpicture', this.enterPIPCallback)
      player.media.addEventListener('leavepictureinpicture', this.leavePIPCallback)
      PIP.checkWebkitSetPresentationMode(player.media) && player.media.addEventListener('webkitpresentationmodechanged', this.onWebkitpresentationmodechanged)
    }
  }

  switchPIP = (e) => {
    if (!this.isPIPAvailable()) {
      return false
    }
    e.stopPropagation()
    if (this.isPip) {
      this.exitPIP()
      this.emitUserAction(e, 'change_pip', { props: 'pip', from: true, to: false })
      this.setAttr('data-state', 'normal')
    } else if (this.player.media.readyState === 4) {
      this.requestPIP()
      this.emitUserAction(e, 'change_pip', { props: 'pip', from: false, to: true })
      this.setAttr('data-state', 'pip')
    }
  }

  /*
   * 进入画中画
  */
  requestPIP () {
    const { player, playerConfig } = this
    if (!this.isPIPAvailable() || this.isPip) {
      return
    }
    try {
      const { poster } = playerConfig
      if (poster) {
        player.media.poster = Util.typeOf(poster) === 'String' ? poster : poster.poster
      }
      PIP.checkWebkitSetPresentationMode(player.media) ? player.media.webkitSetPresentationMode('picture-in-picture') : player.media.requestPictureInPicture()
      return true
    } catch (reason) {
      console.error('requestPiP', reason)
      return false
    }
  }

  /**
   * 退出画中画
   */
  exitPIP () {
    const { player } = this
    try {
      if (this.isPIPAvailable() && this.isPip) {
        PIP.checkWebkitSetPresentationMode(player.media) ? player.media.webkitSetPresentationMode('inline') : document.exitPictureInPicture()
      }
      return true
    } catch (reason) {
      console.error('exitPIP', reason)
      return false
    }
  }

  get isPip () {
    const { player } = this
    return (document.pictureInPictureElement && document.pictureInPictureElement === player.media) || player.media.webkitPresentationMode === PresentationMode.PIP
  }

  isPIPAvailable () {
    const video = this.player.media
    const _isEnabled = Util.typeOf(document.pictureInPictureEnabled) === 'Boolean' ? document.pictureInPictureEnabled : true
    return _isEnabled &&
    ((Util.typeOf(video.disablePictureInPicture) === 'Boolean' && !video.disablePictureInPicture) ||
     (video.webkitSupportsPresentationMode && Util.typeOf(video.webkitSetPresentationMode) === 'Function'))
  }

  destroy () {
    super.destroy()
    const { player } = this
    player.media.removeEventListener('enterpictureinpicture', this.enterPIPCallback)
    player.media.removeEventListener('leavepictureinpicture', this.leavePIPCallback)
    PIP.checkWebkitSetPresentationMode(player.media) && player.media.removeEventListener('webkitpresentationmodechanged', this.onWebkitpresentationmodechanged)
    this.exitPIP()
    this.unbind('click', this.btnClick)
  }

  render () {
    if (!this.config.showIcon || !this.isPIPAvailable()) {
      return
    }
    return `<xg-icon class="xgplayer-pip">
      <div class="xgplayer-icon xg-icon-disable">
      </div>
      ${xgIconTips(this, 'PIP', this.playerConfig.isHideTips)}
    </xg-icon>`
  }
}
export default PIP
