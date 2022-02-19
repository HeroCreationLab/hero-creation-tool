# Hero Creation Tool for Foundry VTT - DnD5e

## 1.7.1 (2022-02-19)
- Updated the fr.json translations to fix a key that was causing a complete failure when using French translations due to a key that had become a nested key. **Please remember that FR localization is deprecated overall as of v1.5.6, this is just a fix to prevent the module from working** [(#91)](https://github.com/HeroCreationLab/hero-creation-tool/issues/91)

## 1.7.0 (2022-02-12)
- ⚠️ **API DEPRECATION WARNING**: Following recommended practices outlined [HERE](https://foundryvtt.wiki/en/development/guides/package-best-practices), the API is being moved from `window.HeroCreationTool` to `game.modules.get('hero-creation-tool')?.api`. Existing API will coexist until `1.8.0` with a deprecation warning.
- Fixed Weapon/Armor/Tools proficiencies if custom base items are defined [(#88)](https://github.com/HeroCreationLab/hero-creation-tool/issues/88)
- Fixed bug where creating a Hero without a race would break trying to set up the token vision level.
- Internal refactor cleanup of constants, localizations, imports and etc.

## 1.6.3 (2022-01-26)
- Added Source settings for what compendia to use for Equipments (default `dnd5e.items`).

## 1.6.2 (2022-01-23)
- Removed ja.json reference on the manifest. Unfortunate leftover from previous update.

## 1.6.1 (2022-01-22)
- Fixed the creation of the tool's button inside the Create New Actor dialog, that was not working for other languagues than English. [(#79)](https://github.com/HeroCreationLab/hero-creation-tool/issues/79)

## 1.6.0 (2022-01-21)
- **IMPORTANT FOR JP USERS** - Japanese localization moved to https://github.com/BrotherSharper/foundryVTTja
- Tool can now be launched using `HeroCreationTool.openForNewActor()` from macros or other modules.
- Sources selector app can be now be launched using `HeroCreationTool.selectSources()` from macros or other modules.
- Refactored sources selector app to use `<details>` for a default collapsible widget instead of using a custom one.
- Removed option to create a **Background Feature** directly from the Background tab - it was a weird leftover as it causes some confusion between Background and Background Feature, and no other tab allowed creation of items directly from the tool, adding some avoidable complexity.
- Fixed bug when Race ability scores get deleted, and show a NaN on the abilities tab (plus a cascading effect of broken ASIs if that happens)
- ⚠️ **WARNING - TEMPORARY**: Added a checkbox on the Background Feature tab to show the feature description on the side, as users mentioned using the features for the whole background and this would allow them to see the skills and etc more easily. **_Please be warned that this will stay only until proper Background items are available on dnd5e; thereafter the background description will be shown on the side, just like for Races and Classes._**
- Module now uses [TailwindCSS](https://tailwindcss.com/) for most of the styling.

## 1.5.6 (2022-01-11)
- **IMPORTANT FOR FR/JP USERS**: starting on this version, the bundled translations are deprecated; hereafter, translations will be maintained in independent modules to allow more flexibility and easier unkeep both on this module and on translation ones. Both translations will remain on the code until the next version after independent translations are available and I can link them here on the changelog, but they will NOT be updated anymore.
- Added a confirmation dialog when clicking the final button, to give users a final call before creating the hero (also, to prevent accidentally hitting Submit midwork and screwing stuff up)
- Added a missing translation on the level selector for Class.
- Fixed a wrong JQuery selection that duplicated the Actor's Directory button each time it was opened as an undocked tab, and also prevented it from appearing on the undocked tab (now it should show on both at the same time normally, without duplicates). [(#73)](https://github.com/HeroCreationLab/hero-creation-tool/issues/73)
- Fixed a bug where the Class level would be created as 1, even thought the HP and features corresponded to the level selected.
- Fixed a bug where Darkvision would apply to the character sheet but not give Dim Sight to the token prototype. [(#58)](https://github.com/HeroCreationLab/hero-creation-tool/issues/58)

## 1.5.5 (2021-12-24)
- Happy Xmas everyone!
- Abilities Tab reworked - now it properly shows whatever Race bonus is present on the Race tab, and auto-calculates total + modifier on every change.
- Point Buy is no longer strictly restricted - before, scores could no longer be increased after reaching 27 points; now it allows whatever the user inputs, though it shows the total points spent vs total allowed as a reference.
- New module setting for customizing the Point Buy limit (default: 27)
- New module setting for customizing ability rolls (default: 4d6kh1)

## 1.5.4 (2021-12-22)
- Added some sanity checks for items taken from compendia to avoid pulling items that can't function as the required source type; this should prevent the tool breaking if any of the compendia had nonconforming data (for example, having a custom compendium with Spells, and placing a Class/Feature there, it would break because those items don't have a `Level` field). In detail:
- Races, Race Features, Class Features, Background Features and Feats check that the type is of type 'feat' (Feature).
- Classes check that the type of items is 'class' (Class)
- Spells check that the type of items is 'spell' (Spell)
- Equipment items check that the type of items is NEITHER 'feat', 'class' or 'spell' (taken from the default Items (SRD) compendium, but it's always good to double check just in case)
- Additionally, Race Features and Class Features check that the item has Requiments not-empty (as it's required to tie them to the corresponding race/class).

## 1.5.3 (2021-12-21)
- Added a migration handler to more easily distribute migrations in the future. Each migration will only run once on each world. Should fix [(#65)](https://github.com/HeroCreationLab/hero-creation-tool/issues/65)
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
