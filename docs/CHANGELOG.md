# Hero Creation Tool for Foundry VTT - DnD5e

## 1.5.3 (2021-12-21)
- Added a migration handler to more easily distribute migrations in the future. Each migration will only run once on each world.
- Migration in place that will restart compendium sources for everyone, to fix an incompatibility from how sources were saved on v8 vs v9 (as mentioned above, this should only happen when you first open the world after updating, and never again).

## 1.5.2 (2021-12-11)
- Restyled number of selected spells into a list
- Minor equipment tab fixes

## 1.5.1 (2021-12-11)
- Added module setting to display module button either on actor's directory or on the Create Actor dialog.
- Added increase/decrease buttons on Equipment selections to modify the quantity.
- Styled clickable icons *-the ones that open a popup window-* with a box shadow on hover, to highlight their clickability. Affects avatar, token, any race/class feature (but not the proper Race/Class icon), feat, background feature, equipment, spells.
- Polished styling of Equipment Packs where the deducted cost was not shown after selecting the pack, and it was deceptively showing the individual cost of the pack contents even where those values made no sense within a pack.
- Fixed a bug on Race tab where Feat selection would not reset when changing races.
- Fixed a bug on Class tab where switching classes would reset the class level to 1.
- Fixed a bug on Equipment tab where removing Packs would not return the gold.

## 1.5.0 (2021-12-05)
- Updated module to work with Foundry VTT v9 *(from this version onwards, the module will likely no longer be retrocompatible with version 0.8.x)*
- Fixed some style issues that popped up again on the Sources selection menu [(#57)](https://github.com/HeroCreationLab/hero-creation-tool/issues/57), and took the opportunity to beautify the menu a little with some padding between buttons and properly switching chevrons to reflect the open-closed status of the different sources submenues.

## 1.4.0 (2021-11-26)
- Refactored compendia processing so that it indexes sources and uses the indexes instead - big performance upgrade should be noticeable.
- Some refactoring on how races/subraces are handled - usage should remain the same, but the code is a lot more straightforward now.
- Added module setting for what string to use to cherrypick Fighting Styles ('Fighting Style' by default)
- Added module setting for what items to ignore in Equipment tab. Tab ignores any item with a rarity other than Common, but there's a few punctual magical items on that rarity, plus Unarmed Strikes. The setting allows to customize this.
- Added module setting for what names to ignore as Subrace names.
- Fixed some races inconsistencies [(#53)](https://github.com/HeroCreationLab/hero-creation-tool/issues/53)

## 1.3.2 (2021-10-31)
- Small fix removing the level-up button from character sheets - functionality is still under development and button-rendering code was accidentally left on release.

## 1.3.1 (2021-10-24)
- Small style fix for the compendium selector.

## 1.3.0 (2021-10-24)
- Locked ability score methods behind a DM setting; now the DM can set that all players need to roll, or use Point But, etc, or give them whatever choices considered appropriate.
- Added a selector for creating characters beyond 1st level. For the time been, no multiclass is allowed, and some repeated items might be bugged (like Ability Score Improvements).
- Alongside the higher-level start, the spell selector has been unlocked so now spells from any level (not just cantrips and first level spells) can be selected and tracked. No further automation provided yet (but a near goal is tying up the class level and spell progressions to inform of the maximum spell level based on available slots)

## 1.2.0 (2021-10-07)
- Replaced Race and Class selection dropdowns for a search widget (Interaction is still a little rough, but I think its totally usable). [(#38)](https://github.com/HeroCreationLab/hero-creation-tool/issues/38)
- Added support for Feats. [(#46)](https://github.com/HeroCreationLab/hero-creation-tool/issues/46)

## 1.1.6 (2021-09-26)
- Made window resizable. [(#21)](https://github.com/HeroCreationLab/hero-creation-tool/issues/21)
- Allowed for tabs to scroll as a whole, or split between left/right panels. [(#37)](https://github.com/HeroCreationLab/hero-creation-tool/issues/37)
- Fixed a bug where some items would not open the item popup. [(#22)](https://github.com/HeroCreationLab/hero-creation-tool/issues/22)

## 1.1.5 (2021-09-25)
- Fix for items with active effects not been transferred to the created actor. [(#29)](https://github.com/HeroCreationLab/hero-creation-tool/issues/29)
- Replaced item whitelist for Equipment tab (used to select only "sane" items to buy, avoiding all the magical gear and etc) for a filter on "Common" items and a much, much smaller blacklist of items to actively avoid (namely just spell scrolls, 2 potions and Unarmed Strikes)

## 1.1.4 (2021-09-12)
- Added Japanese translation, courtesy of touge and BrotherSharper.

## 1.1.3 (2021-08-29)
- Fix for subraces of compounded names (like Aquatic Half-Elf). [(#35)](https://github.com/HeroCreationLab/hero-creation-tool/issues/35)

## 1.1.2 (2021-08-28)
- Added missing entry on the manifest for FR localization.

## 1.1.1 (2021-08-28)
- Added French translation, courtesy of @Padhiver.
- Fix for race and class names containing the character '.
- Fix to Armor/Weapon profiencies label on English i18n.

## 1.1.0 (2021-08-03)
- Added a check on user permissions when opening the tool, to prevent players creating their PCs and then been unable to save them. [(#17)](https://github.com/HeroCreationLab/hero-creation-tool/issues/17)
- Fixed an issue that caused the module to stop working if the application name was changed on any i18n file.
- Replaced all i18n reused from DND5e system for local ones, for better internationalization.
- Replaced the Journal names contants used to open the sidepanel rules for keys on the i18n, for Babele. [(#15)](https://github.com/HeroCreationLab/hero-creation-tool/issues/15)
- Several name fixes on the whitelist of items for the Equipment tab. [(#16)](https://github.com/HeroCreationLab/hero-creation-tool/issues/16)

## 1.0.1 (2021-07-28)
- Fixed compendium selection window resizing incorrectly and rendering some options hidden [(#13)](https://github.com/HeroCreationLab/hero-creation-tool/issues/13).
- Corrected styling on Race/Class selector, and properly defaulting to Mystery Man icons when no other image found, as very infant preparation for DDB Importer integration.
- Fixed incorrect naming of tools/weapons/armor on the select [(#12)](https://github.com/HeroCreationLab/hero-creation-tool/issues/12).

## Release 1.0.0 (2021-07-28)
- First release
- Tokenizer integration available from release - Thanks MrPrimate for the support!
- Bug Reporter integration available from release too, for easier and better bug reporting.
- No validations done so far other than a character name is included. This was done on purpose, to give playgroups the flexibility they might need if they need to customize something.

## First Commit (2020-12-19)
