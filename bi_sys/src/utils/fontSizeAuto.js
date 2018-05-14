export function fontSizeAuto(fontSize = null) {
  //根据root节点的宽度进行动态设置字体的样式
  let root_width = parseFloat(document.documentElement.style.fontSize);
  !fontSize && console.log('传递参数');
  let nodeFontsize=root_width * parseFloat(fontSize) / 100;
  return nodeFontsize.toFixed(2);
}
