/*
  Functions used exclusively on the Background tab
*/
import * as Utils from '../utils';
import * as Constants from '../constants';
import { Step, StepEnum } from '../Step';
import * as HeroOption from '../HeroOption';
import { Skill, SkillLabel } from '../types/Skill';

class _BackgroundTab extends Step {
  constructor() {
    super(StepEnum.Background);
  }

  section = () => $('#backgroundDiv');

  setListeners(): void {
    /* IMPLEMENT AS NEEDED */
  }

  setSourceData(): void {
    /* IMPLEMENT AS NEEDED */
  }

  async renderData() {
    // show rules on the side panel
    const backgroundRulesItem = await Utils.getJournalFromCompendiumByName(
      Constants.DND5E_COMPENDIUMS.RULES,
      'Backgrounds',
    );
    $('[data-hct_background_description]', this.section()).html(
      TextEditor.enrichHTML((backgroundRulesItem as any).content),
    );

    // create skills
    const $skillArea = $('[data-hct_area=proficiences]', this.section());
    const skillOptions: { key: string; value: string }[] = Object.values(Skill).map((s) => {
      return { key: s, value: game.i18n.localize(SkillLabel[s as Skill]) };
    });
    const skillsContainer: HeroOption.Container = new HeroOption.Container(
      game.i18n.localize('HCT.Common.SkillProficiencies'),
      [
        new HeroOption.Selectable(this.step, 'key', skillOptions, '', true),
        new HeroOption.Selectable(this.step, 'key', skillOptions, '', true),
      ],
    );
    skillsContainer.render($skillArea);
    this.stepOptions.push(...skillsContainer.options);

    const toolsContainer: HeroOption.Container = new HeroOption.Container(game.i18n.localize('DND5E.TraitToolProf'), [
      // options
    ]);
    toolsContainer.render($skillArea);
    this.stepOptions.push(...toolsContainer.options);

    const languagesContainer: HeroOption.Container = new HeroOption.Container(
      game.i18n.localize('HCT.Common.LanguageProficiencies'),
      [
        // options
      ],
    );
    languagesContainer.render($skillArea);
    this.stepOptions.push(...languagesContainer.options);
  }
}
const BackgroundTab: Step = new _BackgroundTab();
export default BackgroundTab;
