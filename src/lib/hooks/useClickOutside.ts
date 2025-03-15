export function clickOutside(node: any, callbackFunction: () => void) {
  const handleClick = (event: MouseEvent) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      callbackFunction();
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    update(newCallbackFunction) {
      callbackFunction = newCallbackFunction;
    },
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
}
