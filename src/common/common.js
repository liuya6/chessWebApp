export function nextInput(el) {
  let InputList = document.querySelectorAll(el)[0].childNodes;
  for (let i = 0; i < InputList.length; i++) {
    let inputOne = InputList[i];
    inputOne.index = i;
    inputOne.setAttribute("readonly", true);
    let method = function(e) {
      let next = this.index + 1;
      let last = this.index - 1;
      e = window.event || e;
      this.value = this.value.replace(/\D/g, "");
      if (next > InputList.length - 1) return;
      InputList[next].removeAttribute("readonly");
      if (!this.value && InputList[last] && e.keyCode == 8) {
        InputList[last].focus();
      }
      if (this.value) {
        InputList[next].focus();
      }
    };
    inputOne.onkeyup = method;
  }
  InputList[InputList.length - 1].onkeyup = function(e) {
    e = window.event || e;
    if (e.keyCode == 8) {
      InputList[this.index - 1].focus();
    }
  };
  InputList[0].removeAttribute("readonly");
}
