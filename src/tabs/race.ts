/*
  Functions used exclusively on the Race tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { DataError } from '../types/DataError.js'
import { Step, StepEnum } from '../types/Step.js'
import Race from '../types/Race.js';
import { Utils } from '../utils.js';
import { Size, SizeLabel } from '../types/Size.js';

class _Race extends Step {
	races: Race[];

	constructor() {
		super(StepEnum.Race);
	}

	setListeners(): void {
		$('[data-hct_race_picker]').on('change', (event) => {
			const raceName = $(event.currentTarget).val();
			const race = this.races.filter(r => r.name === raceName)[0];
			updateValuesForRace(race);
		});
	}

	setSourceData(races: Race[]): void {
		this.races = races;
	}

	renderData(): void {
		$('[data-hct_race_data]').hide();
		setRaceOptions(this.races);
	}

	getErrors(): DataError[] {
		const errors: DataError[] = [];
		if (false) {
			errors.push(this.error("HCT.Err.Key"));
		}
		return errors;
	}

	saveActorData(newActor: HeroData): void {
		console.log(`${Constants.LOG_PREFIX} | Saving Race Tab data into actor`);

		// TBD
	}
}
const RaceTab: Step = new _Race();
export default RaceTab;

function setRaceOptions(races: Race[]) {
	const picker = $('[data-hct_race_picker]');
	for (const race of races) {
		if (!race.parentRace) {
			// race is a primary race
			const subclasses = races.filter((r: Race) => r.parentRace == race);
			if (subclasses.length) {
				// race has classes - make an optgroup
				picker.append($(`<optgroup class='hct_picker_primary hct_picker_primary_group' label='${race.name}'></optgroup>`));
			} else {
				// race is standalone - make an option
				picker.append($(`<option class='hct_picker_primary' value='${race.name}'>${race.name}</option>`));
			}
		} else {
			// race is a subclass - find the parent and append to its optgroup
			$(`[label=${race.parentRace.name}]`, picker).append($(`<option class='hct_picker_secondary' value='${race.name}'>${race.name}</option>`));
		}
	}
}

function updateValuesForRace(race: Race) {
	const $context = $('[data-hct_race_data]');

	updateAbilityScores();
	updateSize();
	updateSenses();
	updateMovement();
	updateProficiencies();

	// Damage interactions

	// Condition interactions

	$context.show();

	function updateProficiencies() {
		const $profSection = $('[data-hct_race_proficiencies]', $context);
		$profSection.empty();
		const profs = race.parentRace ? mergeProficiencies(race.parentRace, race) : race.proficiencies;
		for (const typeKey of Object.keys(profs)) {
			const proficiencyType = (profs as any)[typeKey];
			console.log("> proficiencyType " + typeKey);
			console.log(proficiencyType);
			if (jQuery.isEmptyObject(proficiencyType)) continue;

			for (const key of Object.keys(proficiencyType)) {
				const proficiency = (proficiencyType as any)[key];
				console.log("\t> proficiency " + key);
				console.log(proficiency);
				$profSection.append($('<p>')
					.data({
						movement: proficiency
					})
					.text(`${game.i18n.localize('HCT.Common.Movement.' + key)}: ${proficiency}`)
				);
			}
		}
	}

	function updateMovement() {
		const $movSection = $('[data-hct_race_movement]', $context);
		$movSection.empty();
		const mov = race.parentRace ? { ...race.parentRace.movement, ...race.movement } : race.movement;
		for (const key of Object.keys(mov)) {
			const moveMode = (mov as any)[key];
			$movSection.append($('<p>')
				.data({
					movement: mov
				})
				.text(`${game.i18n.localize('HCT.Common.Movement.' + key)} speed: ${moveMode}ft`)
			);
		}
	}

	function updateSenses() {
		const $sensesArea = $('[data-hct_race_senses_area]', $context);
		const $sensesSection = $('[data-hct_race_senses]', $context);
		$sensesSection.empty();
		const darkvision: number = race.darkvision ? race.darkvision : race.parentRace?.darkvision;
		if (darkvision) {
			$sensesSection.append($('<p>')
				.data({
					darkvision: darkvision
				})
				.text(`Darkvision: ${darkvision}ft`)
			);
			$sensesArea.show();
		} else {
			$sensesArea.hide();
		}
	}

	function updateSize() {
		const $sizeSection = $('[data-hct_race_size]', $context);
		$sizeSection.empty();
		const size: Size = race.size ? race.size : race.parentRace.size;
		$sizeSection.append($('<p>')
			.data({
				size: size
			})
			.text(`${game.i18n.localize(SizeLabel[size])}`)
		);
	}

	function updateAbilityScores() {
		const $asiSection = $('[data-hct_race_abilityScoreImprovements]', $context);
		$asiSection.empty();
		const asis = race.parentRace ? { ...race.parentRace.abilityScoreImprovements, ...race.abilityScoreImprovements } : race.abilityScoreImprovements;
		for (const key of Object.keys(asis)) {
			const asi = (asis as any)[key];
			const abilityText: string = Utils.getAbilityNameByKey(key);
			Array.isArray(asi.bonus) ?
				asi.bonus.map((a: number, index: number) => $asiSection.append($('<p>')
					.data({
						hct_race_asi: `${key}${index}`,
						hct_race_asi_bonus: asi.bonus
					})
					.text(`${abilityText} +${a}`)
				))
				: $asiSection.append($('<p>')
					.data({
						hct_race_asi: key,
						hct_race_asi_bonus: asi.bonus
					})
					.text(`${abilityText} +${asi.bonus}`)
				);
		}
	}
}

function mergeProficiencies(parent: Race, child: Race) {
	return {
		skills: { ...parent.proficiencies.skills, ...child.proficiencies.skills },
		weapons: { ...parent.proficiencies.weapons, ...child.proficiencies.weapons },
		armor: { ...parent.proficiencies.armor, ...child.proficiencies.armor },
		languages: { ...parent.proficiencies.languages, ...child.proficiencies.languages },
		tools: { ...parent.proficiencies.tools, ...child.proficiencies.tools },
	}
}