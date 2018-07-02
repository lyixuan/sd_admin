export function formatEmail(str) {
  if(str && typeof str==='string'){
    const changeEmail = !str.substring(0, str.indexOf('@'))?str:str.substring(0, str.indexOf('@'));
    return changeEmail;
  }else{
    console.error("传入非字符串数据")
  }

}
