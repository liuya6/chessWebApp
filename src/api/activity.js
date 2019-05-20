import { fetch } from "@/axios/index";

/* 全部活动 */
export function activity(query) {
  return fetch({
    url: "/activity/index",
    method: "get",
    params: query,
    loading: true
  });
}
/* 活动申请 √ */
export function appllyActivity(query) {
  return fetch({
    // url: "/game",
    url: "/activity/apply",
    method: "post",
    data: query,
    loading: true
  });
}
