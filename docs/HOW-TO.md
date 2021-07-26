# How-To for DMs

## Creating a custom race/subrace/racial feature/class/class feature/background feature/spell

Custom content is added simply by creating compendia for each type of items handled, filling them with vanilla Foundry VTT items you create *-items in the foundry meaning - been "entities you link to an actor", not items like a sword of a torch-*, and linking to those compendia in the module settings. If you already have compendia with appropriate items, you can just link to them.

After you created and edited an item to your hearts' content, you need to add the item to the appropriate Custom Compendium. On the module settings you will find a button to select all the appropriate compendia for each item type supported.

The module makes some assumptions to understand how to link and differentiate items apart, for example in the case where default SRD Races/Subraces/Racial Features are all cramped together on a single 'Racial Features (SRD)' compendium.

### Here's a summary of what you need to keep in mind:

- Races are *Feature*-type items with no requirement.

- Subraces are *Feature*-type items with: A) The parent full string as part of the name (e.g. "Metallic Dragonborn" or "Slighty-taller Halfling") and B) the parent race as sole requirement (e.g. requirement "Dragonborn" will make the item a dragonborn subclass).

- Racial Features are *Feature*-type items that have the race/subrace they belong to as their sole requirement (e.g. "High Elf" will make this item an extra, custom feature for High Elves).

- Classes are *Class*-type items with no requirements.

- Class Features are *Feature*-type items with "[class name] [level]" as requirement (e.g. "Warlord 1" will make a feature for a custom class named "Warlord").*

- Background Features are *Feature*-type items that have the "Background" source and a background name as Requirement. All found Background Names will be added to the background selector.

- Spells are *Spell*-type items.*

> \* *Please remember that the tool at the moment only assists in making 1st level characters, so things like class features higher-than-first-level or spells other than cantrips and 1st level spells are ignored by the tool for now.*

## Defining what compendia to use for each item category

The tool will use DnD5e SRD compendia by default, but you can also include your own compendia in the module settings. There you will find a button to select entries for each type of compendium supported *-for easier and smarter parsing, the module requires you to set different compendia for each item category, please follow that rule and don't repeat compendia between categories with the sole exception of races/racial features, that are adequately parsed so long as the rules detailed on the previous point are followed-*.

![Selecting Compendia](https://github.com/HeroCreationLab/hero-creation-tool/blob/main/examples/selecting_compendia.webp)

## Setting default token attributes (name and hp bar)

On the module settings you will find options to set token name and bar1 behaviors of actors created by the tool. By default, the tool shows actor name as *Hover by Anyone* and hp in bar 1 as *Hover by Owner*.

>The choice of hp on the bar 1 is definitely opinionated, but showing name & HP should cover most cases. If there's demand for further default customization, like replacing hp with some other available attribute, and/or showing something by default on bar 2, it might be added later. Any modifications to the token bars and attributes is beyond the scope of this module.

## Defining the default Starting Gold dice roll

In the module settings you can set up a default gold roll for the Equipment tab. By default, the module sets 5d4 * 10 so you have something ready to use.

## Using Tokenizer for avatars and tokens inside the tool

If you have Tokenizer installed and active (v3.3.1 or newer), the tool allows you to use it instead of the vanilla File Picker. **There is no setup required, just having the module installed, active and the right version and selecting the option to use it on the module settings.** By default, the module will **NOT** use Tokenizer as primary option, the DM needs to set it on the module settings. If the integration is enabled, players can still opt-out by shift-clicking the Select buttons or the avatar/token images, just like in a character sheet.
