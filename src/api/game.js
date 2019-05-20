import { fetch } from "@/axios/index";

// 全部游戏
export function hallBefore() {
  return fetch({
    url: "/Game/hall",
    method: "get",
    loading: true
  });
}
// 游戏分类
export function hallType(query) {
  return fetch({
    url: "/game/hallType",
    method: "get",
    params: query,
    loading: true
  });
}
// 查询游戏
export function serchGame(query) {
  return fetch({
    url: "/game/serchGame",
    method: "get",
    params: query,
    loading: true
  });
}
// 游戏记录列表
export function GameRecordList() {
  return fetch({
    url: "/game/gameRecordList",
    method: "get",
    loading: true
  });
}
// 查询棋牌游戏记录
export function chessRecord(query) {
  return fetch({
    url: "/Game/chessRecord",
    method: "get",
    params: query,
    loading: true
  });
}
// 查询电子真人游戏记录
export function thirdRecord(query) {
  return fetch({
    url: "/game/thirdRecord",
    method: "get",
    params: query,
    loading: true
  });
}
