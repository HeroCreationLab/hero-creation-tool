import FixedOption from '../options/fixedOption';
import HeroOption from '../options/heroOption';
import { Step, StepEnum } from './step';

class _Bio extends Step {
  constructor() {
    super(StepEnum.Biography);
  }

  section = () => $('#bioDiv');

  getOptions(): HeroOption[] {
    const options: HeroOption[] = [];

    $('[data-hct_bio_data]', this.section()).map((index, elem) => {
      const $elem = $(elem);
      options.push(
        new FixedOption(StepEnum.Biography, `data.details.${$elem.data('hct_bio_data')}`, $elem.val() as string),
      );
    });
    return options;
  }
}
const BioTab: Step = new _Bio();
export default BioTab;
