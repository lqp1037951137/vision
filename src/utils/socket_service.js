export default class SocketService {

  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  ws = null

  callBackMapping = {}

  connected = false //标识是否连接成功了
  sendRetryCount = 0 //记录重试次数
  connectRetryCount = 0 //重新连接尝试次数

  connect() {
    if (!window.WebSocket) {
      return console.log('浏览器不支持websocket');
    }
    this.ws = new WebSocket('ws://localhost:9998')
    this.ws.onopen = () => {
      console.log('连接服务端成功');
      this.connected = true
      this.connectRetryCount = 0
    }
    this.ws.onclose = () => {
      console.log('连接服务端失败');
      this.connected = false
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, this.connectRetryCount * 500);

    }
    this.ws.onmessage = msg => {
      console.log('从服务端获取数据：' + msg.data);
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, recvData)
        } else if (action === 'themeChange') {
          this.callBackMapping[socketType].call(this, recvData)
        }
      }
    }
  }


  //注册回调函数
  registerCallBack(socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }

  //取消回调函数
  unRegisterCallBack(socketType) {
    this.callBackMapping[socketType] = null
  }

  send(data) {
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, this.sendRetryCount * 200);
    }
  }

}
