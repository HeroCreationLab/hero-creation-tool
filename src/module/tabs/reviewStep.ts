/*
  Functions used exclusively on the Review tab
*/
import { HeroOption } from '../HeroOption';

class Review {
  mapReviewItems(options: HeroOption[]) {
    $('.review-item').remove();
    let allOptionsFulfilled = true;
    for (const opt of options) {
      allOptionsFulfilled = appendItem(opt) && allOptionsFulfilled;
    }
    if (allOptionsFulfilled) {
      $('#finalSubmit').removeClass('review-submit__errors');
      $('#finalSubmit').addClass('review-submit__ok');
    } else {
      $('#finalSubmit').removeClass('review-submit__ok');
      $('#finalSubmit').addClass('review-submit__errors');
    }
  }
}
const ReviewTab: Review = new Review();
export default ReviewTab;

function appendItem(option: HeroOption): boolean {
  const reviewText = option.getReviewText();
  if (reviewText) {
    // options without reviewText are not shown
    const itemElem = $(
      `<dd class='review-item'>${reviewText} ${option.isFulfilled() ? '' : ' (Missing or invalid)'}</dd>`,
    );
    $(`#review-group-${option.origin}`).after(itemElem);
  }
  return option.isFulfilled();
}
