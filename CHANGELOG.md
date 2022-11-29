# Changelog

## 1.0.0 (2022-11-29)


### Features

* implement orElse to both option and result ([8987447](https://github.com/gum-tech/kleisi-ts/commit/8987447b3e38ad0b0e68785634ded2e95708305d))
* **option:** add unwrapOrElse operator for options ([cd624d8](https://github.com/gum-tech/kleisi-ts/commit/cd624d81240ecbc0bf2eee52db6f464cb9674ad1))
* **option:** implement map and or combinators for result ([2e46e80](https://github.com/gum-tech/kleisi-ts/commit/2e46e805abcbb2fd64aee7f6702f00ee3279dc78))
* **options:** implemented Option monad for handling null/undefined types ([a85ea9f](https://github.com/gum-tech/kleisi-ts/commit/a85ea9fd0bf2ec0caf66ca3fd10830b81f6f0160))
* **result:** add map, maoErr and bind combinators to result ([1725dad](https://github.com/gum-tech/kleisi-ts/commit/1725dad8e5789ddcf4198c6fca927b08d01a00b7))
* **result:** add unwrap and expect  operators to Result + tests ([a7db726](https://github.com/gum-tech/kleisi-ts/commit/a7db72601f5284c65c8bc2e9998e002b46e2055a))
* **result:** implemented basic version of Result monad for handling exceptions ([ff57f94](https://github.com/gum-tech/kleisi-ts/commit/ff57f9499915c52f919e490678a2138e10e86e07))


### Bug Fixes

* **CI:** removed support for node 10.x ([ea33df2](https://github.com/gum-tech/kleisi-ts/commit/ea33df2765215abe97beb6057ed5bc85f9f1489b))
* **CI:** removed support for node 12.x ([ed15d24](https://github.com/gum-tech/kleisi-ts/commit/ed15d249ef74abedb765109be7d85d043a8f78e4))
* **lint:** fixed lint errors ([997ca89](https://github.com/gum-tech/kleisi-ts/commit/997ca8928e1fbaf39f86af47aa882fb9b877cf8e))
* **typeError:** Cast T as unknown first before casting to Option&lt;T&gt; in flatten() to fix ts compiler complains ([a7dd6d7](https://github.com/gum-tech/kleisi-ts/commit/a7dd6d7df52fd29454bdce5638da6b0c4c7bd8fe))