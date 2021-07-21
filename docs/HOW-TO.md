# How-To for DMs

## Creating a custom race/subrace/racial feature/class/class feature/background feature/spell

Custom content is added simply by creating compendiums for each type of items handled, and filling them with vanilla Foundry VTT items you create *-items in the foundry meaning - been "entities you link to an actor", not items like a sword of a torch-*. If you already have compendiums with appropriate items, you can just link to them.

After you created and edited an item to your hearts' content, you need to add the item to the appropriate Custom Compendium. On the module settings you will find a list of every possible compendium type; there you need to specify the name of the compendium *-or compendiums, separated by a semi-color character (;)-*.

The module makes some assumptions to understand some things apart, for example in the case where default SRD Races/Subraces/Racial Features are all cramped together on a single 'Racial Features (SRD)' compendium.

Here's a summary of what you need to keep in mind:

- Races are *Feature*-type items with no requirement.
- Subraces are *Feature*-type items with: A) The parent full string as part of the name (e.g. "Metallic Dragonborn" or "Slighty-taller Halfling") and B) the parent race as sole requirement (e.g. requirement "Dragonborn" will make the item a dragonborn subclass).
- Racial Features are *Feature*-type items that have the race/subrace they belong to as their sole requirement (e.g. "High Elf" will make this item an extra, custom feature for High Elves).
- Classes are *Class*-type items with no requirements.
- Class Features are *Feature*-type items with "[class name] [level]" as requirement (e.g. "Warlord 1" will make a feature for a custom class named "Warlord").*
- Background Features are *Feature*-type items that have the "Background" source and a background name as Requirement. All found Background Names will be added to the background selector.
- Spells are *Spell*-type items.*

> \* *Remember that the tool at the moment only assists in making 1st level characters, so things like class features higher-than-first-level or spells other than cantrips and 1st level spells are ignored by the tool for now.*

## Defining what compendiums to use for each item category

The tool will use DnD5e SRD compendiums by default, but you can also include your own compendiums in the module settings. There you will find an entry for each type of compendium supported *-for easier and smarter parsing, the module requires you to set different compendiums for each item category, please follow that rule and don't repeat compendiums between categories-*.

As explained on the "Creating Custom ..." section above, on each entry you can type one or more compendium names, separated by semi-colons. The module will pull those compendiums whenever anyone opens a new Hero Creation Tool window, so you don't need to refresh or anything.

**Compendium names need to be the internal foundry names, not the ones you see on screen on the compendiums tab.** Usually it is the module name (if coming from a module) dot (.) the same name in lowercase, with all spaces replaced by dashes (-). Compendiums created on a given world will be prefixed by "world." instead of a module name. 

> You can type the following on the console to see all loaded packs, just to make sure you got the names right.
>```
>game.packs
>```

## Setting default token attributes (name and hp bar)

On the module settings you will find options to set token name and bar1 behaviors of actors created by the tool. By default, the tool shows actor name as *Hover by Anyone* and hp in bar 1 as *Hover by Owner*.

>The choice of hp on the bar 1 is definitely opinionated, but showing name & HP should cover most cases. If there's demand for further default customization, like replacing hp with some other available attribute, and/or showing something by default on bar 2, it might be added later. Any modifications to the token bars and attributes is beyond the scope of this module.

## Defining the default Starting Gold dice roll

In the module settings you can set up a default gold roll for the Equipment tab. By default, the module sets 5d4 * 10 so you have something ready to use.

## Using Tokenizer for avatars and tokens inside the tool

If you have Tokenizer installed and active (v3.3.1 or newer), the tool allows you to use it instead of the vanilla File Picker. **There is no setup required, just having the module installed, active and the right version.** By default, the module will use Tokenizer as primary option if available, but players can opt-out by shift-clicking the Select buttons or the avatar/token images, just like in a character sheet. You can also disable the integration all together from the Settings.