export function setConfirm() {
  window.onbeforeunload = function() {
    return '您即将离开本页面,确定继续吗?';
  };
}
export function clearConfirm() {
  window.onbeforeunload = function() {};
}
