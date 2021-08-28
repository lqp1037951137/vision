const name2pinyin = {
  安徽: 'anhui',
  陕西: 'shanxi1',
  澳门: 'aomen',
  北京: 'beijing',
  重庆: 'chongqing',
  福建: 'fujian',
  甘肃: 'gansu',
  广东: 'guangdong',
  广西: 'guangxi',
  贵州: 'guizhou',
  海南: 'hainan',
  河北: 'hebei',
  黑龙江: 'heilongjiang',
  河南: 'henan',
  湖北: 'hubei',
  湖南: 'hunan',
  江苏: 'jiangsu',
  江西: 'jiangxi',
  吉林: 'jilin',
  辽宁: 'liaoning',
  内蒙古: 'neimenggu',
  宁夏: 'ningxia',
  青海: 'qinghai',
  山东: 'shandong',
  上海: 'shanghai',
  山西: 'shanxi',
  四川: 'sichuan',
  台湾: 'taiwan',
  天津: 'tianjin',
  香港: 'xianggang',
  新疆: 'xinjiang',
  西藏: 'xizang',
  云南: 'yunnan',
  浙江: 'zhejiang'
}

export function getProvinceMapInfo(arg) {
  const path = `/static/map/province/${name2pinyin[arg]}.json`
  return {
    key: name2pinyin[arg],
    path: path
  }
}

export function getFormatDate(data, fmt) {

  var o = {
    "M+": data.getMonth() + 1, //月份 
    "d+": data.getDate(), //日 
    "h+": data.getHours(), //小时 
    "m+": data.getMinutes(), //分 
    "s+": data.getSeconds(), //秒 
    "q+": Math.floor((data.getMonth() + 3) / 3), //季度 
    "S": data.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
