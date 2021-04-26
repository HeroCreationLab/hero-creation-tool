/*
  Functions used exclusively on the Review tab
*/
import { DataError } from '../types/DataError';

class Review {
  mapReviewItems(items: DataError[]) {
    $('.review-item').remove();
    if (items.length > 0) {
      $('#finalSubmit').removeClass('review-submit__ok');
      $('#finalSubmit').addClass('review-submit__errors');
    } else {
      $('#finalSubmit').removeClass('review-submit__errors');
      $('#finalSubmit').addClass('review-submit__ok');
    }
    for (const item of items) {
      appendItem(item);
    }
  }
}
const ReviewTab: Review = new Review();
export default ReviewTab;

function appendItem(item: DataError) {
  const itemElem = $(`<dd class='review-item'>${game.i18n.localize(item.message)}</dd>`);
  $(`#review-group-${item.step}`).after(itemElem);
}
