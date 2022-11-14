const curURL = window.location.href

// 跳转
const redirect = (fakeURLStr, trueURLParam) => {
  const fakeURL = new URL(fakeURLStr)
  let trueURL = fakeURL.searchParams.get(trueURLParam)
  if (!trueURL) return
  if (trueURL.indexOf('http://') !== 0 && trueURL.indexOf('https://') !== 0) {
    trueURL = 'https://' + trueURL
  }
  window.location.replace(trueURL)
}

// 是否匹配
const match = (pattern, enableRegex = false) => {
  // 移除协议
  const removeProtocol = str => {
    return str.replace(/^https?\??:\/\//gm, '')
  }
  const curURLProto = removeProtocol(curURL)
  pattern = removeProtocol(pattern)

  if (enableRegex) return curURLProto.search(pattern) > -1

  return curURLProto.indexOf(pattern) === 0
}

const fakes = {
  weibo: {
    match: 'http://t.cn/',
    redirect() {
      const link = document.querySelector('.open-url').children[0].href
      if (!link) return
      window.location.replace(link)
    }
  },
  weibo_2: { match: 'https://weibo.cn/sinaurl?u', redirect: 'u' },
  weibo_3: { match: 'https://weibo.cn/sinaurl?toasturl', redirect: 'toasturl' },
  weibo_4: {
    match: 'https://weibo.cn/sinaurl?',
    redirect() {
      const link = document.querySelector('.open-url').children[0].href
      if (!link) return
      window.location.replace(link)
    }
  },
  jianshu: { match: 'https://www.jianshu.com/go-wild?', redirect: 'url' },
  zhihu: { match: 'https://link.zhihu.com/?', redirect: 'target' },
  douban: { match: 'https://www.douban.com/link2/?url=', redirect: 'url' },
  csdn: { match: 'https://link.csdn.net/?target=', redirect: 'target' },
  steam: { match: 'https://steamcommunity.com/linkfilter/?url=', redirect: 'url' },
  oschina: { match: 'https://www.oschina.net/action/GoToLink?url=', redirect: 'url' },
  weixindev: { match: 'https://developers.weixin.qq.com/community/middlepage/href?href=', redirect: 'href' },
  qqdocs: { match: 'https://docs.qq.com/scenario/link.html?url=', redirect: 'url' },
  pixiv: { match: 'https://www.pixiv.net/jump.php?url=', redirect: 'url' },
  qq: { match: 'https://c.pc.qq.com/(middlem|index).html', redirect: 'pfurl', enableRegex: true },
  yuque: { match: 'https://www.yuque.com/r/goto?url=', redirect: 'url' },
  juejin: { match: 'https://link.juejin.cn/?target=', redirect: 'target' },
  tieba: {
    match: 'https://jump2.bdimg.com/safecheck/index?url=',
    redirect() {
      window.location.replace(document.getElementsByClassName('btn')[0].getAttribute('href'))
    }
  },
  zaker: {
    match: 'http://iphone.myzaker.com/zaker/link.php?',
    redirect: 'url'
  },
  qqmail: { match: 'https://mail.qq.com/cgi-bin/readtemplate', redirect: 'gourl' },
  gitee: { match: 'https://gitee.com/link?target=', redirect: 'target' },
  infoq: { match: 'https://xie.infoq.cn/link?target=', redirect: 'target' },
  leetcode: { match: 'https://leetcode.cn/link/?target', redirect: 'target' }
}

const start = () => {
  console.log(1)
  for (let key in fakes) {
    const fake = fakes[key]
    if (match(fake.match, fake.enableRegex)) {
      switch (typeof fake.redirect) {
        case 'string':
          redirect(curURL, fake.redirect)
          break
        case 'function':
          fake.redirect()
          break
        default:
          console.log(`${key} redirect rule error!`)
          break
      }
    }
  }
}

window.addEventListener('load', () => start())
