import * as _ from "lodash";

function createAnalitics() {
  let counter = 0;
  let isDestroed = false;

  const listener = () => counter++;
  const debouncedListener = _.debounce(listener, 500, { maxWait: 1000 });

  document.addEventListener("click", debouncedListener);

  return {
    destroy() {
      document.removeEventListener("click", debouncedListener);
    },

    getClick() {
      if (isDestroed) {
        return "Analitics destroed";
      }
      return counter;
    },
  };
}

window.analitics = createAnalitics();