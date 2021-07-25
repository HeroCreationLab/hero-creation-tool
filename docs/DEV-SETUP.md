# DEV setup

> This module was built using Ghost's [Foundry Factory](https://github.com/ghost-fvtt/foundry-factory), my deepest thanks to him for this wonderful tool + lots of help provided throughout the way!

### Prerequisites

In order to build this module, recent versions of `node` and `npm` are
required. Most likely using `yarn` also works but only `npm` is officially
supported. We recommend using the latest lts version of `node`, which is
`v14.15.5` at the time of writing. If you use `nvm` to manage your `node`
versions, you can simply run

```
nvm install
```

in the project's root directory.

You also need to install the the project's dependencies. To do so, run

```
npm install
```

### Building

You can build the project by running

```
npm run build
```

Alternatively, you can run

```
npm run build:watch
```

to watch for changes and automatically build as necessary. (build:watch requires linking the project to your local foundry installation, explained below)

### Linking the built project to Foundry VTT

In order to provide a fluent development experience, it is recommended to link
the built module to your local Foundry VTT installation's data folder. In
order to do so, first add a file called `foundryconfig.json` to the project root
with the following content:

```
{
  "dataPath": "/absolute/path/to/your/FoundryVTT/Data"
}
```

>If you have troubles with this, try reversing the /'s to \\'s

Then run

```
npm run link-project
```

**On Windows, creating symlinks requires administrator privileges so unfortunately
you need to run the above command in an administrator terminal for it to work.**

### Running the tests

You can run the tests with the following command:

```
npm test
```
