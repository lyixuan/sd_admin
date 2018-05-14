import {fontSizeAuto} from "./fontSizeAuto";

export function breakStr(value) {           //字符串换行
  let ret = ''; //拼接加\n返回的类目项
  let maxLength = 1; //每项显示文字个数
  let valLength = value.length; //X轴类目项的文字个数
  let rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
  if (rowN > 1) //如果类目项的文字大于3,
  {
    for (var i = 0; i < rowN; i++) {
      var temp = ""; //每次截取的字符串
      var start = i * maxLength; //开始截取的位置
      var end = start + maxLength; //结束截取的位置
      //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
      temp = value.substring(start, end) + "\n";
      ret += temp; //凭借最终的字符串
    }
    return ret;
  } else {
    return value;
  }
};

function pointStyle(color) {
  return {
    width: 7,
    height: 7,
    color: color,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 500,
    align: 'center',
  }
}

//formater定义的方法,,竖状圆柱处理label方法
export function circer_formater_shu(chain) {
  const color = chain > 0 ? '#7ED321' : chain === 0 ? '#FFE000' : '#FF5959';

  return {
    formatter: function (val) {
      // 待解决
      return val.value + '{circle|' + '•' + '}'
    },
    rich: {
      circle: pointStyle(color),
    },
  }
};

//formater定义的方法,,横状圆柱处理label方法
export function circer_formater_heng( chain,rankNum, fontSize) {
  const color = chain > 0 ? '#7ED321' : chain === 0 ? '#FFE000' : '#FF5959';

  return {
    formatter: function (val) {
      return `第${rankNum}名: ${val.value}{circle|•}`
    },
    rich: {
      circle: pointStyle(color),
    },
    // textStyle: {fontSize: fontSize}
  }
};

//处理轴数据显示,换行
export function axis_name_haddle(color, aXisName, value) {
  return {
    formatter: function (val) {
      return '{circle|' + breakStr(aXisName) + '}';
    },
    rich: {
      circle: {
        color: color,
        fontSize: fontSizeAuto(16),
      },
    },
  }
};

export function axis_name_haddle_nobreak(color, aXisName, fontSize) {
  return {
    formatter: function (val) {
      return '{circle|' + aXisName + '}';
    },
    rich: {
      circle: {
        color: color,
        fontSize: fontSize,
      },
    },
  }
};

export function echart_format_title(paramsObj, chartName) {
  return `${{1: '学分均分', 2: '正面均分', 3: '负面均分'}[paramsObj.creditType]}-${{
    1: '学院',
    2: '家族', 3: '小组'
  }[paramsObj.groupType]}(${{
    selfExam: '自考',
    barrier: '壁垒', incubator: '孵化器'
  }[chartName]})`
}

