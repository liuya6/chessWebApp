import { fetch } from "@/axios/index";

// 登录
export function goLogin(query) {
  return fetch({
    url: "/auth/login",
    method: "post",
    data: query,
    loading: true
  });
}
// 登出
export function loginOut() {
  return fetch({
    url: "/auth/logout",
    method: "post",
    loading: true
  });
}
// 个人中心
export function userDetail() {
  return fetch({
    url: "/member/index",
    method: "get"
  });
}
// 检查登录状态
export function checkLogin() {
  return fetch({
    url: "/auth/checkLogin",
    method: "get"
  });
}
// 注册准备
export function registerBefore() {
  return fetch({
    url: "/auth/registerBefore",
    method: "get",
    loading: true
  });
}
// 注册
export function register(query) {
  return fetch({
    url: "/auth/register",
    method: "post",
    data: query,
    loading: true
  });
}
//会员中心
export function getMember() {
  return fetch({
    url: "/member/memberLevel",
    method: "get",
    loading: true
  });
}
// 修改登录密码
export function changeUserPwd(query) {
  return fetch({
    url: "/member/resetPassword",
    method: "post",
    data: query,
    loading: true
  });
}
// 修改提现密码
export function changeWithdrawPwd(query) {
  return fetch({
    url: "/member/resetCoinPassword",
    method: "post",
    data: query,
    loading: true
  });
}
// 充值准备
export function rechargeBefore() {
  return fetch({
    url: "/cash/rechargeBefore",
    method: "get",
    loading: true
  });
}
// 充值申请
export function rechargeApply(query) {
  return fetch({
    url: "/cash/rechargeApply",
    method: "post",
    data: query,
    loading: true
  });
}
// 充值提交
export function rechargeSubmit(query) {
  return fetch({
    url: "/cash/rechargeSubmit",
    method: "post",
    data: query,
    loading: true
  });
}
// 绑卡准备
export function bindingBefore() {
  return fetch({
    url: "/member/bindingBefore",
    method: "get",
    loading: true
  });
}
// 我的银行卡
export function getMyBank() {
  return fetch({
    url: "/member/bank",
    method: "get",
    loading: true
  });
}
// 绑定银行卡
export function boundCard(query) {
  return fetch({
    url: "/member/binding",
    method: "post",
    data: query,
    loading: true
  });
}
/* 公告列表 */
export function announcement(query) {
  return fetch({
    url: "/member/notice",
    method: "get",
    params: query,
    loading: true
  });
}
/* 活动申请记录 */
export function activityApplyList(query) {
  return fetch({
    url: "/activity/applyList",
    method: "post",
    data: query,
    loading: true
  });
}
/* 提现 */
export function withdraw(query) {
  return fetch({
    url: "/Cash/withdraw",
    method: "post",
    data: query,
    loading: true
  });
}
// 系统设置 最小提现金额~最大提现金额
export function cashConfigs() {
  return fetch({
    url: "/system/cashConfigs",
    method: "get"
  });
}
// 余额列表
export function thirdGameList() {
  return fetch({
    url: "/game/thirdGameList",
    method: "get",
    loading: true
  });
}
// 游戏余额
export function thirdMoney(query) {
  return fetch({
    url: "/game/thirdMoney",
    method: "post",
    data: query
  });
}
// 一键归户
export function exchangeAllToLottery() {
  return fetch({
    url: "/game/exchangeAllToLottery",
    method: "get",
    loading: true
  });
}
// 余额转换
export function exchangeMoney(query) {
  return fetch({
    url: "/game/exchangeMoney",
    method: "post",
    data: query,
    loading: true
  });
}
// 7日统计
export function statCount() {
  return fetch({
    url: "/cash/statCount",
    method: "post",
    loading: true
  });
}
// 当日统计
export function serchCount(query) {
  return fetch({
    url: "/cash/serchCount",
    method: "get",
    params: query,
    loading: true
  });
}
// 账目类别
export function getCoinType() {
  return fetch({
    url: "/cash/getCoinType",
    method: "post",
    loading: true
  });
}
// 账目类别查询
export function account(query) {
  return fetch({
    url: "/cash/account",
    method: "get",
    params: query,
    loading: true
  });
}
/* 游戏记录游戏列表 */
export function gameRecordList(query) {
  return fetch({
    url: "/game/gameRecordList",
    method: "get",
    params: query,
    loading: true
  });
}
// 游戏记录
export function thirdRecord(query) {
  return fetch({
    url: "/game/thirdRecord",
    method: "get",
    params: query,
    loading: true
  });
}
