# Hero Creation Tool for Foundry VTT - DnD5e

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