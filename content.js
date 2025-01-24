{
  const targetText = 'Who to follow';

  let lastCheckTime = 0;
  let lastElement = null;
  const CACHE_DURATION = 500;
  const MAX_ELEMENTS = 4;

  //'who-to-follow'セクションを取得する
  function getRecommendElement() {
    let now = Date.now();

    if (lastElement && now - lastCheckTime < CACHE_DURATION) return;

    try {
      const divs = document.querySelectorAll(`div[data-testid="cellInnerDiv"]`);
      // テキスト内容で要素をフィルタリング
      const targetElement = Array.from(divs).find((div) => {
        if (div.textContent === targetText) {
          //targetTextが中に含まれている要素のときはtrueを返して格納
          return true;
        }
      });

      if (targetElement) {
        //取得できたときだけキャッシュしておく
        lastElement = targetElement;
      }
      lastCheckTime = now;

      return targetElement;
    } catch (error) {
      console.log(error);
    }
  }

  function hideRecommend() {
    const recommendSection = getRecommendElement();

    if (!recommendSection) return;

    try {
      // 親要素を取得して非表示化
      const parentDiv = recommendSection.closest(
        'div[data-testid="cellInnerDiv"]'
      );
      if (!parentDiv) return;

      parentDiv.style.display = 'none';

      // 関連する要素も非表示化
      let count = 0;

      let nextSibling = parentDiv.nextElementSibling;

      while (nextSibling && count < MAX_ELEMENTS) {
        if (nextSibling.tagName === 'DIV') {
          nextSibling.style.display = 'none';
          count++;
        }
        nextSibling = nextSibling.nextElementSibling;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // DOMの変更を監視するMutationObserverを設定
  function observeDOM() {
    const targetNode = document.body;
    const config = {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          hideRecommend();
        }
      }
    });

    try {
      observer.observe(targetNode, config);
    } catch (error) {
      console.log(error);
    }
  }

  observeDOM();
}
