function queryStringToObject(url) {
  return url
    .match(/([^?=&]+)(=([^&]*))/g)
    .reduce(
      (initial, curr) => (
        (initial[curr.slice(0, curr.indexOf("="))] = curr.slice(
          curr.indexOf("=") + 1
        )),
        initial
      ),
      {}
    );
}

function objectToQueryString(options) {
  return (
    Object.keys(options)
      /*encodeURIComponent 在一些带有特殊字符的情况下会出错, eg: github的api*/
      .map((key) => `${key}=${options[key]}`)
      .join("&")
  );
}

export default { queryStringToObject, objectToQueryString };
