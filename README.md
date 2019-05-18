# rollup-plugin-closure-compile
![Travis CI](https://img.shields.io/travis/com/nebrelbug/rollup-plugin-closure-compile.svg)

Rollup plugin that lets you compile your code with Google Closure Compiler

## Why this plugin?

- Google Closure Compiler is the best JS minifier
- It uses the up-to-date `google-closure-compiler` package on npm, rather than the outdated `google-closure-compiler-js`
- It doesn't require you to have Java installed
- Supports `async`, and has a Babel polyfill for non-ES6 environments

## Install

With Yarn:

```sh
yarn add rollup-plugin-closure-compile
```

With npm:

```sh
npm install rollup-plugin-closure-compile
```

## Usage

```js
import closureCompile from 'closure-compiler-rollup'

// In Rollup config:

plugins: [
    closureCompile({
        level: 'SIMPLE' // Or 'ADVANCED' or 'WHITESPACE_ONLY'
    })
]
```

See the [google-closure-compiler](https://www.npmjs.com/package/google-closure-compiler) repository for information about flags

## Running the tests

```sh
yarn test
```
or
```sh
npm test
```

The tests check:
- That the plugin compiles
- That some things work that are supposed to
- That some things don't work that aren't supposed to
- That sourcemaps are generated correctly
- That the code is styled correctly, with `standard`

### Code Formatting

To format the code:

```sh
yarn format
```

To check formatting:

```sh
yarn test
```

## Built With

- [Babel](https://babeljs.io/) - Transpiling to ES5
- [standard](https://github.com/standard/standard) - Code Formatting
- [np](https://github.com/sindresorhus/np) - For versioning

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

TL;DR:
- Code is styled with `standard`
- Tests should pass

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## Authors

- **Ben Gubler** ([nebrelbug](https://github.com/nebrelbug))

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## Release History

* 1.0.0
    * Initial release


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Inspiration taken from, and based on:

* [https://github.com/camelaissani/rollup-plugin-closure-compiler-js](https://github.com/camelaissani/rollup-plugin-closure-compiler-js)
* [https://github.com/ampproject/rollup-plugin-closure-compiler](https://github.com/ampproject/rollup-plugin-closure-compiler)
* [https://github.com/rikuayanokozy/rollup-plugin-closure-compiler](https://github.com/rikuayanokozy/rollup-plugin-closure-compiler)
