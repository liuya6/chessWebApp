import { fetch } from "@/axios/index";

// 首页数据
export function initHome() {
  return fetch({
    url: "/Index/initHome",
    method: "post",
    loading: true
  });
}
// footer数据
export function ArticleDetail(query) {
  return fetch({
    url: "/system/ArticleDetail",
    method: "get",
    params: query,
    loading: true
  });
}
// 配置项
export function settings() {
  return fetch({
    url: "/system/settings",
    method: "get"
  });
}
