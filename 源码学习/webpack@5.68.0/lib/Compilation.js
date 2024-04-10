/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

/**
 * dependency：依赖类
 * 	会将模块的 import 和 export 以及导入的变量都当成依赖项来处理，并将其进行依赖项分类，所有依赖项类都存储在 ./dependencies 文件夹中
 *	
 *  -> 对于入口文件，生成一个 EntryDependency 依赖类(保存入口文件的路径等信息)，就会根据这个 EntryDependency 生成 entryModule
 * 	-> 在构建 entryModule 时，通过 AST 分析出 entryModule，得出所有的依赖项
 * 			e.g(./src/index.js)：
 * 				import { test } from './module/module01';
 * 				// .,. 
 * 				export function exportTest() {} 
 * 			就会生成如下依赖项：
 * 				HarmonyImportSideEffectDependency：表示导入模块 -- 存储着导入位置(导入语句在文件中的行号和列号)、导入路径(./module/module01)等信息
 * 				HrrmonyImportSpecifierDependency：表示导入变量(import { test }) -- 存储着导入位置、导入变量名等信息
 * 				HarmonyExportSpecifierDependency：表示导出变量(export function exportTest() {}) -- 同理存储一些信息
 * 
 * 			就会根据这些依赖项采取不同的策略
 */

 /**
	* Module：用于描述每个模块，包含模块的路径信息，模块的构建结果，模块的依赖项等信息
  * 	- 
  */

	/**
	 * Chunk：
	 */

	/**
	 * ChunkGroup：
	 */

	/**
	 * Entrypoint：继承至 ChunkGroup，专门用来描述 entry，除了 ChunkGroup 的相关行为后，还包含以下信息
	 * 	- _runtimeChunk：runtimeChunk，可能有如下情况
	 * 		可能是：
	 * 			- 内嵌到 entryChunk 中，此时就是 entryChunk
	 * 			- 配置了 entry.options.runtime 的话，就是单独的 runtimeChunk
	 * 			- 如果配置了 entry.options.dependOn 的话，那么建立与 entry.options.dependOn 指向的 Entrypoint 关系
	 * 	- _entrypointChunk：entryChunk，表示该 entry 生成的 chunk
	 */
"use strict";

const asyncLib = require("neo-async");
const {
	HookMap,
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncParallelHook
} = require("tapable");
const util = require("util");
const { CachedSource } = require("webpack-sources");
const { MultiItemCache } = require("./CacheFacade");
const Chunk = require("./Chunk");
const ChunkGraph = require("./ChunkGraph");
const ChunkGroup = require("./ChunkGroup");
const ChunkRenderError = require("./ChunkRenderError");
const ChunkTemplate = require("./ChunkTemplate");
const CodeGenerationError = require("./CodeGenerationError");
const CodeGenerationResults = require("./CodeGenerationResults");
const Dependency = require("./Dependency");
const DependencyTemplates = require("./DependencyTemplates");
const Entrypoint = require("./Entrypoint");
const ErrorHelpers = require("./ErrorHelpers");
const FileSystemInfo = require("./FileSystemInfo");
const {
	connectChunkGroupAndChunk,
	connectChunkGroupParentAndChild
} = require("./GraphHelpers");
const {
	makeWebpackError,
	tryRunOrWebpackError
} = require("./HookWebpackError");
const MainTemplate = require("./MainTemplate");
const Module = require("./Module");
const ModuleDependencyError = require("./ModuleDependencyError");
const ModuleDependencyWarning = require("./ModuleDependencyWarning");
const ModuleGraph = require("./ModuleGraph");
const ModuleNotFoundError = require("./ModuleNotFoundError");
const ModuleProfile = require("./ModuleProfile");
const ModuleRestoreError = require("./ModuleRestoreError");
const ModuleStoreError = require("./ModuleStoreError");
const ModuleTemplate = require("./ModuleTemplate");
const RuntimeGlobals = require("./RuntimeGlobals");
const RuntimeTemplate = require("./RuntimeTemplate");
const Stats = require("./Stats");
const WebpackError = require("./WebpackError");
const buildChunkGraph = require("./buildChunkGraph");
const BuildCycleError = require("./errors/BuildCycleError");
const { Logger, LogType } = require("./logging/Logger");
const StatsFactory = require("./stats/StatsFactory");
const StatsPrinter = require("./stats/StatsPrinter");
const { equals: arrayEquals } = require("./util/ArrayHelpers");
const AsyncQueue = require("./util/AsyncQueue");
const LazySet = require("./util/LazySet");
const { provide } = require("./util/MapHelpers");
const WeakTupleMap = require("./util/WeakTupleMap");
const { cachedCleverMerge } = require("./util/cleverMerge");
const {
	compareLocations,
	concatComparators,
	compareSelect,
	compareIds,
	compareStringsNumeric,
	compareModulesByIdentifier
} = require("./util/comparators");
const createHash = require("./util/createHash");
const {
	arrayToSetDeprecation,
	soonFrozenObjectDeprecation,
	createFakeHook
} = require("./util/deprecation");
const processAsyncTree = require("./util/processAsyncTree");
const { getRuntimeKey } = require("./util/runtime");
const { isSourceEqual } = require("./util/source");

/** @template T @typedef {import("tapable").AsArray<T>} AsArray<T> */
/** @typedef {import("webpack-sources").Source} Source */
/** @typedef {import("../declarations/WebpackOptions").EntryDescriptionNormalized} EntryDescription */
/** @typedef {import("../declarations/WebpackOptions").OutputNormalized} OutputOptions */
/** @typedef {import("../declarations/WebpackOptions").StatsOptions} StatsOptions */
/** @typedef {import("../declarations/WebpackOptions").WebpackPluginFunction} WebpackPluginFunction */
/** @typedef {import("../declarations/WebpackOptions").WebpackPluginInstance} WebpackPluginInstance */
/** @typedef {import("./AsyncDependenciesBlock")} AsyncDependenciesBlock */
/** @typedef {import("./Cache")} Cache */
/** @typedef {import("./CacheFacade")} CacheFacade */
/** @typedef {import("./ChunkGroup").ChunkGroupOptions} ChunkGroupOptions */
/** @typedef {import("./Compiler")} Compiler */
/** @typedef {import("./Compiler").CompilationParams} CompilationParams */
/** @typedef {import("./DependenciesBlock")} DependenciesBlock */
/** @typedef {import("./Dependency").DependencyLocation} DependencyLocation */
/** @typedef {import("./Dependency").ReferencedExport} ReferencedExport */
/** @typedef {import("./DependencyTemplate")} DependencyTemplate */
/** @typedef {import("./Entrypoint").EntryOptions} EntryOptions */
/** @typedef {import("./Module").CodeGenerationResult} CodeGenerationResult */
/** @typedef {import("./ModuleFactory")} ModuleFactory */
/** @typedef {import("./ModuleFactory").ModuleFactoryCreateDataContextInfo} ModuleFactoryCreateDataContextInfo */
/** @typedef {import("./ModuleFactory").ModuleFactoryResult} ModuleFactoryResult */
/** @typedef {import("./RequestShortener")} RequestShortener */
/** @typedef {import("./RuntimeModule")} RuntimeModule */
/** @typedef {import("./Template").RenderManifestEntry} RenderManifestEntry */
/** @typedef {import("./Template").RenderManifestOptions} RenderManifestOptions */
/** @typedef {import("./stats/DefaultStatsFactoryPlugin").StatsAsset} StatsAsset */
/** @typedef {import("./stats/DefaultStatsFactoryPlugin").StatsError} StatsError */
/** @typedef {import("./stats/DefaultStatsFactoryPlugin").StatsModule} StatsModule */
/** @typedef {import("./util/Hash")} Hash */
/** @template T @typedef {import("./util/deprecation").FakeHook<T>} FakeHook<T> */
/** @typedef {import("./util/runtime").RuntimeSpec} RuntimeSpec */

/**
 * @callback Callback
 * @param {(WebpackError | null)=} err
 * @returns {void}
 */

/**
 * @callback ModuleCallback
 * @param {(WebpackError | null)=} err
 * @param {Module=} result
 * @returns {void}
 */

/**
 * @callback ModuleFactoryResultCallback
 * @param {(WebpackError | null)=} err
 * @param {ModuleFactoryResult=} result
 * @returns {void}
 */

/**
 * @callback ModuleOrFactoryResultCallback
 * @param {(WebpackError | null)=} err
 * @param {Module | ModuleFactoryResult=} result
 * @returns {void}
 */

/**
 * @callback ExecuteModuleCallback
 * @param {(WebpackError | null)=} err
 * @param {ExecuteModuleResult=} result
 * @returns {void}
 */

/**
 * @callback DepBlockVarDependenciesCallback
 * @param {Dependency} dependency
 * @returns {any}
 */

/** @typedef {new (...args: any[]) => Dependency} DepConstructor */
/** @typedef {Record<string, Source>} CompilationAssets */

/**
 * @typedef {Object} AvailableModulesChunkGroupMapping
 * @property {ChunkGroup} chunkGroup
 * @property {Set<Module>} availableModules
 * @property {boolean} needCopy
 */

/**
 * @typedef {Object} DependenciesBlockLike
 * @property {Dependency[]} dependencies
 * @property {AsyncDependenciesBlock[]} blocks
 */

/**
 * @typedef {Object} ChunkPathData
 * @property {string|number} id
 * @property {string=} name
 * @property {string} hash
 * @property {function(number): string=} hashWithLength
 * @property {(Record<string, string>)=} contentHash
 * @property {(Record<string, (length: number) => string>)=} contentHashWithLength
 */

/**
 * @typedef {Object} ChunkHashContext
 * @property {RuntimeTemplate} runtimeTemplate the runtime template
 * @property {ModuleGraph} moduleGraph the module graph
 * @property {ChunkGraph} chunkGraph the chunk graph
 */

/**
 * @typedef {Object} RuntimeRequirementsContext
 * @property {ChunkGraph} chunkGraph the chunk graph
 * @property {CodeGenerationResults} codeGenerationResults the code generation results
 */

/**
 * @typedef {Object} ExecuteModuleOptions
 * @property {EntryOptions=} entryOptions
 */

/**
 * @typedef {Object} ExecuteModuleResult
 * @property {any} exports
 * @property {boolean} cacheable
 * @property {Map<string, { source: Source, info: AssetInfo }>} assets
 * @property {LazySet<string>} fileDependencies
 * @property {LazySet<string>} contextDependencies
 * @property {LazySet<string>} missingDependencies
 * @property {LazySet<string>} buildDependencies
 */

/**
 * @typedef {Object} ExecuteModuleArgument
 * @property {Module} module
 * @property {{ id: string, exports: any, loaded: boolean }=} moduleObject
 * @property {any} preparedInfo
 * @property {CodeGenerationResult} codeGenerationResult
 */

/**
 * @typedef {Object} ExecuteModuleContext
 * @property {Map<string, { source: Source, info: AssetInfo }>} assets
 * @property {Chunk} chunk
 * @property {ChunkGraph} chunkGraph
 * @property {function(string): any=} __webpack_require__
 */

/**
 * @typedef {Object} EntryData
 * @property {Dependency[]} dependencies dependencies of the entrypoint that should be evaluated at startup
 * @property {Dependency[]} includeDependencies dependencies of the entrypoint that should be included but not evaluated
 * @property {EntryOptions} options options of the entrypoint
 */

/**
 * @typedef {Object} LogEntry
 * @property {string} type
 * @property {any[]} args
 * @property {number} time
 * @property {string[]=} trace
 */

/**
 * @typedef {Object} KnownAssetInfo
 * @property {boolean=} immutable true, if the asset can be long term cached forever (contains a hash)
 * @property {boolean=} minimized whether the asset is minimized
 * @property {string | string[]=} fullhash the value(s) of the full hash used for this asset
 * @property {string | string[]=} chunkhash the value(s) of the chunk hash used for this asset
 * @property {string | string[]=} modulehash the value(s) of the module hash used for this asset
 * @property {string | string[]=} contenthash the value(s) of the content hash used for this asset
 * @property {string=} sourceFilename when asset was created from a source file (potentially transformed), the original filename relative to compilation context
 * @property {number=} size size in bytes, only set after asset has been emitted
 * @property {boolean=} development true, when asset is only used for development and doesn't count towards user-facing assets
 * @property {boolean=} hotModuleReplacement true, when asset ships data for updating an existing application (HMR)
 * @property {boolean=} javascriptModule true, when asset is javascript and an ESM
 * @property {Record<string, string | string[]>=} related object of pointers to other assets, keyed by type of relation (only points from parent to child)
 */

/** @typedef {KnownAssetInfo & Record<string, any>} AssetInfo */

/**
 * @typedef {Object} Asset
 * @property {string} name the filename of the asset
 * @property {Source} source source of the asset
 * @property {AssetInfo} info info about the asset
 */

/**
 * @typedef {Object} ModulePathData
 * @property {string|number} id
 * @property {string} hash
 * @property {function(number): string=} hashWithLength
 */

/**
 * @typedef {Object} PathData
 * @property {ChunkGraph=} chunkGraph
 * @property {string=} hash
 * @property {function(number): string=} hashWithLength
 * @property {(Chunk|ChunkPathData)=} chunk
 * @property {(Module|ModulePathData)=} module
 * @property {RuntimeSpec=} runtime
 * @property {string=} filename
 * @property {string=} basename
 * @property {string=} query
 * @property {string=} contentHashType
 * @property {string=} contentHash
 * @property {function(number): string=} contentHashWithLength
 * @property {boolean=} noChunkHash
 * @property {string=} url
 */

/**
 * @typedef {Object} KnownNormalizedStatsOptions
 * @property {string} context
 * @property {RequestShortener} requestShortener
 * @property {string} chunksSort
 * @property {string} modulesSort
 * @property {string} chunkModulesSort
 * @property {string} nestedModulesSort
 * @property {string} assetsSort
 * @property {boolean} ids
 * @property {boolean} cachedAssets
 * @property {boolean} groupAssetsByEmitStatus
 * @property {boolean} groupAssetsByPath
 * @property {boolean} groupAssetsByExtension
 * @property {number} assetsSpace
 * @property {((value: string, asset: StatsAsset) => boolean)[]} excludeAssets
 * @property {((name: string, module: StatsModule, type: "module" | "chunk" | "root-of-chunk" | "nested") => boolean)[]} excludeModules
 * @property {((warning: StatsError, textValue: string) => boolean)[]} warningsFilter
 * @property {boolean} cachedModules
 * @property {boolean} orphanModules
 * @property {boolean} dependentModules
 * @property {boolean} runtimeModules
 * @property {boolean} groupModulesByCacheStatus
 * @property {boolean} groupModulesByLayer
 * @property {boolean} groupModulesByAttributes
 * @property {boolean} groupModulesByPath
 * @property {boolean} groupModulesByExtension
 * @property {boolean} groupModulesByType
 * @property {boolean | "auto"} entrypoints
 * @property {boolean} chunkGroups
 * @property {boolean} chunkGroupAuxiliary
 * @property {boolean} chunkGroupChildren
 * @property {number} chunkGroupMaxAssets
 * @property {number} modulesSpace
 * @property {number} chunkModulesSpace
 * @property {number} nestedModulesSpace
 * @property {false|"none"|"error"|"warn"|"info"|"log"|"verbose"} logging
 * @property {((value: string) => boolean)[]} loggingDebug
 * @property {boolean} loggingTrace
 * @property {any} _env
 */

/** @typedef {KnownNormalizedStatsOptions & Omit<StatsOptions, keyof KnownNormalizedStatsOptions> & Record<string, any>} NormalizedStatsOptions */

/**
 * @typedef {Object} KnownCreateStatsOptionsContext
 * @property {boolean=} forToString
 */

/** @typedef {KnownCreateStatsOptionsContext & Record<string, any>} CreateStatsOptionsContext */

/** @type {AssetInfo} */
const EMPTY_ASSET_INFO = Object.freeze({});

const esmDependencyCategory = "esm";
// TODO webpack 6: remove
const deprecatedNormalModuleLoaderHook = util.deprecate(
	compilation => {
		return require("./NormalModule").getCompilationHooks(compilation).loader;
	},
	"Compilation.hooks.normalModuleLoader was moved to NormalModule.getCompilationHooks(compilation).loader",
	"DEP_WEBPACK_COMPILATION_NORMAL_MODULE_LOADER_HOOK"
);

// TODO webpack 6: remove
const defineRemovedModuleTemplates = moduleTemplates => {
	Object.defineProperties(moduleTemplates, {
		asset: {
			enumerable: false,
			configurable: false,
			get: () => {
				throw new WebpackError(
					"Compilation.moduleTemplates.asset has been removed"
				);
			}
		},
		webassembly: {
			enumerable: false,
			configurable: false,
			get: () => {
				throw new WebpackError(
					"Compilation.moduleTemplates.webassembly has been removed"
				);
			}
		}
	});
	moduleTemplates = undefined;
};

const byId = compareSelect(
	/**
	 * @param {Chunk} c chunk
	 * @returns {number | string} id
	 */ c => c.id,
	compareIds
);

const byNameOrHash = concatComparators(
	compareSelect(
		/**
		 * @param {Compilation} c compilation
		 * @returns {string} name
		 */
		c => c.name,
		compareIds
	),
	compareSelect(
		/**
		 * @param {Compilation} c compilation
		 * @returns {string} hash
		 */ c => c.fullHash,
		compareIds
	)
);

const byMessage = compareSelect(err => `${err.message}`, compareStringsNumeric);

const byModule = compareSelect(
	err => (err.module && err.module.identifier()) || "",
	compareStringsNumeric
);

const byLocation = compareSelect(err => err.loc, compareLocations);

const compareErrors = concatComparators(byModule, byLocation, byMessage);

/** @type {WeakMap<Dependency, Module & { restoreFromUnsafeCache: Function } | null>} */
const unsafeCacheDependencies = new WeakMap();

/** @type {WeakMap<Module & { restoreFromUnsafeCache: Function }, object>} */
const unsafeCacheData = new WeakMap();

class Compilation {
	/**
	 * Creates an instance of Compilation. 创建“编译”的实例
	 * @param {Compiler} compiler the compiler which created the compilation 创建编译的编译器
	 * @param {CompilationParams} params the compilation parameters 编译参数
	 */
	constructor(compiler, params) {
		this._backCompat = compiler._backCompat; // optinos.experiments.backCompat - 为许多 webpack 4 api 启用后向兼容层，并发出弃用警告。

		const getNormalModuleLoader = () => deprecatedNormalModuleLoaderHook(this);
		/** @typedef {{ additionalAssets?: true | Function }} ProcessAssetsAdditionalOptions */
		/** @type {AsyncSeriesHook<[CompilationAssets], ProcessAssetsAdditionalOptions>} */
		const processAssetsHook = new AsyncSeriesHook(["assets"]);

		let savedAssets = new Set();
		const popNewAssets = assets => {
			let newAssets = undefined;
			for (const file of Object.keys(assets)) {
				if (savedAssets.has(file)) continue;
				if (newAssets === undefined) {
					newAssets = Object.create(null);
				}
				newAssets[file] = assets[file];
				savedAssets.add(file);
			}
			return newAssets;
		};
		processAssetsHook.intercept({
			name: "Compilation",
			call: () => {
				savedAssets = new Set(Object.keys(this.assets));
			},
			register: tap => {
				const { type, name } = tap;
				const { fn, additionalAssets, ...remainingTap } = tap;
				const additionalAssetsFn =
					additionalAssets === true ? fn : additionalAssets;
				const processedAssets = additionalAssetsFn ? new WeakSet() : undefined;
				switch (type) {
					case "sync":
						if (additionalAssetsFn) {
							this.hooks.processAdditionalAssets.tap(name, assets => {
								if (processedAssets.has(this.assets))
									additionalAssetsFn(assets);
							});
						}
						return {
							...remainingTap,
							type: "async",
							fn: (assets, callback) => {
								try {
									fn(assets);
								} catch (e) {
									return callback(e);
								}
								if (processedAssets !== undefined)
									processedAssets.add(this.assets);
								const newAssets = popNewAssets(assets);
								if (newAssets !== undefined) {
									this.hooks.processAdditionalAssets.callAsync(
										newAssets,
										callback
									);
									return;
								}
								callback();
							}
						};
					case "async":
						if (additionalAssetsFn) {
							this.hooks.processAdditionalAssets.tapAsync(
								name,
								(assets, callback) => {
									if (processedAssets.has(this.assets))
										return additionalAssetsFn(assets, callback);
									callback();
								}
							);
						}
						return {
							...remainingTap,
							fn: (assets, callback) => {
								fn(assets, err => {
									if (err) return callback(err);
									if (processedAssets !== undefined)
										processedAssets.add(this.assets);
									const newAssets = popNewAssets(assets);
									if (newAssets !== undefined) {
										this.hooks.processAdditionalAssets.callAsync(
											newAssets,
											callback
										);
										return;
									}
									callback();
								});
							}
						};
					case "promise":
						if (additionalAssetsFn) {
							this.hooks.processAdditionalAssets.tapPromise(name, assets => {
								if (processedAssets.has(this.assets))
									return additionalAssetsFn(assets);
								return Promise.resolve();
							});
						}
						return {
							...remainingTap,
							fn: assets => {
								const p = fn(assets);
								if (!p || !p.then) return p;
								return p.then(() => {
									if (processedAssets !== undefined)
										processedAssets.add(this.assets);
									const newAssets = popNewAssets(assets);
									if (newAssets !== undefined) {
										return this.hooks.processAdditionalAssets.promise(
											newAssets
										);
									}
								});
							}
						};
				}
			}
		});

		/** @type {SyncHook<[CompilationAssets]>} */
		const afterProcessAssetsHook = new SyncHook(["assets"]);

		/**
		 * @template T
		 * @param {string} name name of the hook
		 * @param {number} stage new stage
		 * @param {function(): AsArray<T>} getArgs get old hook function args
		 * @param {string=} code deprecation code (not deprecated when unset)
		 * @returns {FakeHook<Pick<AsyncSeriesHook<T>, "tap" | "tapAsync" | "tapPromise" | "name">>} fake hook which redirects
		 */
		const createProcessAssetsHook = (name, stage, getArgs, code) => {
			if (!this._backCompat && code) return undefined;
			const errorMessage =
				reason => `Can't automatically convert plugin using Compilation.hooks.${name} to Compilation.hooks.processAssets because ${reason}.
BREAKING CHANGE: Asset processing hooks in Compilation has been merged into a single Compilation.hooks.processAssets hook.`;
			const getOptions = options => {
				if (typeof options === "string") options = { name: options };
				if (options.stage) {
					throw new Error(errorMessage("it's using the 'stage' option"));
				}
				return { ...options, stage: stage };
			};
			return createFakeHook(
				{
					name,
					/** @type {AsyncSeriesHook<T>["intercept"]} */
					intercept(interceptor) {
						throw new Error(errorMessage("it's using 'intercept'"));
					},
					/** @type {AsyncSeriesHook<T>["tap"]} */
					tap: (options, fn) => {
						processAssetsHook.tap(getOptions(options), () => fn(...getArgs()));
					},
					/** @type {AsyncSeriesHook<T>["tapAsync"]} */
					tapAsync: (options, fn) => {
						processAssetsHook.tapAsync(
							getOptions(options),
							(assets, callback) =>
								/** @type {any} */ (fn)(...getArgs(), callback)
						);
					},
					/** @type {AsyncSeriesHook<T>["tapPromise"]} */
					tapPromise: (options, fn) => {
						processAssetsHook.tapPromise(getOptions(options), () =>
							fn(...getArgs())
						);
					}
				},
				`${name} is deprecated (use Compilation.hooks.processAssets instead and use one of Compilation.PROCESS_ASSETS_STAGE_* as stage option)`,
				code
			);
		};
		this.hooks = Object.freeze({
			/** @type {SyncHook<[Module]>} */
			buildModule: new SyncHook(["module"]),
			/** @type {SyncHook<[Module]>} */
			rebuildModule: new SyncHook(["module"]),
			/** @type {SyncHook<[Module, WebpackError]>} */
			failedModule: new SyncHook(["module", "error"]),
			/** @type {SyncHook<[Module]>} */
			succeedModule: new SyncHook(["module"]),
			/** @type {SyncHook<[Module]>} */
			stillValidModule: new SyncHook(["module"]),

			/** @type {SyncHook<[Dependency, EntryOptions]>} */
			addEntry: new SyncHook(["entry", "options"]),
			/** @type {SyncHook<[Dependency, EntryOptions, Error]>} */
			// 入口构建失败
			failedEntry: new SyncHook(["entry", "options", "error"]),
			/** @type {SyncHook<[Dependency, EntryOptions, Module]>} */
			// 入口构建成功
			succeedEntry: new SyncHook(["entry", "options", "module"]),

			/** @type {SyncWaterfallHook<[(string[] | ReferencedExport)[], Dependency, RuntimeSpec]>} */
			dependencyReferencedExports: new SyncWaterfallHook([
				"referencedExports",
				"dependency",
				"runtime"
			]),

			/** @type {SyncHook<[ExecuteModuleArgument, ExecuteModuleContext]>} */
			executeModule: new SyncHook(["options", "context"]),
			/** @type {AsyncParallelHook<[ExecuteModuleArgument, ExecuteModuleContext]>} */
			prepareModuleExecution: new AsyncParallelHook(["options", "context"]),

			/**
			 * 所有模块都完成构建并且没有错误时执行。
			 * AsyncSeriesHook：异步串联执行
			 */
			/** @type {AsyncSeriesHook<[Iterable<Module>]>} */
			finishModules: new AsyncSeriesHook(["modules"]),
			/** @type {AsyncSeriesHook<[Module]>} */
			finishRebuildingModule: new AsyncSeriesHook(["module"]),
			/** @type {SyncHook<[]>} */
			unseal: new SyncHook([]),
			/**
			 * compilation 对象停止接收新的模块时触发。
			 * SyncHook：同步钩子
			 */
			/** @type {SyncHook<[]>} */
			seal: new SyncHook([]),

			/**
			 * 生成 chunks 之前触发
			 * SyncHook：同步串联钩子
			 */
			/** @type {SyncHook<[]>} */
			beforeChunks: new SyncHook([]),
			/** @type {SyncHook<[Iterable<Chunk>]>} */
			afterChunks: new SyncHook(["chunks"]),

			/**
			 * 依赖优化开始时触发。
			 * SyncBailHook：如果任何事件函数存在返回值，那么会立即中断后续事件函数的调用
			 */
			/** @type {SyncBailHook<[Iterable<Module>]>} */
			optimizeDependencies: new SyncBailHook(["modules"]),
			/**
			 * 依赖优化之后触发。
			 * SyncHook：同步串联钩子
			 */
			/** @type {SyncHook<[Iterable<Module>]>} */
			afterOptimizeDependencies: new SyncHook(["modules"]),

			/** @type {SyncHook<[]>} */
			optimize: new SyncHook([]),
			/** @type {SyncBailHook<[Iterable<Module>]>} */
			optimizeModules: new SyncBailHook(["modules"]),
			/** @type {SyncHook<[Iterable<Module>]>} */
			afterOptimizeModules: new SyncHook(["modules"]),

			/** @type {SyncBailHook<[Iterable<Chunk>, ChunkGroup[]]>} */
			optimizeChunks: new SyncBailHook(["chunks", "chunkGroups"]),
			/** @type {SyncHook<[Iterable<Chunk>, ChunkGroup[]]>} */
			afterOptimizeChunks: new SyncHook(["chunks", "chunkGroups"]),

			/** @type {AsyncSeriesHook<[Iterable<Chunk>, Iterable<Module>]>} */
			optimizeTree: new AsyncSeriesHook(["chunks", "modules"]),
			/** @type {SyncHook<[Iterable<Chunk>, Iterable<Module>]>} */
			afterOptimizeTree: new SyncHook(["chunks", "modules"]),

			/** @type {AsyncSeriesBailHook<[Iterable<Chunk>, Iterable<Module>]>} */
			optimizeChunkModules: new AsyncSeriesBailHook(["chunks", "modules"]),
			/** @type {SyncHook<[Iterable<Chunk>, Iterable<Module>]>} */
			afterOptimizeChunkModules: new SyncHook(["chunks", "modules"]),
			/** @type {SyncBailHook<[], boolean>} */
			shouldRecord: new SyncBailHook([]),

			/** @type {SyncHook<[Chunk, Set<string>, RuntimeRequirementsContext]>} */
			additionalChunkRuntimeRequirements: new SyncHook([
				"chunk",
				"runtimeRequirements",
				"context"
			]),
			/** @type {HookMap<SyncBailHook<[Chunk, Set<string>, RuntimeRequirementsContext]>>} */
			runtimeRequirementInChunk: new HookMap(
				() => new SyncBailHook(["chunk", "runtimeRequirements", "context"])
			),
			/** @type {SyncHook<[Module, Set<string>, RuntimeRequirementsContext]>} */
			additionalModuleRuntimeRequirements: new SyncHook([
				"module",
				"runtimeRequirements",
				"context"
			]),
			/** @type {HookMap<SyncBailHook<[Module, Set<string>, RuntimeRequirementsContext]>>} */
			runtimeRequirementInModule: new HookMap(
				() => new SyncBailHook(["module", "runtimeRequirements", "context"])
			),
			/** @type {SyncHook<[Chunk, Set<string>, RuntimeRequirementsContext]>} */
			additionalTreeRuntimeRequirements: new SyncHook([
				"chunk",
				"runtimeRequirements",
				"context"
			]),
			/** @type {HookMap<SyncBailHook<[Chunk, Set<string>, RuntimeRequirementsContext]>>} */
			runtimeRequirementInTree: new HookMap(
				() => new SyncBailHook(["chunk", "runtimeRequirements", "context"])
			),

			/** @type {SyncHook<[RuntimeModule, Chunk]>} */
			runtimeModule: new SyncHook(["module", "chunk"]),

			/** @type {SyncHook<[Iterable<Module>, any]>} */
			reviveModules: new SyncHook(["modules", "records"]),
			/** @type {SyncHook<[Iterable<Module>]>} */
			beforeModuleIds: new SyncHook(["modules"]),
			/** @type {SyncHook<[Iterable<Module>]>} */
			moduleIds: new SyncHook(["modules"]),
			/** @type {SyncHook<[Iterable<Module>]>} */
			optimizeModuleIds: new SyncHook(["modules"]),
			/** @type {SyncHook<[Iterable<Module>]>} */
			afterOptimizeModuleIds: new SyncHook(["modules"]),

			/** @type {SyncHook<[Iterable<Chunk>, any]>} */
			reviveChunks: new SyncHook(["chunks", "records"]),
			/** @type {SyncHook<[Iterable<Chunk>]>} */
			beforeChunkIds: new SyncHook(["chunks"]),
			/** @type {SyncHook<[Iterable<Chunk>]>} */
			chunkIds: new SyncHook(["chunks"]),
			/** @type {SyncHook<[Iterable<Chunk>]>} */
			optimizeChunkIds: new SyncHook(["chunks"]),
			/** @type {SyncHook<[Iterable<Chunk>]>} */
			afterOptimizeChunkIds: new SyncHook(["chunks"]),

			/** @type {SyncHook<[Iterable<Module>, any]>} */
			recordModules: new SyncHook(["modules", "records"]),
			/** @type {SyncHook<[Iterable<Chunk>, any]>} */
			recordChunks: new SyncHook(["chunks", "records"]),

			/** @type {SyncHook<[Iterable<Module>]>} */
			optimizeCodeGeneration: new SyncHook(["modules"]),

			/** @type {SyncHook<[]>} */
			beforeModuleHash: new SyncHook([]),
			/** @type {SyncHook<[]>} */
			afterModuleHash: new SyncHook([]),

			/** @type {SyncHook<[]>} */
			beforeCodeGeneration: new SyncHook([]),
			/** @type {SyncHook<[]>} */
			afterCodeGeneration: new SyncHook([]),

			/** @type {SyncHook<[]>} */
			beforeRuntimeRequirements: new SyncHook([]),
			/** @type {SyncHook<[]>} */
			afterRuntimeRequirements: new SyncHook([]),

			/** @type {SyncHook<[]>} */
			beforeHash: new SyncHook([]),
			/** @type {SyncHook<[Chunk]>} */
			contentHash: new SyncHook(["chunk"]),
			/** @type {SyncHook<[]>} */
			afterHash: new SyncHook([]),
			/** @type {SyncHook<[any]>} */
			recordHash: new SyncHook(["records"]),
			/** @type {SyncHook<[Compilation, any]>} */
			record: new SyncHook(["compilation", "records"]),

			/** @type {SyncHook<[]>} */
			beforeModuleAssets: new SyncHook([]),
			/** @type {SyncBailHook<[], boolean>} */
			shouldGenerateChunkAssets: new SyncBailHook([]),
			/** @type {SyncHook<[]>} */
			beforeChunkAssets: new SyncHook([]),
			// TODO webpack 6 remove
			/** @deprecated */
			additionalChunkAssets: createProcessAssetsHook(
				"additionalChunkAssets",
				Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
				() => [this.chunks],
				"DEP_WEBPACK_COMPILATION_ADDITIONAL_CHUNK_ASSETS"
			),

			// TODO webpack 6 deprecate
			/** @deprecated */
			additionalAssets: createProcessAssetsHook(
				"additionalAssets",
				Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
				() => []
			),
			// TODO webpack 6 remove
			/** @deprecated */
			optimizeChunkAssets: createProcessAssetsHook(
				"optimizeChunkAssets",
				Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
				() => [this.chunks],
				"DEP_WEBPACK_COMPILATION_OPTIMIZE_CHUNK_ASSETS"
			),
			// TODO webpack 6 remove
			/** @deprecated */
			afterOptimizeChunkAssets: createProcessAssetsHook(
				"afterOptimizeChunkAssets",
				Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE + 1,
				() => [this.chunks],
				"DEP_WEBPACK_COMPILATION_AFTER_OPTIMIZE_CHUNK_ASSETS"
			),
			// TODO webpack 6 deprecate
			/** @deprecated */
			optimizeAssets: processAssetsHook,
			// TODO webpack 6 deprecate
			/** @deprecated */
			afterOptimizeAssets: afterProcessAssetsHook,

			processAssets: processAssetsHook,
			afterProcessAssets: afterProcessAssetsHook,
			/** @type {AsyncSeriesHook<[CompilationAssets]>} */
			processAdditionalAssets: new AsyncSeriesHook(["assets"]),

			/** @type {SyncBailHook<[], boolean>} */
			needAdditionalSeal: new SyncBailHook([]),
			/** @type {AsyncSeriesHook<[]>} */
			afterSeal: new AsyncSeriesHook([]),

			/** @type {SyncWaterfallHook<[RenderManifestEntry[], RenderManifestOptions]>} */
			renderManifest: new SyncWaterfallHook(["result", "options"]),

			/** @type {SyncHook<[Hash]>} */
			fullHash: new SyncHook(["hash"]),
			/** @type {SyncHook<[Chunk, Hash, ChunkHashContext]>} */
			chunkHash: new SyncHook(["chunk", "chunkHash", "ChunkHashContext"]),

			/** @type {SyncHook<[Module, string]>} */
			moduleAsset: new SyncHook(["module", "filename"]),
			/** @type {SyncHook<[Chunk, string]>} */
			chunkAsset: new SyncHook(["chunk", "filename"]),

			/** @type {SyncWaterfallHook<[string, object, AssetInfo]>} */
			assetPath: new SyncWaterfallHook(["path", "options", "assetInfo"]),

			/** @type {SyncBailHook<[], boolean>} */
			needAdditionalPass: new SyncBailHook([]),

			/** @type {SyncHook<[Compiler, string, number]>} */
			childCompiler: new SyncHook([
				"childCompiler",
				"compilerName",
				"compilerIndex"
			]),

			/** @type {SyncBailHook<[string, LogEntry], true>} */
			log: new SyncBailHook(["origin", "logEntry"]),

			/** @type {SyncWaterfallHook<[WebpackError[]]>} */
			processWarnings: new SyncWaterfallHook(["warnings"]),
			/** @type {SyncWaterfallHook<[WebpackError[]]>} */
			processErrors: new SyncWaterfallHook(["errors"]),

			/** @type {HookMap<SyncHook<[Partial<NormalizedStatsOptions>, CreateStatsOptionsContext]>>} */
			statsPreset: new HookMap(() => new SyncHook(["options", "context"])),
			/** @type {SyncHook<[Partial<NormalizedStatsOptions>, CreateStatsOptionsContext]>} */
			statsNormalize: new SyncHook(["options", "context"]),
			/** @type {SyncHook<[StatsFactory, NormalizedStatsOptions]>} */
			statsFactory: new SyncHook(["statsFactory", "options"]),
			/** @type {SyncHook<[StatsPrinter, NormalizedStatsOptions]>} */
			statsPrinter: new SyncHook(["statsPrinter", "options"]),

			get normalModuleLoader() {
				return getNormalModuleLoader();
			}
		});
		/** @type {string=} */
		this.name = undefined; // 当前 Compilation 的 name，由 webpack.options.name 配置 - 继承至创建这个 Compilation 的 Compiler
		this.startTime = undefined;
		this.endTime = undefined;
		/** @type {Compiler} */
		this.compiler = compiler; // 引用 compiler 实例
		this.resolverFactory = compiler.resolverFactory;
		this.inputFileSystem = compiler.inputFileSystem; // 读取文件系统 - 基于 Node 的 fs 模块
		this.fileSystemInfo = new FileSystemInfo(this.inputFileSystem, {
			managedPaths: compiler.managedPaths,
			immutablePaths: compiler.immutablePaths,
			logger: this.getLogger("webpack.FileSystemInfo"),
			hashFunction: compiler.options.output.hashFunction
		});
		if (compiler.fileTimestamps) {
			this.fileSystemInfo.addFileTimestamps(compiler.fileTimestamps, true);
		}
		if (compiler.contextTimestamps) {
			this.fileSystemInfo.addContextTimestamps(
				compiler.contextTimestamps,
				true
			);
		}
		/** @type {Map<string, string | Set<string>>} */
		this.valueCacheVersions = new Map();
		this.requestShortener = compiler.requestShortener;
		this.compilerPath = compiler.compilerPath;

		this.logger = this.getLogger("webpack.Compilation");

		const options = compiler.options;
		this.options = options;
		this.outputOptions = options && options.output;
		/** @type {boolean} */
		this.bail = (options && options.bail) || false;
		/** @type {boolean} 捕获一个应用程序"配置文件"，包括统计和提示，然后可以使用 Analyze 分析工具进行详细分析。 */
		this.profile = (options && options.profile) || false;

		this.params = params;
		this.mainTemplate = new MainTemplate(this.outputOptions, this);
		this.chunkTemplate = new ChunkTemplate(this.outputOptions, this);
		this.runtimeTemplate = new RuntimeTemplate(
			this,
			this.outputOptions,
			this.requestShortener
		);
		/** @type {{javascript: ModuleTemplate}} */
		this.moduleTemplates = {
			javascript: new ModuleTemplate(this.runtimeTemplate, this)
		};
		defineRemovedModuleTemplates(this.moduleTemplates);

		/** @type {Map<Module, WeakTupleMap<any, any>> | undefined} */
		this.moduleMemCaches = undefined;
		/** @type {Map<Module, WeakTupleMap<any, any>> | undefined} */
		this.moduleMemCaches2 = undefined;
		this.moduleGraph = new ModuleGraph(); // 模块图，应该是保存着模块之间的关系
		/** @type {ChunkGraph} */
		this.chunkGraph = undefined; // chunk 图 - 应该是用来建立模块与 chunk 的关系
		/** @type {CodeGenerationResults} */
		this.codeGenerationResults = undefined;

		/** @type {AsyncQueue<Module, Module, Module>} */
		this.processDependenciesQueue = new AsyncQueue({
			name: "processDependencies",
			parallelism: options.parallelism || 100,
			processor: this._processModuleDependencies.bind(this)
		});
		/** @type {AsyncQueue<Module, string, Module>} */
		this.addModuleQueue = new AsyncQueue({
			name: "addModule",
			parent: this.processDependenciesQueue,
			getKey: module => module.identifier(),
			processor: this._addModule.bind(this)
		});
		/** @type {AsyncQueue<FactorizeModuleOptions, string, Module | ModuleFactoryResult>} */
		// 一种异步队列执行机制
		this.factorizeQueue = new AsyncQueue({
			name: "factorize", // 
			parent: this.addModuleQueue, 
			processor: this._factorizeModule.bind(this) // 队列执行器
		});
		/** @type {AsyncQueue<Module, Module, Module>} */
		this.buildQueue = new AsyncQueue({
			name: "build",
			parent: this.factorizeQueue,
			processor: this._buildModule.bind(this)
		});
		/** @type {AsyncQueue<Module, Module, Module>} */
		this.rebuildQueue = new AsyncQueue({
			name: "rebuild",
			parallelism: options.parallelism || 100,
			processor: this._rebuildModule.bind(this)
		});

		/**
		 * Modules in value are building during the build of Module in key.
		 * Means value blocking key from finishing.
		 * Needed to detect build cycles.
		 * @type {WeakMap<Module, Set<Module>>}
		 */
		this.creatingModuleDuringBuild = new WeakMap();

		/** @type {Map<string, EntryData>} */
		this.entries = new Map(); // 入口对象集合
		/** @type {EntryData} 全局入口相关数据 */
		this.globalEntry = {
			dependencies: [],
			includeDependencies: [],
			options: {
				name: undefined
			}
		};
		/** @type {Map<string, Entrypoint>} */
		this.entrypoints = new Map(); // Entrypoint 集合 -- Entrypoint：继承至 ChunkGroup，用于描述 entryChunk
		/** @type {Entrypoint[]} */
		this.asyncEntrypoints = [];
		/** @type {Set<Chunk>} */
		this.chunks = new Set(); // 所有 Chunks 集合
		/** @type {ChunkGroup[]} */
		this.chunkGroups = []; // ChunkGroup 集合
		/** @type {Map<string, ChunkGroup>} */
		this.namedChunkGroups = new Map(); // chunkGroup 集合
		/** @type {Map<string, Chunk>} */
		this.namedChunks = new Map(); // 已创建具有 name 的 chunk，同一个 name 无需重复创建
		/** @type {Set<Module>} */
		this.modules = new Set(); // 该 Compilation 所有的构建的模块
		if (this._backCompat) {
			arrayToSetDeprecation(this.chunks, "Compilation.chunks");
			arrayToSetDeprecation(this.modules, "Compilation.modules");
		}
		/** @private @type {Map<string, Module>} */
		this._modules = new Map(); // 模块缓存 -- 根据模块标识符缓存的模块实例
		this.records = null;
		/** @type {string[]} */
		this.additionalChunkAssets = [];
		/** @type {CompilationAssets} */
		this.assets = {};
		/** @type {Map<string, AssetInfo>} */
		this.assetsInfo = new Map();
		/** @type {Map<string, Map<string, Set<string>>>} */
		this._assetsRelatedIn = new Map();
		/** @type {WebpackError[]} */
		this.errors = []; // 构建过程中收集的错误列表
		/** @type {WebpackError[]} */
		this.warnings = []; // 构建过程中收集的警告列表
		/** @type {Compilation[]} */
		this.children = [];
		/** @type {Map<string, LogEntry[]>} */
		this.logging = new Map();
		/** @type {Map<DepConstructor, ModuleFactory>} */
		this.dependencyFactories = new Map();
		/** @type {DependencyTemplates} */
		this.dependencyTemplates = new DependencyTemplates(
			this.outputOptions.hashFunction
		);
		this.childrenCounters = {};
		/** @type {Set<number|string>} */
		this.usedChunkIds = null;
		/** @type {Set<number>} */
		this.usedModuleIds = null;
		/** @type {boolean} */
		this.needAdditionalPass = false;
		/** @type {Set<Module & { restoreFromUnsafeCache: Function }>} */
		this._restoredUnsafeCacheModuleEntries = new Set();
		/** @type {Map<string, Module & { restoreFromUnsafeCache: Function }>} */
		this._restoredUnsafeCacheEntries = new Map();
		/** @type {WeakSet<Module>} */
		this.builtModules = new WeakSet(); // 该 compilation 中构建的所有模块
		/** @type {WeakSet<Module>} */
		this.codeGeneratedModules = new WeakSet();
		/** @type {WeakSet<Module>} */
		this.buildTimeExecutedModules = new WeakSet();
		/** @private @type {Map<Module, Callback[]>} */
		this._rebuildingModules = new Map();
		/** @type {Set<string>} */
		this.emittedAssets = new Set();
		/** @type {Set<string>} */
		this.comparedForEmitAssets = new Set();
		/** @type {LazySet<string>} */
		// 应该是与 loader.addDependency() 方法类似，能够监听这些文件列表的变动 - 当添加了 watch 选项时会产生作用
		this.fileDependencies = new LazySet();
		/** @type {LazySet<string>} */
		// 应该是与 loader.addContextDependency() 方法类似，能够监听这些目录列表的变动 - 当添加了 watch 选项时会产生作用
		this.contextDependencies = new LazySet();
		/** @type {LazySet<string>} */
		// 那么这个是用来监视什么的？
		this.missingDependencies = new LazySet();
		/** @type {LazySet<string>} */
		this.buildDependencies = new LazySet();
		// TODO webpack 6 remove
		this.compilationDependencies = {
			add: util.deprecate(
				item => this.fileDependencies.add(item),
				"Compilation.compilationDependencies is deprecated (used Compilation.fileDependencies instead)", // 依赖已被弃用(使用 Compilation.fileDependencies 的依赖关系)
				"DEP_WEBPACK_COMPILATION_COMPILATION_DEPENDENCIES"
			)
		};

		this._modulesCache = this.getCache("Compilation/modules"); // 全局模块缓存系统 - 会被缓存在全局缓存系统中(根据 options.cache 配置缓存在不同地方)
		this._assetsCache = this.getCache("Compilation/assets");
		this._codeGenerationCache = this.getCache("Compilation/codeGeneration");

		const unsafeCache = options.module.unsafeCache; // 缓存模块请求的解析， -- webpack.options.module.unsafeCache
		this._unsafeCache = !!unsafeCache; // // 缓存模块请求的解析， -- webpack.options.module.unsafeCache
		this._unsafeCachePredicate =
			typeof unsafeCache === "function" ? unsafeCache : () => true; // webpack.options.module.unsafeCache 如果为函数的话
	}

	getStats() {
		return new Stats(this);
	}

	/**
	 * @param {StatsOptions | string} optionsOrPreset stats option value
	 * @param {CreateStatsOptionsContext} context context
	 * @returns {NormalizedStatsOptions} normalized options
	 */
	createStatsOptions(optionsOrPreset, context = {}) {
		if (
			typeof optionsOrPreset === "boolean" ||
			typeof optionsOrPreset === "string"
		) {
			optionsOrPreset = { preset: optionsOrPreset };
		}
		if (typeof optionsOrPreset === "object" && optionsOrPreset !== null) {
			// We use this method of shallow cloning this object to include
			// properties in the prototype chain
			/** @type {Partial<NormalizedStatsOptions>} */
			const options = {};
			for (const key in optionsOrPreset) {
				options[key] = optionsOrPreset[key];
			}
			if (options.preset !== undefined) {
				this.hooks.statsPreset.for(options.preset).call(options, context);
			}
			this.hooks.statsNormalize.call(options, context);
			return /** @type {NormalizedStatsOptions} */ (options);
		} else {
			/** @type {Partial<NormalizedStatsOptions>} */
			const options = {};
			this.hooks.statsNormalize.call(options, context);
			return /** @type {NormalizedStatsOptions} */ (options);
		}
	}

	createStatsFactory(options) {
		const statsFactory = new StatsFactory();
		this.hooks.statsFactory.call(statsFactory, options);
		return statsFactory;
	}

	createStatsPrinter(options) {
		const statsPrinter = new StatsPrinter();
		this.hooks.statsPrinter.call(statsPrinter, options);
		return statsPrinter;
	}

	/**
	 * @param {string} name cache name 缓存名称
	 * @returns {CacheFacade} the cache facade instance 缓存系统实例
	 */
	getCache(name) {
		return this.compiler.getCache(name);
	}

	/**
	 * @param {string | (function(): string)} name name of the logger, or function called once to get the logger name
	 * @returns {Logger} a logger with that name
	 */
	getLogger(name) {
		if (!name) {
			throw new TypeError("Compilation.getLogger(name) called without a name");
		}
		/** @type {LogEntry[] | undefined} */
		let logEntries;
		return new Logger(
			(type, args) => {
				if (typeof name === "function") {
					name = name();
					if (!name) {
						throw new TypeError(
							"Compilation.getLogger(name) called with a function not returning a name"
						);
					}
				}
				let trace;
				switch (type) {
					case LogType.warn:
					case LogType.error:
					case LogType.trace:
						trace = ErrorHelpers.cutOffLoaderExecution(new Error("Trace").stack)
							.split("\n")
							.slice(3);
						break;
				}
				/** @type {LogEntry} */
				const logEntry = {
					time: Date.now(),
					type,
					args,
					trace
				};
				if (this.hooks.log.call(name, logEntry) === undefined) {
					if (logEntry.type === LogType.profileEnd) {
						// eslint-disable-next-line node/no-unsupported-features/node-builtins
						if (typeof console.profileEnd === "function") {
							// eslint-disable-next-line node/no-unsupported-features/node-builtins
							console.profileEnd(`[${name}] ${logEntry.args[0]}`);
						}
					}
					if (logEntries === undefined) {
						logEntries = this.logging.get(name);
						if (logEntries === undefined) {
							logEntries = [];
							this.logging.set(name, logEntries);
						}
					}
					logEntries.push(logEntry);
					if (logEntry.type === LogType.profile) {
						// eslint-disable-next-line node/no-unsupported-features/node-builtins
						if (typeof console.profile === "function") {
							// eslint-disable-next-line node/no-unsupported-features/node-builtins
							console.profile(`[${name}] ${logEntry.args[0]}`);
						}
					}
				}
			},
			childName => {
				if (typeof name === "function") {
					if (typeof childName === "function") {
						return this.getLogger(() => {
							if (typeof name === "function") {
								name = name();
								if (!name) {
									throw new TypeError(
										"Compilation.getLogger(name) called with a function not returning a name"
									);
								}
							}
							if (typeof childName === "function") {
								childName = childName();
								if (!childName) {
									throw new TypeError(
										"Logger.getChildLogger(name) called with a function not returning a name"
									);
								}
							}
							return `${name}/${childName}`;
						});
					} else {
						return this.getLogger(() => {
							if (typeof name === "function") {
								name = name();
								if (!name) {
									throw new TypeError(
										"Compilation.getLogger(name) called with a function not returning a name"
									);
								}
							}
							return `${name}/${childName}`;
						});
					}
				} else {
					if (typeof childName === "function") {
						return this.getLogger(() => {
							if (typeof childName === "function") {
								childName = childName();
								if (!childName) {
									throw new TypeError(
										"Logger.getChildLogger(name) called with a function not returning a name"
									);
								}
							}
							return `${name}/${childName}`;
						});
					} else {
						return this.getLogger(`${name}/${childName}`);
					}
				}
			}
		);
	}

	/**
	 * @param {Module} module module to be added that was created 创建的要添加的模块
	 * @param {ModuleCallback} callback returns the module in the compilation, 返回编译中的模块
	 * it could be the passed one (if new), or an already existing in the compilation 它可以是通过的版本（如果是新的），也可以是编译中已经存在的版本
	 * @returns {void}
	 */
	addModule(module, callback) {
		this.addModuleQueue.add(module, callback);
	}

	/**
	 * 在上面 addModule 方法中通过 asyncQueue 一种执行机制，最终会执行下面这个方法
	 * 大致应该是尝试从缓存系统中提取模块，如果存在缓存则使用缓存模块
	 * 不存在缓存，将该 module 推入到 _modules 和 modules 集合中，返回模块
	 * 
	 * @param {Module} module module to be added that was created 创建的要添加的模块
	 * @param {ModuleCallback} callback returns the module in the compilation, 返回编译中的模块
	 * it could be the passed one (if new), or an already existing in the compilation 它可以是通过的版本（如果是新的），也可以是编译中已经存在的版本
	 * @returns {void}
	 */
	_addModule(module, callback) {
		// 获取模块的唯一标识符(根据类型不同返回也不同) -- C:\\Users\\Administrator\\Desktop\\wenshuli\\client\\demo\\webpack\\02_loader\\node_modules\\babel-loader\\lib\\index.js??ruleSet[1].rules[0].use!C:\\Users\\Administrator\\Desktop\\wenshuli\\client\\demo\\webpack\\02_loader\\src\\index.js
		const identifier = module.identifier();
		// 根据标识符从缓存系统中提取
		const alreadyAddedModule = this._modules.get(identifier);
		if (alreadyAddedModule) {
			// 如果存在于缓存系统的话，那么就返回缓存的模块信息
			return callback(null, alreadyAddedModule);
		}

		// profile：捕获一个应用程序"配置文件"，包括统计和提示，然后可以使用 Analyze 分析工具进行详细分析。
		const currentProfile = this.profile
			? this.moduleGraph.getProfile(module)
			: undefined;
		if (currentProfile !== undefined) {
			currentProfile.markRestoringStart();
		}

		/**
		 * 从全局缓存系统中提取缓存(会根据 Compilation/modules 和 identifier 等信息生成一个唯一标识符) - 通过 optinos.cache 配置缓存在内存中还是文件系统中
		 * 这是从全局缓存系统中提取，此时可能存在以下情况；
		 * 	1. 多配置情况下，就会生成多个 Compilation，就可以借助全局缓存来缓存模式实例，并且对同一模块只构建一次
		 * 	2. 猜测：在 watch 模式下，应该会使用多次 Compilation
		 * 	3. 使用了文件缓存的话，就可以多次构建时使用同一缓存实例
		 */
		this._modulesCache.get(identifier, null, (err, cacheModule) => {
			if (err) return callback(new ModuleRestoreError(module, err)); // 出错，抛出错误
			// 统计模块信息
			if (currentProfile !== undefined) {
				currentProfile.markRestoringEnd();
				currentProfile.markIntegrationStart();
			}
			// 如果存在缓存模块的话
			if (cacheModule) {
				cacheModule.updateCacheModule(module);

				module = cacheModule;
			}
			// 将该模块进行缓存，这个缓存只是在同一 Compilation 层面上的
			this._modules.set(identifier, module);
			// 将该模块推入 modules 集合中
			this.modules.add(module);
			if (this._backCompat) // optinos.experiments.backCompat - 为许多 webpack 4 api 启用后向兼容层，并发出弃用警告。
				ModuleGraph.setModuleGraphForModule(module, this.moduleGraph);
			if (currentProfile !== undefined) {
				currentProfile.markIntegrationEnd();
			}
			callback(null, module);
		});
	}

	/**
	 * Fetches a module from a compilation by its identifier
	 * @param {Module} module the module provided
	 * @returns {Module} the module requested
	 */
	getModule(module) {
		const identifier = module.identifier();
		return this._modules.get(identifier);
	}

	/**
	 * Attempts to search for a module by its identifier
	 * @param {string} identifier identifier (usually path) for module
	 * @returns {Module|undefined} attempt to search for module and return it, else undefined
	 */
	findModule(identifier) {
		return this._modules.get(identifier);
	}

	/**
	 * Schedules a build of the module object 计划模块对象的生成
	 *
	 * @param {Module} module module to be built 将要建造的模块
	 * @param {ModuleCallback} callback the callback
	 * @returns {void}
	 */
	buildModule(module, callback) {
		// 通过一种执行机制，最终会调用下面的 _buildModule 来构建模块
		this.buildQueue.add(module, callback);
	}

	/**
	 * Builds the module object 构建模块对象
	 *	1. 调用 module.needBuild 判断模块是否可以重用
	 *			--> 如果已经在缓存中并且快照有效的话，说明可以重用，后续就不需要构建模块流程
	 *  2. 调用 module.build 启动模块构建
	 * 			--> 通过 loaders 编译模块(编译结果在 module._source)
	 * 			--> 对模块进行 parser 生成 ast 解析出模块的依赖(module.dependencies)，这些依赖包含导入模块，导入模块的某一些方法，导出方法等等，后面会递归解析这些依赖
	 * 			--> 对模块生成 snapshot(快照) 用于缓存确认(module.buildInfo.snapshot)等等工作
	 *  3. 调用 this._modulesCache.store 方法将构建的模块进行全局缓存
	 * @param {Module} module module to be built 将要建造的模块
	 * @param {ModuleCallback} callback the callback
	 * @returns {void}
	 */
	_buildModule(module, callback) {
		// 捕获一个应用程序"配置文件"，包括统计和提示，然后可以使用 Analyze 分析工具进行详细分析
		const currentProfile = this.profile
			? this.moduleGraph.getProfile(module)
			: undefined;
		if (currentProfile !== undefined) {
			currentProfile.markBuildingStart();
		}

		// 调用模块实例的 needBuild 方法 - 这个方法用来检测是否需要构建
		module.needBuild(
			{
				compilation: this, // Compilation 实例
				fileSystemInfo: this.fileSystemInfo, // 文件读取系统
				valueCacheVersions: this.valueCacheVersions
			},
			(err, needBuild) => {
				// 出现错误
				if (err) return callback(err);

				// 模块可以重用，此时不需要构建 - 模块的编译的源码存放在模块实例上的
				if (!needBuild) {
					if (currentProfile !== undefined) {
						currentProfile.markBuildingEnd();
					}
					this.hooks.stillValidModule.call(module);
					return callback();
				}

				/**
				 * buildModule：在模块构建开始之前触发，可以用来修改模块。
				 * 例如：如果需要生成 source-map 的话，会注入一个插件 -- module.useSourceMap = true; 给模块实例打上一个标识
				 */
				this.hooks.buildModule.call(module); 

				this.builtModules.add(module); // 将该模块添加至 builtModules 集合中 - 包含了该构建流程中所有模块

				// 通过模块实例的 build 启动构建模块的过程
				module.build(
					this.options, // webpack 配置项
					this, // compilation 实例
					this.resolverFactory.get("normal", module.resolveOptions), // 模块路径解析器
					this.inputFileSystem, // 读取文件系统
					err => {
						/**
						 * 模块构建完成，主要完成以下工作
						 * 	通过 loaders 编译模块(编译结果在 module._source)
						 * 	对模块进行 parser 生成 ast 解析出模块的依赖(module.dependencies)
						 * 	对模块生成 snapshot(快照) 用于缓存确认(module.buildInfo.snapshot)等等工作
						 */

						// 对模块进行统计信息
						if (currentProfile !== undefined) {
							currentProfile.markBuildingEnd();
						}
						// 构建过程中出现错误
						if (err) {
							this.hooks.failedModule.call(module, err);
							return callback(err);
						}
						// 对模块进行统计信息
						if (currentProfile !== undefined) {
							currentProfile.markStoringStart();
						}
						// 模块构建完毕后，在全局缓存系统中进行缓存处理
						this._modulesCache.store(module.identifier(), null, module, err => {
							// 对模块进行统计信息
							if (currentProfile !== undefined) {
								currentProfile.markStoringEnd();
							}
							// 缓存模块出错
							if (err) {
								this.hooks.failedModule.call(module, err);
								return callback(new ModuleStoreError(module, err));
							}
							// succeedModule：模块构建成功时执行。
							this.hooks.succeedModule.call(module);
							return callback();
						});
					}
				);
			}
		);
	}

	/**
	 * @param {Module} module to be processed for deps
	 * @param {ModuleCallback} callback callback to be triggered
	 * @returns {void}
	 */
	processModuleDependencies(module, callback) {
		this.processDependenciesQueue.add(module, callback);
	}

	/**
	 * @param {Module} module to be processed for deps
	 * @returns {void}
	 */
	processModuleDependenciesNonRecursive(module) {
		const processDependenciesBlock = block => {
			if (block.dependencies) {
				let i = 0;
				for (const dep of block.dependencies) {
					this.moduleGraph.setParents(dep, block, module, i++);
				}
			}
			if (block.blocks) {
				for (const b of block.blocks) processDependenciesBlock(b);
			}
		};

		processDependenciesBlock(module);
	}

	/**
	 * 递归处理模块的依赖
	 * @param {Module} module to be processed for deps 处理依赖项的模块
	 * @param {ModuleCallback} callback callback to be triggered 被触发的回调
	 * @returns {void}
	 */
	_processModuleDependencies(module, callback) {
		/** @type {Array<{factory: ModuleFactory, dependencies: Dependency[], originModule: Module|null}>} */
		const sortedDependencies = []; // 排好序的依赖关系

		/** @type {DependenciesBlock} */
		let currentBlock;

		/** @type {Map<ModuleFactory, Map<string, Dependency[]>>} */
		let dependencies;
		/** @type {DepConstructor} */
		let factoryCacheKey;
		/** @type {ModuleFactory} */
		let factoryCacheKey2;
		/** @type {Map<string, Dependency[]>} */
		let factoryCacheValue;
		/** @type {string} */
		let listCacheKey1;
		/** @type {string} */
		let listCacheKey2;
		/** @type {Dependency[]} */
		let listCacheValue;

		let inProgressSorting = 1;
		let inProgressTransitive = 1;

		// 将排序好的依赖通过 handleModuleCreation 启动构建(创建模块实例、构建模块、处理模块的依赖)
		const onDependenciesSorted = err => {
			if (err) return callback(err);

			// early exit without changing parallelism back and forth 在不来回改变并行度的情况下提前退出
			if (sortedDependencies.length === 0 && inProgressTransitive === 1) {
				return callback();
			}

			// This is nested so we need to allow one additional task 这是嵌套的，所以我们需要允许一个额外的任务
			this.processDependenciesQueue.increaseParallelism();

			for (const item of sortedDependencies) {
				inProgressTransitive++;
				this.handleModuleCreation(item, err => {
					// In V8, the Error objects keep a reference to the functions on the stack. These warnings & 在V8中，Error对象保留了对栈上函数的引用。这些警告&
					// errors are created inside closures that keep a reference to the Compilation, so errors are 错误是在闭包中创建的，这些闭包保留了对编译的引用，所以错误也是
					// leaking the Compilation object. 泄漏编译对象
					if (err && this.bail) {
						if (inProgressTransitive <= 0) return;
						inProgressTransitive = -1;
						// eslint-disable-next-line no-self-assign
						err.stack = err.stack;
						onTransitiveTasksFinished(err);
						return;
					}
					// 如果已经处理了当前模块的全部模块，则完成模块依赖的构建
					if (--inProgressTransitive === 0) onTransitiveTasksFinished();
				});
			}
			if (--inProgressTransitive === 0) onTransitiveTasksFinished();
		};

		// 模块依赖已经全部完成回调
		const onTransitiveTasksFinished = err => {
			if (err) return callback(err);
			this.processDependenciesQueue.decreaseParallelism();

			return callback(); // 完成回调
		};

		/**
		 * 开始处理依赖
		 * @param {Dependency} dep dependency
		 * @param {number} index index in block
		 * @returns {void}
		 */
		const processDependency = (dep, index) => {
			this.moduleGraph.setParents(dep, currentBlock, module, index); // 构建模块依赖图关系
			if (this._unsafeCache) {
				try {
					const unsafeCachedModule = unsafeCacheDependencies.get(dep);
					if (unsafeCachedModule === null) return;
					if (unsafeCachedModule !== undefined) {
						if (
							this._restoredUnsafeCacheModuleEntries.has(unsafeCachedModule)
						) {
							this._handleExistingModuleFromUnsafeCache(
								module,
								dep,
								unsafeCachedModule
							);
							return;
						}
						const identifier = unsafeCachedModule.identifier();
						const cachedModule =
							this._restoredUnsafeCacheEntries.get(identifier);
						if (cachedModule !== undefined) {
							// update unsafe cache to new module
							unsafeCacheDependencies.set(dep, cachedModule);
							this._handleExistingModuleFromUnsafeCache(
								module,
								dep,
								cachedModule
							);
							return;
						}
						inProgressSorting++;
						this._modulesCache.get(identifier, null, (err, cachedModule) => {
							if (err) {
								if (inProgressSorting <= 0) return;
								inProgressSorting = -1;
								onDependenciesSorted(err);
								return;
							}
							try {
								if (!this._restoredUnsafeCacheEntries.has(identifier)) {
									const data = unsafeCacheData.get(cachedModule);
									if (data === undefined) {
										processDependencyForResolving(dep);
										if (--inProgressSorting === 0) onDependenciesSorted();
										return;
									}
									if (cachedModule !== unsafeCachedModule) {
										unsafeCacheDependencies.set(dep, cachedModule);
									}
									cachedModule.restoreFromUnsafeCache(
										data,
										this.params.normalModuleFactory,
										this.params
									);
									this._restoredUnsafeCacheEntries.set(
										identifier,
										cachedModule
									);
									this._restoredUnsafeCacheModuleEntries.add(cachedModule);
									if (!this.modules.has(cachedModule)) {
										inProgressTransitive++;
										this._handleNewModuleFromUnsafeCache(
											module,
											dep,
											cachedModule,
											err => {
												if (err) {
													if (inProgressTransitive <= 0) return;
													inProgressTransitive = -1;
													onTransitiveTasksFinished(err);
												}
												if (--inProgressTransitive === 0)
													return onTransitiveTasksFinished();
											}
										);
										if (--inProgressSorting === 0) onDependenciesSorted();
										return;
									}
								}
								if (unsafeCachedModule !== cachedModule) {
									unsafeCacheDependencies.set(dep, cachedModule);
								}
								this._handleExistingModuleFromUnsafeCache(
									module,
									dep,
									cachedModule
								); // a3
							} catch (err) {
								if (inProgressSorting <= 0) return;
								inProgressSorting = -1;
								onDependenciesSorted(err);
								return;
							}
							if (--inProgressSorting === 0) onDependenciesSorted();
						});
						return;
					}
				} catch (e) {
					console.error(e);
				}
			}
			// 交由 processDependencyForResolving 方法
			processDependencyForResolving(dep);
		};

		/**
		 * @param {Dependency} dep dependency
		 * @returns {void}
		 */
		const processDependencyForResolving = dep => {
			const resourceIdent = dep.getResourceIdentifier();
			if (resourceIdent !== undefined && resourceIdent !== null) {
				const category = dep.category;
				const constructor = /** @type {DepConstructor} */ (dep.constructor);
				if (factoryCacheKey === constructor) {
					// Fast path 1: same constructor as prev item
					if (listCacheKey1 === category && listCacheKey2 === resourceIdent) {
						// Super fast path 1: also same resource
						listCacheValue.push(dep);
						return;
					}
				} else {
					const factory = this.dependencyFactories.get(constructor);
					if (factory === undefined) {
						throw new Error(
							`No module factory available for dependency type: ${constructor.name}` // 有可用于依赖类型的模块工厂
						);
					}
					if (factoryCacheKey2 === factory) {
						// Fast path 2: same factory as prev item
						factoryCacheKey = constructor;
						if (listCacheKey1 === category && listCacheKey2 === resourceIdent) {
							// Super fast path 2: also same resource
							listCacheValue.push(dep);
							return;
						}
					} else {
						// Slow path
						if (factoryCacheKey2 !== undefined) {
							// Archive last cache entry
							if (dependencies === undefined) dependencies = new Map();
							dependencies.set(factoryCacheKey2, factoryCacheValue);
							factoryCacheValue = dependencies.get(factory);
							if (factoryCacheValue === undefined) {
								factoryCacheValue = new Map();
							}
						} else {
							factoryCacheValue = new Map();
						}
						factoryCacheKey = constructor;
						factoryCacheKey2 = factory;
					}
				}
				// Here webpack is using heuristic that assumes 这里webpack使用启发式方法，假设
				// mostly esm dependencies would be used 大多数esm依赖项会被使用
				// so we don't allocate extra string for them 所以我们不会为它们分配额外的字符串
				const cacheKey =
					category === esmDependencyCategory
						? resourceIdent
						: `${category}${resourceIdent}`;
				let list = factoryCacheValue.get(cacheKey);
				if (list === undefined) {
					factoryCacheValue.set(cacheKey, (list = []));
					sortedDependencies.push({
						factory: factoryCacheKey2,
						dependencies: list,
						originModule: module
					});
				}
				list.push(dep);
				listCacheKey1 = category;
				listCacheKey2 = resourceIdent;
				listCacheValue = list;
			}
		};

		try {
			/**
			 * 例如模块为：
			 * import { test, test2 } from 'babel-loader!./module/module01';
			 * import './module/module02';
			 * console.log('全流程构建', test, test2);
			 * import('./chunk/chunk01').then(function (_ref) {  var chunk = _ref.chunk;  chunk();});
			 * export function exportTest() {  console.log('导出一个模块试试');}
			 */
			/** @type {DependenciesBlock[]} */
			const queue = [module]; // 初始排序队列为当前模块
			do {
				const block = queue.pop(); // 从数组中移除最后一个元素并返回它
				/**
				 * block.dependencies：保存着模块同步的依赖，例如模块导入(包括模块方法导入也会生成一个依赖)、方法导出等
				 * 
				 * 	HarmonImportSideEffectDependency -- 表示导入的模块(例如 import './module/module02';)
				 * 	HarmonyImportSpecifierDependency -- 表示导入的方法(例如 import { test } from './module/module01';)
				 * 	HarmonyExportSpecifierDependency -- 表示导出的方法
				 */
				if (block.dependencies) {
					// 模块存在同步依赖的话
					currentBlock = block; // 当前处理的模块
					let i = 0;
					for (const dep of block.dependencies) processDependency(dep, i++);
				}
				if (block.blocks) {
					// 存在异步块的话，将其视为一个独立模块处理？
					for (const b of block.blocks) queue.push(b);
				}
			} while (queue.length !== 0);
		} catch (e) {
			return callback(e);
		}

		if (--inProgressSorting === 0) onDependenciesSorted();
	}

	_handleNewModuleFromUnsafeCache(originModule, dependency, module, callback) {
		const moduleGraph = this.moduleGraph;

		moduleGraph.setResolvedModule(originModule, dependency, module);

		moduleGraph.setIssuerIfUnset(
			module,
			originModule !== undefined ? originModule : null
		);

		this._modules.set(module.identifier(), module);
		this.modules.add(module);
		if (this._backCompat)
			ModuleGraph.setModuleGraphForModule(module, this.moduleGraph);

		this._handleModuleBuildAndDependencies(
			originModule,
			module,
			true,
			callback
		);
	}

	_handleExistingModuleFromUnsafeCache(originModule, dependency, module) {
		const moduleGraph = this.moduleGraph;

		moduleGraph.setResolvedModule(originModule, dependency, module);
	}

	/**
	 * @typedef {Object} HandleModuleCreationOptions
	 * @property {ModuleFactory} factory
	 * @property {Dependency[]} dependencies
	 * @property {Module | null} originModule
	 * @property {Partial<ModuleFactoryCreateDataContextInfo>=} contextInfo
	 * @property {string=} context
	 * @property {boolean=} recursive recurse into dependencies of the created module
	 * @property {boolean=} connectOrigin connect the resolved module with the origin module
	 */

	/**
	 * @param {HandleModuleCreationOptions} options options object
	 * @param {ModuleCallback} callback callback
	 * @returns {void}
	 */
	/**
	 * 启动初始构建模块的工作: 都在这个方法中
	 * 	1. this.factorizeModule：启动构建模块实例
	 * 	2. this.addModule：尝试从缓存中提取值
	 * 	3. this._handleModuleBuildAndDependencies：启动模块构建并递归构建模块的依赖
	 */
	handleModuleCreation(
		{
			factory, // 该模块构造器
			dependencies, // 依赖项 - 数组
			originModule, // 导入该模块的模块(例如从 ./src/index.js 中 导入 ./test.js，此时就是 ./src/index.js 模块，已经处理好了的)，入口模块为 null
			contextInfo,
			context, // 上下文路径 - 根模块需要，其他模块不需要 -  - C:\\Users\\Administrator\\Desktop\\wenshuli\\client\\demo\\webpack\\02_loader
			recursive = true,
			connectOrigin = recursive
		},
		callback
	) {
		const moduleGraph = this.moduleGraph;

		// 捕获一个应用程序"配置文件"，包括统计和提示，然后可以使用 Analyze 分析工具进行详细分析
		// 模块信息统计
		const currentProfile = this.profile ? new ModuleProfile() : undefined;

		/**
		 * 启动构建模块实例：
		 * 	1. 生成模块的相关数据：
		 * 			主要如下属性：
		 * 				parser：主要作用是为该 module 提供 parser，用于解析模块为 ast。
		 * 				generator：主要作用是为该 module 提供 generator，用于模版生成时提供方法。
		 * 				loaders：该模块需要运用的 loader
  	 * 				request: 模块解析路径(结合了 loader 的路径) -- "C:\\Users\\Administrator\\Desktop\\wenshuli\\client\\demo\\webpack\\00_process\\node_modules\\babel-loader\\lib\\index.js??ruleSet[1].rules[1].use!C:\\Users\\Administrator\\Desktop\\wenshuli\\client\\demo\\webpack\\00_process\\node_modules\\eslint-loader\\dist\\cjs.js??ruleSet[1].rules[0]!C:\\Users\\Administrator\\Desktop\\wenshuli\\client\\demo\\webpack\\00_process\\src\\index.js"
		 * 				resource: 模块的绝对路径(不包含 loader) -- "C:\\Users\\Administrator\\Desktop\\wenshuli\\client\\demo\\webpack\\00_process\\src\\index.js"
		 * 	2. 使用相关数据生成模块实例
		 */
		this.factorizeModule(
			{
				currentProfile, // 是否统计模块信息
				factory, // 模块构造器 - https://webpack.docschina.org/api/normalmodulefactory-hooks/
				dependencies, // 依赖数组
				factoryResult: true,
				originModule, // 导入该模块的模块(例如从 ./src/index.js 中 导入 ./test.js，此时就是 ./src/index.js 模块，已经处理好了的)，入口模块为 null
				contextInfo,
				context // 上下文路径 - 根模块需要，其他模块不需要 -  - C:\\Users\\Administrator\\Desktop\\wenshuli\\client\\demo\\webpack\\02_loader
			},
			// 模块实例创建结束，执行回调
			(err, factoryResult) => {
				const applyFactoryResultDependencies = () => {
					const { fileDependencies, contextDependencies, missingDependencies } =
						factoryResult;
					if (fileDependencies) {
						this.fileDependencies.addAll(fileDependencies);
					}
					if (contextDependencies) {
						this.contextDependencies.addAll(contextDependencies);
					}
					if (missingDependencies) {
						this.missingDependencies.addAll(missingDependencies);
					}
				};
				// 如果创建模块实例过程中出现错误，处理错误
				if (err) {
					if (factoryResult) applyFactoryResultDependencies();
					if (dependencies.every(d => d.optional)) {
						this.warnings.push(err);
						return callback();
					} else {
						this.errors.push(err);
						return callback(err);
					}
				}

				// 提取出创建的模块实例
				const newModule = factoryResult.module;

				// 此时可能是这个模块被忽略了，但是不会抛出错误
				if (!newModule) {
					applyFactoryResultDependencies();
					return callback();
				}

				// 统计模块信息
				if (currentProfile !== undefined) {
					moduleGraph.setProfile(newModule, currentProfile);
				}

				/**
				 * 从缓存系统中提取值：提取的是模式实例，还是需要经过 _handleModuleBuildAndDependencies 方法进行模块的构建
				 *  1. 从 Compilation 层面提取缓存：从 this._modules 缓存中提取，这是最新的
				 * 	2. 从全局层面提取缓存：根据 options.cache 配置缓存位置(内存和文件系统)，
				 * 			如果是内存，可以跨 Compilation 共享模块实例，
				 * 			如果是文件系统，更可以在每次打包中共享模块实例
				 *  3. 如果都不存在缓存时，将其推入到 this._modules 缓存中，从 Compilation 层面进行缓存
				 */
				this.addModule(newModule, (err, module) => {
					// 如果存在错误的话，处理错误
					if (err) {
						applyFactoryResultDependencies();
						if (!err.module) {
							err.module = module;
						}
						this.errors.push(err);

						return callback(err);
					}

					if (
						this._unsafeCache && // 缓存模块请求的解析， -- webpack.options.module.unsafeCache
						factoryResult.cacheable !== false && // 缓存标识？
						/** @type {any} */ (module).restoreFromUnsafeCache &&
						// webpack.options.module.unsafeCache 当为函数时，会调用
						// 如果用户没有定义的话,默认值是一个函数,函数回去判断模块是否来自 node_modules,如果是的话,返回 true
						this._unsafeCachePredicate(module) 
					) {
						const unsafeCacheableModule =
							/** @type {Module & { restoreFromUnsafeCache: Function }} */ (
								module
							);
						for (let i = 0; i < dependencies.length; i++) {
							const dependency = dependencies[i];
							moduleGraph.setResolvedModule(
								connectOrigin ? originModule : null,
								dependency,
								unsafeCacheableModule
							);
							unsafeCacheDependencies.set(dependency, unsafeCacheableModule);
						}
						if (!unsafeCacheData.has(unsafeCacheableModule)) {
							unsafeCacheData.set(
								unsafeCacheableModule,
								unsafeCacheableModule.getUnsafeCacheData()
							);
						}
					} else {
						applyFactoryResultDependencies();
						for (let i = 0; i < dependencies.length; i++) {
							const dependency = dependencies[i];
							moduleGraph.setResolvedModule(
								connectOrigin ? originModule : null,
								dependency,
								module
							);
						}
					}

					// 模块图
					moduleGraph.setIssuerIfUnset(
						module,
						originModule !== undefined ? originModule : null
					);

					// 如果存在缓存模块实例，做一些工作
					if (module !== newModule) {
						if (currentProfile !== undefined) {
							const otherProfile = moduleGraph.getProfile(module);
							if (otherProfile !== undefined) {
								currentProfile.mergeInto(otherProfile);
							} else {
								moduleGraph.setProfile(module, currentProfile);
							}
						}
					}

					/**
				   * 启动 buildModule 方法：构建模块对象
				   *		1. 调用 module.needBuild 判断模块是否可以重用
				   *				--> 如果已经在缓存中并且快照有效的话，说明可以重用，后续就不需要构建模块流程
				   *  	2. 调用 module.build 启动模块构建
				   * 				--> 通过 loaders 编译模块(编译结果在 module._source)
				   * 				--> 对模块进行 parser 生成 ast 解析出模块的依赖(module.dependencies)，这些依赖包含导入模块，导入模块的某一些方法，导出方法等等，后面会递归解析这些依赖
				   * 				--> 对模块生成 snapshot(快照) 用于缓存确认(module.buildInfo.snapshot)等等工作
				   *  	3. 调用 this._modulesCache.store 方法将构建的模块进行全局缓存
				   * 启动 processModuleDependencies 方法：递归构建模块依赖
				   * 		会将模块构建过程中收集的依赖进行处理后，递归调用 handleModuleCreation 方法重复模块构建的过程，直到所有的模块都构建成功后调用回调
				   */
					this._handleModuleBuildAndDependencies(
						originModule, // 引用模块(引用该模块的模块实例)
						module, // 模块实例
						recursive,
						callback // 构建完毕后的回调
					);
				});
			}
		);
	}

	/**
	 * 启动 buildModule 方法：构建模块对象
	 *		1. 调用 module.needBuild 判断模块是否可以重用
	 *				--> 如果已经在缓存中并且快照有效的话，说明可以重用，后续就不需要构建模块流程
	 *  	2. 调用 module.build 启动模块构建
	 * 				--> 通过 loaders 编译模块(编译结果在 module._source)
	 * 				--> 对模块进行 parser 生成 ast 解析出模块的依赖(module.dependencies)，这些依赖包含导入模块，导入模块的某一些方法，导出方法等等，后面会递归解析这些依赖
	 * 				--> 对模块生成 snapshot(快照) 用于缓存确认(module.buildInfo.snapshot)等等工作
	 *  	3. 调用 this._modulesCache.store 方法将构建的模块进行全局缓存
	 * 启动 processModuleDependencies 方法：递归构建模块依赖
	 * 		会将模块构建过程中收集的依赖进行处理后，递归调用 handleModuleCreation 方法重复模块构建的过程，直到所有的模块都构建成功后调用回调
	 */
	_handleModuleBuildAndDependencies(originModule, module, recursive, callback) {
		// Check for cycles when build is trigger inside another build 检查生成在另一个生成中触发时的周期
		let creatingModuleDuringBuildSet = undefined;
		// ？？？
		if (!recursive && this.buildQueue.isProcessing(originModule)) {
			// Track build dependency 跟踪建立依赖关系
			creatingModuleDuringBuildSet =
				this.creatingModuleDuringBuild.get(originModule);
			if (creatingModuleDuringBuildSet === undefined) {
				creatingModuleDuringBuildSet = new Set();
				this.creatingModuleDuringBuild.set(
					originModule,
					creatingModuleDuringBuildSet
				);
			}
			creatingModuleDuringBuildSet.add(module);

			// When building is blocked by another module
			// search for a cycle, cancel the cycle by throwing
			// an error (otherwise this would deadlock)
			const blockReasons = this.creatingModuleDuringBuild.get(module);
			if (blockReasons !== undefined) {
				const set = new Set(blockReasons);
				for (const item of set) {
					const blockReasons = this.creatingModuleDuringBuild.get(item);
					if (blockReasons !== undefined) {
						for (const m of blockReasons) {
							if (m === module) {
								return callback(new BuildCycleError(module));
							}
							set.add(m);
						}
					}
				}
			}
		}

		/**
		 * 构建模块对象：具体流程见上方注释或方法注释
		 */
		this.buildModule(module, err => {
			if (creatingModuleDuringBuildSet !== undefined) {
				creatingModuleDuringBuildSet.delete(module);
			}
			// 模块构建出错
			if (err) {
				if (!err.module) {
					err.module = module;
				}
				this.errors.push(err); // 将错误推入到错误集合中

				return callback(err);
			}

			if (!recursive) {
				this.processModuleDependenciesNonRecursive(module);
				callback(null, module);
				return;
			}

			// This avoids deadlocks for circular dependencies 这避免了循环依赖的死锁
			if (this.processDependenciesQueue.isProcessing(module)) {
				return callback();
			}

			/**
			 * 递归解析模块依赖：在递归构建了这个模块的依赖之后，会在内部存在一个依赖图保存着这些模块的依赖关系
			 */
			this.processModuleDependencies(module, err => {
				if (err) {
					return callback(err);
				}
				// 模块全部构建成功
				callback(null, module);
			});
		});
	}

	/**
	 * 启动创建模块实例的方法 - 通过 factory.create 方法 -- factory：表示模块创建工厂方法，一般为 NormalModuleFactory，少数为 ContextModuleFactory
	 * @param {FactorizeModuleOptions} options options object
	 * @param {ModuleOrFactoryResultCallback} callback callback
	 * @returns {void}
	 */
	_factorizeModule(
		{
			currentProfile, // 是否统计模块信息
			factory, // 该模块构造器(NormalModuleFactory) - https://webpack.docschina.org/api/normalmodulefactory-hooks/
			dependencies, // 依赖项
			originModule, // 导入该模块的模块(例如从 ./src/index.js 中 导入 ./test.js，此时就是 ./src/index.js 模块，已经处理好了的)，入口模块为 null
			factoryResult, // 
			contextInfo, // 模块的上下文信息
			context // 上下文路径 - C:\\Users\\Administrator\\Desktop\\wenshuli\\client\\demo\\webpack\\02_loader - 根模块需要，其他模块不需要
		},
		callback
	) {
		if (currentProfile !== undefined) {
			currentProfile.markFactoryStart();
		}
		/**
		 * 启动构建模块实例：
		 * 	1. 生成模块的相关数据：
		 * 			主要如下属性：
		 * 				parser：主要作用是为该 module 提供 parser，用于解析模块为 ast。
		 * 				generator：主要作用是为该 module 提供 generator，用于模版生成时提供方法。
		 * 				loaders：该模块需要运用的 loader
  	 * 				request: 模块解析路径(结合了 loader 的路径) -- "C:\\Users\\Administrator\\Desktop\\wenshuli\\client\\demo\\webpack\\00_process\\node_modules\\babel-loader\\lib\\index.js??ruleSet[1].rules[1].use!C:\\Users\\Administrator\\Desktop\\wenshuli\\client\\demo\\webpack\\00_process\\node_modules\\eslint-loader\\dist\\cjs.js??ruleSet[1].rules[0]!C:\\Users\\Administrator\\Desktop\\wenshuli\\client\\demo\\webpack\\00_process\\src\\index.js"
		 * 				resource: 模块的绝对路径(不包含 loader) -- "C:\\Users\\Administrator\\Desktop\\wenshuli\\client\\demo\\webpack\\00_process\\src\\index.js"
		 * 	2. 使用相关数据生成模块实例
		 */
		factory.create(
			{
				contextInfo: {
					issuer: originModule ? originModule.nameForCondition() : "",
					issuerLayer: originModule ? originModule.layer : null,
					compiler: this.compiler.name,
					...contextInfo
				},
				resolveOptions: originModule ? originModule.resolveOptions : undefined,
				context: context
					? context
					: originModule
					? originModule.context
					: this.compiler.context, // 上下文路径 - 如果传入则使用传入的，没有传入从导入模块的 context 取出
				dependencies: dependencies // 依赖项数组
			},
			// 创建模块实例化结束
			(err, result) => {
				if (result) {
					// TODO webpack 6: remove
					// For backward-compat
					// 如果返回值只是一个 module 实例的话，重组 result 值 -- 应该是兼容旧版本
					if (result.module === undefined && result instanceof Module) {
						result = {
							module: result
						};
					}
					// ？？？
					if (!factoryResult) {
						const {
							fileDependencies,
							contextDependencies,
							missingDependencies
						} = result;
						if (fileDependencies) {
							this.fileDependencies.addAll(fileDependencies);
						}
						if (contextDependencies) {
							this.contextDependencies.addAll(contextDependencies);
						}
						if (missingDependencies) {
							this.missingDependencies.addAll(missingDependencies);
						}
					}
				}
				// 存在错误的话
				if (err) {
					// 构建一个模块构建错误信息
					const notFoundError = new ModuleNotFoundError(
						originModule,
						err,
						dependencies.map(d => d.loc).filter(Boolean)[0]
					);
					return callback(notFoundError, factoryResult ? result : undefined);
				}
				// 如果不存在返回值的话，直接 callback -- 可能是忽略这个模块构建
				if (!result) {
					return callback();
				}

				// 统计模块信息
				if (currentProfile !== undefined) {
					currentProfile.markFactoryEnd();
				}
				
				callback(null, factoryResult ? result : result.module);
			}
		);
	}

	/**
	 * @param {string} context context string path
	 * @param {Dependency} dependency dependency used to create Module chain
	 * @param {ModuleCallback} callback callback for when module chain is complete
	 * @returns {void} will throw if dependency instance is not a valid Dependency
	 */
	addModuleChain(context, dependency, callback) {
		return this.addModuleTree({ context, dependency }, callback);
	}

	/**
	 * 添加一个根模块 - 一般为入口模块，也可能是其他插件插入的根模块，总而言之，这是一个模块依赖图的起点
	 * @param {Object} options options
	 * @param {string} options.context context string path 上下文路径
	 * @param {Dependency} options.dependency dependency used to create Module chain 用于创建模块链的依赖项
	 * @param {Partial<ModuleFactoryCreateDataContextInfo>=} options.contextInfo additional context info for the root module 根模块的其他上下文信息
	 * @param {ModuleCallback} callback callback for when module chain is complete 模块链完成时的回调
	 * @returns {void} will throw if dependency instance is not a valid Dependency 如果依赖项实例不是有效的依赖项，将抛出
	 */
	addModuleTree({ context, dependency, contextInfo }, callback) {
		// 如果当前依赖不符合规范，直接返回错误
		if (
			typeof dependency !== "object" ||
			dependency === null ||
			!dependency.constructor
		) {
			return callback(
				new WebpackError("Parameter 'dependency' must be a Dependency") // 参数“dependency”必须是依赖项
			);
		}
		const Dep = /** @type {DepConstructor} */ (dependency.constructor); // 当前依赖对象的构造器 - 表示这个依赖的类型
		// 根据依赖提取出这个依赖对应的模块构造器 -- 一般而言为 NormalModuleFactory(./NormalModuleFactory.js) 或 ContextModuleFactory
		const moduleFactory = this.dependencyFactories.get(Dep); 
		if (!moduleFactory) {
			return callback(
				new WebpackError(
					`No dependency factory available for this dependency type: ${dependency.constructor.name}` // 此依赖项类型没有可用的依赖项工厂
				)
			);
		}

		// 启动根模块的构建，完成根模块下所有依赖的模块构建完成
		this.handleModuleCreation(
			{
				factory: moduleFactory, // 模块构造器
				dependencies: [dependency], // 依赖项 - 拼装成数组
				originModule: null, // 源模块(引用该模块的模块)
				contextInfo, // 模块的其他上下文信息
				context // 上下文路径
			},
			(err, result) => {
				if (err && this.bail) {
					// 构建过程中出现错误，抛出错误，停止模块的构建过程
					callback(err);
					this.buildQueue.stop();
					this.rebuildQueue.stop();
					this.processDependenciesQueue.stop();
					this.factorizeQueue.stop();
				} else if (!err && result) {
					// 没有出错并且存在返回值(根模块实例)
					callback(null, result);
				} else {
					callback();
				}
			}
		);
	}

	/**
	 * 模块构建启动处 -- 从入口点开始，分解每个请求，解析文件内容以查找进一步的请求，然后通过分解所有请求以及解析新的文件来爬取全部文件。
	 * @param {string} context context path for entry 入口的的上下文路径 -- "C:\\Users\\Administrator\\Desktop\\wenshuli\\client\\demo\\webpack\\02_loader"
	 * @param {Dependency} entry entry dependency that should be followed 应该遵循的入口依赖关系（入口依赖对象 - 包含着入口路径等信息）
	 * @param {string | EntryOptions} optionsOrName options or deprecated name of entry 选项或不推荐使用的入口名称（当前入口的配置项 -- EntryOptions）
	 * @param {ModuleCallback} callback callback function 编译完成后执行回调
	 * @returns {void} returns
	 */
	addEntry(context, entry, optionsOrName, callback) {
		// TODO webpack 6 remove webpack 6 删除
		const options =
			typeof optionsOrName === "object"
				? optionsOrName
				: { name: optionsOrName };

		this._addEntryItem(context, entry, "dependencies", options, callback);
	}

	/**
	 * @param {string} context context path for entry
	 * @param {Dependency} dependency dependency that should be followed
	 * @param {EntryOptions} options options
	 * @param {ModuleCallback} callback callback function
	 * @returns {void} returns
	 */
	addInclude(context, dependency, options, callback) {
		this._addEntryItem(
			context,
			dependency,
			"includeDependencies",
			options,
			callback
		);
	}

	/**
	 * @param {string} context context path for entry 入口的的上下文路径 -- "C:\\Users\\Administrator\\Desktop\\wenshuli\\client\\demo\\webpack\\02_loader"
	 * @param {Dependency} entry entry dependency that should be followed 应该遵循的入口依赖关系
	 * @param {"dependencies" | "includeDependencies"} target type of entry 入口类型
	 * @param {EntryOptions} options options
	 * @param {ModuleCallback} callback callback function 编译完成后执行回调
	 * @returns {void} returns
	 */
	_addEntryItem(context, entry, target, options, callback) {
		const { name } = options; // 入口名称(webpack.options.entry 的 key，一般用来表示入口 name)
		// 入口相关数据
		let entryData =
			name !== undefined ? this.entries.get(name) /** 应该是缓存相关 */ : this.globalEntry;
		// 应该是跟多入口有关(或者插件直接调用 Compilation.addEntry 方法)或其他方法
		if (entryData === undefined) {
			entryData = {
				dependencies: [],
				includeDependencies: [],
				options: {
					name: undefined,
					...options
				}
			};
			entryData[target].push(entry);
			this.entries.set(name, entryData); // 缓存， 根据 name 进行缓存
		} else {
			entryData[target].push(entry);
			for (const key of Object.keys(options)) {
				if (options[key] === undefined) continue;
				if (entryData.options[key] === options[key]) continue;
				if (
					Array.isArray(entryData.options[key]) &&
					Array.isArray(options[key]) &&
					arrayEquals(entryData.options[key], options[key])
				) {
					continue;
				}
				if (entryData.options[key] === undefined) {
					entryData.options[key] = options[key];
				} else {
					return callback(
						new WebpackError(
							`Conflicting entry option ${key} = ${entryData.options[key]} vs ${options[key]}`
						)
					);
				}
			}
		}

		// addEntry 钩子 -- 既没有暴露给开发者，webpack 内部也没有使用
		this.hooks.addEntry.call(entry, options);

		// 接着流程交由 addModuleTree 方法，完成入口模块的构建，并递归触摸所有的依赖进行构建，构建完毕后执行回调
		this.addModuleTree(
			{
				context, // 项目上下文 - webpack.options.context 配置项
				dependency: entry, // 依赖
				contextInfo: entryData.options.layer // 图层 - 似乎是实验功能
					? { issuerLayer: entryData.options.layer }
					: undefined
			},
			(err, module) => {
				if (err) {
					// 如果出错，执行 failedEntry 钩子：入口构建失败
					this.hooks.failedEntry.call(entry, options, err);
					return callback(err);
				}
				// 成功执行 succeedEntry 钩子；入口构建成功
				this.hooks.succeedEntry.call(entry, options, module);
				return callback(null, module);
			}
		);
	}

	/**
	 * @param {Module} module module to be rebuilt
	 * @param {ModuleCallback} callback callback when module finishes rebuilding
	 * @returns {void}
	 */
	rebuildModule(module, callback) {
		this.rebuildQueue.add(module, callback);
	}

	/**
	 * @param {Module} module module to be rebuilt
	 * @param {ModuleCallback} callback callback when module finishes rebuilding
	 * @returns {void}
	 */
	_rebuildModule(module, callback) {
		this.hooks.rebuildModule.call(module);
		const oldDependencies = module.dependencies.slice();
		const oldBlocks = module.blocks.slice();
		module.invalidateBuild();
		this.buildQueue.invalidate(module);
		this.buildModule(module, err => {
			if (err) {
				return this.hooks.finishRebuildingModule.callAsync(module, err2 => {
					if (err2) {
						callback(
							makeWebpackError(err2, "Compilation.hooks.finishRebuildingModule")
						);
						return;
					}
					callback(err);
				});
			}

			this.processDependenciesQueue.invalidate(module);
			this.moduleGraph.unfreeze();
			this.processModuleDependencies(module, err => {
				if (err) return callback(err);
				this.removeReasonsOfDependencyBlock(module, {
					dependencies: oldDependencies,
					blocks: oldBlocks
				});
				this.hooks.finishRebuildingModule.callAsync(module, err2 => {
					if (err2) {
						callback(
							makeWebpackError(err2, "Compilation.hooks.finishRebuildingModule")
						);
						return;
					}
					callback(null, module);
				});
			});
		});
	}

	_computeAffectedModules(modules) {
		const moduleMemCacheCache = this.compiler.moduleMemCaches;
		if (!moduleMemCacheCache) return;
		if (!this.moduleMemCaches) {
			this.moduleMemCaches = new Map();
			this.moduleGraph.setModuleMemCaches(this.moduleMemCaches);
		}
		const { moduleGraph, moduleMemCaches } = this;
		const affectedModules = new Set();
		const infectedModules = new Set();
		let statNew = 0;
		let statChanged = 0;
		let statUnchanged = 0;
		let statReferencesChanged = 0;
		let statWithoutBuild = 0;

		const computeReferences = module => {
			/** @type {WeakMap<Dependency, Module>} */
			let references = undefined;
			for (const connection of moduleGraph.getOutgoingConnections(module)) {
				const d = connection.dependency;
				const m = connection.module;
				if (!d || !m || unsafeCacheDependencies.has(d)) continue;
				if (references === undefined) references = new WeakMap();
				references.set(d, m);
			}
			return references;
		};

		/**
		 * @param {Module} module the module
		 * @param {WeakMap<Dependency, Module>} references references
		 * @returns {boolean} true, when the references differ
		 */
		const compareReferences = (module, references) => {
			if (references === undefined) return true;
			for (const connection of moduleGraph.getOutgoingConnections(module)) {
				const d = connection.dependency;
				if (!d) continue;
				const entry = references.get(d);
				if (entry === undefined) continue;
				if (entry !== connection.module) return false;
			}
			return true;
		};

		const modulesWithoutCache = new Set(modules);
		for (const [module, cachedMemCache] of moduleMemCacheCache) {
			if (modulesWithoutCache.has(module)) {
				const buildInfo = module.buildInfo;
				if (buildInfo) {
					if (cachedMemCache.buildInfo !== buildInfo) {
						// use a new one
						const memCache = new WeakTupleMap();
						moduleMemCaches.set(module, memCache);
						affectedModules.add(module);
						cachedMemCache.buildInfo = buildInfo;
						cachedMemCache.references = computeReferences(module);
						cachedMemCache.memCache = memCache;
						statChanged++;
					} else if (!compareReferences(module, cachedMemCache.references)) {
						// use a new one
						const memCache = new WeakTupleMap();
						moduleMemCaches.set(module, memCache);
						affectedModules.add(module);
						cachedMemCache.references = computeReferences(module);
						cachedMemCache.memCache = memCache;
						statReferencesChanged++;
					} else {
						// keep the old mem cache
						moduleMemCaches.set(module, cachedMemCache.memCache);
						statUnchanged++;
					}
				} else {
					infectedModules.add(module);
					moduleMemCacheCache.delete(module);
					statWithoutBuild++;
				}
				modulesWithoutCache.delete(module);
			} else {
				moduleMemCacheCache.delete(module);
			}
		}

		for (const module of modulesWithoutCache) {
			const buildInfo = module.buildInfo;
			if (buildInfo) {
				// create a new entry
				const memCache = new WeakTupleMap();
				moduleMemCacheCache.set(module, {
					buildInfo,
					references: computeReferences(module),
					memCache
				});
				moduleMemCaches.set(module, memCache);
				affectedModules.add(module);
				statNew++;
			} else {
				infectedModules.add(module);
				statWithoutBuild++;
			}
		}

		const reduceAffectType = connections => {
			let affected = false;
			for (const { dependency } of connections) {
				if (!dependency) continue;
				const type = dependency.couldAffectReferencingModule();
				if (type === Dependency.TRANSITIVE) return Dependency.TRANSITIVE;
				if (type === false) continue;
				affected = true;
			}
			return affected;
		};
		const directOnlyInfectedModules = new Set();
		for (const module of infectedModules) {
			for (const [
				referencingModule,
				connections
			] of moduleGraph.getIncomingConnectionsByOriginModule(module)) {
				if (!referencingModule) continue;
				if (infectedModules.has(referencingModule)) continue;
				const type = reduceAffectType(connections);
				if (!type) continue;
				if (type === true) {
					directOnlyInfectedModules.add(referencingModule);
				} else {
					infectedModules.add(referencingModule);
				}
			}
		}
		for (const module of directOnlyInfectedModules) infectedModules.add(module);
		const directOnlyAffectModules = new Set();
		for (const module of affectedModules) {
			for (const [
				referencingModule,
				connections
			] of moduleGraph.getIncomingConnectionsByOriginModule(module)) {
				if (!referencingModule) continue;
				if (infectedModules.has(referencingModule)) continue;
				if (affectedModules.has(referencingModule)) continue;
				const type = reduceAffectType(connections);
				if (!type) continue;
				if (type === true) {
					directOnlyAffectModules.add(referencingModule);
				} else {
					affectedModules.add(referencingModule);
				}
				const memCache = new WeakTupleMap();
				const cache = moduleMemCacheCache.get(referencingModule);
				cache.memCache = memCache;
				moduleMemCaches.set(referencingModule, memCache);
			}
		}
		for (const module of directOnlyAffectModules) affectedModules.add(module);
		this.logger.log(
			`${Math.round(
				(100 * (affectedModules.size + infectedModules.size)) /
					this.modules.size
			)}% (${affectedModules.size} affected + ${
				infectedModules.size
			} infected of ${
				this.modules.size
			}) modules flagged as affected (${statNew} new modules, ${statChanged} changed, ${statReferencesChanged} references changed, ${statUnchanged} unchanged, ${statWithoutBuild} were not built)`
		);
	}

	_computeAffectedModulesWithChunkGraph() {
		const { moduleMemCaches } = this;
		if (!moduleMemCaches) return;
		const moduleMemCaches2 = (this.moduleMemCaches2 = new Map());
		const { moduleGraph, chunkGraph } = this;
		const key = "memCache2";
		let statUnchanged = 0;
		let statChanged = 0;
		let statNew = 0;
		/**
		 * @param {Module} module module
		 * @returns {{ id: string | number, modules?: Map<Module, string | number | undefined>, blocks?: (string | number)[] }} references
		 */
		const computeReferences = module => {
			const id = chunkGraph.getModuleId(module);
			/** @type {Map<Module, string | number | undefined>} */
			let modules = undefined;
			/** @type {(string | number)[] | undefined} */
			let blocks = undefined;
			const outgoing = moduleGraph.getOutgoingConnectionsByModule(module);
			if (outgoing !== undefined) {
				for (const m of outgoing.keys()) {
					if (!m) continue;
					if (modules === undefined) modules = new Map();
					modules.set(m, chunkGraph.getModuleId(m));
				}
			}
			if (module.blocks.length > 0) {
				blocks = [];
				const queue = Array.from(module.blocks);
				for (const block of queue) {
					const chunkGroup = chunkGraph.getBlockChunkGroup(block);
					if (chunkGroup) {
						for (const chunk of chunkGroup.chunks) {
							blocks.push(chunk.id);
						}
					} else {
						blocks.push(null);
					}
					queue.push.apply(queue, block.blocks);
				}
			}
			return { id, modules, blocks };
		};
		/**
		 * @param {Module} module module
		 * @param {Object} references references
		 * @param {string | number} references.id id
		 * @param {Map<Module, string | number>=} references.modules modules
		 * @param {(string | number)[]=} references.blocks blocks
		 * @returns {boolean} ok?
		 */
		const compareReferences = (module, { id, modules, blocks }) => {
			if (id !== chunkGraph.getModuleId(module)) return false;
			if (modules !== undefined) {
				for (const [module, id] of modules) {
					if (chunkGraph.getModuleId(module) !== id) return false;
				}
			}
			if (blocks !== undefined) {
				const queue = Array.from(module.blocks);
				let i = 0;
				for (const block of queue) {
					const chunkGroup = chunkGraph.getBlockChunkGroup(block);
					if (chunkGroup) {
						for (const chunk of chunkGroup.chunks) {
							if (i >= blocks.length || blocks[i++] !== chunk.id) return false;
						}
					} else {
						if (i >= blocks.length || blocks[i++] !== null) return false;
					}
					queue.push.apply(queue, block.blocks);
				}
				if (i !== blocks.length) return false;
			}
			return true;
		};

		for (const [module, memCache] of moduleMemCaches) {
			/** @type {{ references: { id: string | number, modules?: Map<Module, string | number | undefined>, blocks?: (string | number)[]}, memCache: WeakTupleMap<any[], any> }} */
			const cache = memCache.get(key);
			if (cache === undefined) {
				const memCache2 = new WeakTupleMap();
				memCache.set(key, {
					references: computeReferences(module),
					memCache: memCache2
				});
				moduleMemCaches2.set(module, memCache2);
				statNew++;
			} else if (!compareReferences(module, cache.references)) {
				const memCache = new WeakTupleMap();
				cache.references = computeReferences(module);
				cache.memCache = memCache;
				moduleMemCaches2.set(module, memCache);
				statChanged++;
			} else {
				moduleMemCaches2.set(module, cache.memCache);
				statUnchanged++;
			}
		}

		this.logger.log(
			`${Math.round(
				(100 * statChanged) / (statNew + statChanged + statUnchanged)
			)}% modules flagged as affected by chunk graph (${statNew} new modules, ${statChanged} changed, ${statUnchanged} unchanged)`
		);
	}

	/**
	 * 在所有模块构建完成后从模块中提取一些信息，例如：遍历所有 module 将 export 出来的变量以数组的形式，单独存储到 module.buildMeta.providedExports变量下。
	 * 																						 遍历所有 module 将错误和警告信息提取出来等等
	 */
	finish(callback) {
		this.factorizeQueue.clear(); // 创建模块实例的启动进程清空
		// 是否统计模块信息
		if (this.profile) {
			this.logger.time("finish module profiles");
			const ParallelismFactorCalculator = require("./util/ParallelismFactorCalculator");
			const p = new ParallelismFactorCalculator();
			const moduleGraph = this.moduleGraph;
			const modulesWithProfiles = new Map();
			for (const module of this.modules) {
				const profile = moduleGraph.getProfile(module);
				if (!profile) continue;
				modulesWithProfiles.set(module, profile);
				p.range(
					profile.buildingStartTime,
					profile.buildingEndTime,
					f => (profile.buildingParallelismFactor = f)
				);
				p.range(
					profile.factoryStartTime,
					profile.factoryEndTime,
					f => (profile.factoryParallelismFactor = f)
				);
				p.range(
					profile.integrationStartTime,
					profile.integrationEndTime,
					f => (profile.integrationParallelismFactor = f)
				);
				p.range(
					profile.storingStartTime,
					profile.storingEndTime,
					f => (profile.storingParallelismFactor = f)
				);
				p.range(
					profile.restoringStartTime,
					profile.restoringEndTime,
					f => (profile.restoringParallelismFactor = f)
				);
				if (profile.additionalFactoryTimes) {
					for (const { start, end } of profile.additionalFactoryTimes) {
						const influence = (end - start) / profile.additionalFactories;
						p.range(
							start,
							end,
							f =>
								(profile.additionalFactoriesParallelismFactor += f * influence)
						);
					}
				}
			}
			p.calculate();

			const logger = this.getLogger("webpack.Compilation.ModuleProfile");
			const logByValue = (value, msg) => {
				if (value > 1000) {
					logger.error(msg);
				} else if (value > 500) {
					logger.warn(msg);
				} else if (value > 200) {
					logger.info(msg);
				} else if (value > 30) {
					logger.log(msg);
				} else {
					logger.debug(msg);
				}
			};
			const logNormalSummary = (category, getDuration, getParallelism) => {
				let sum = 0;
				let max = 0;
				for (const [module, profile] of modulesWithProfiles) {
					const p = getParallelism(profile);
					const d = getDuration(profile);
					if (d === 0 || p === 0) continue;
					const t = d / p;
					sum += t;
					if (t <= 10) continue;
					logByValue(
						t,
						` | ${Math.round(t)} ms${
							p >= 1.1 ? ` (parallelism ${Math.round(p * 10) / 10})` : ""
						} ${category} > ${module.readableIdentifier(this.requestShortener)}`
					);
					max = Math.max(max, t);
				}
				if (sum <= 10) return;
				logByValue(
					Math.max(sum / 10, max),
					`${Math.round(sum)} ms ${category}`
				);
			};
			const logByLoadersSummary = (category, getDuration, getParallelism) => {
				const map = new Map();
				for (const [module, profile] of modulesWithProfiles) {
					const list = provide(
						map,
						module.type + "!" + module.identifier().replace(/(!|^)[^!]*$/, ""),
						() => []
					);
					list.push({ module, profile });
				}

				let sum = 0;
				let max = 0;
				for (const [key, modules] of map) {
					let innerSum = 0;
					let innerMax = 0;
					for (const { module, profile } of modules) {
						const p = getParallelism(profile);
						const d = getDuration(profile);
						if (d === 0 || p === 0) continue;
						const t = d / p;
						innerSum += t;
						if (t <= 10) continue;
						logByValue(
							t,
							` |  | ${Math.round(t)} ms${
								p >= 1.1 ? ` (parallelism ${Math.round(p * 10) / 10})` : ""
							} ${category} > ${module.readableIdentifier(
								this.requestShortener
							)}`
						);
						innerMax = Math.max(innerMax, t);
					}
					sum += innerSum;
					if (innerSum <= 10) continue;
					const idx = key.indexOf("!");
					const loaders = key.slice(idx + 1);
					const moduleType = key.slice(0, idx);
					const t = Math.max(innerSum / 10, innerMax);
					logByValue(
						t,
						` | ${Math.round(innerSum)} ms ${category} > ${
							loaders
								? `${
										modules.length
								  } x ${moduleType} with ${this.requestShortener.shorten(
										loaders
								  )}`
								: `${modules.length} x ${moduleType}`
						}`
					);
					max = Math.max(max, t);
				}
				if (sum <= 10) return;
				logByValue(
					Math.max(sum / 10, max),
					`${Math.round(sum)} ms ${category}`
				);
			};
			logNormalSummary(
				"resolve to new modules",
				p => p.factory,
				p => p.factoryParallelismFactor
			);
			logNormalSummary(
				"resolve to existing modules",
				p => p.additionalFactories,
				p => p.additionalFactoriesParallelismFactor
			);
			logNormalSummary(
				"integrate modules",
				p => p.restoring,
				p => p.restoringParallelismFactor
			);
			logByLoadersSummary(
				"build modules",
				p => p.building,
				p => p.buildingParallelismFactor
			);
			logNormalSummary(
				"store modules",
				p => p.storing,
				p => p.storingParallelismFactor
			);
			logNormalSummary(
				"restore modules",
				p => p.restoring,
				p => p.restoringParallelismFactor
			);
			this.logger.timeEnd("finish module profiles");
		}
		this.logger.time("compute affected modules");
		this._computeAffectedModules(this.modules); // 计算受影响的模块？？
		this.logger.timeEnd("compute affected modules");
		this.logger.time("finish modules");
		const { modules, moduleMemCaches } = this;
		/**
		 * 所有模块都完成构建并且没有错误时执行 -- 异步串联执行
		 */
		this.hooks.finishModules.callAsync(modules, err => {
			this.logger.timeEnd("finish modules");
			if (err) return callback(err);

			// extract warnings and errors from modules 从模块中提取警告和错误
			this.moduleGraph.freeze("dependency errors");
			// TODO keep a cacheToken (= {}) for each module in the graph TODO为图中的每个模块保留一个缓存令牌(= {})
			// create a new one per compilation and flag all updated files 每次编译创建一个新文件，并标记所有更新的文件
			// and parents with it 和父母一起
			this.logger.time("report dependency errors and warnings");
			for (const module of modules) {
				// TODO only run for modules with changed cacheToken TODO只在更改了缓存令牌的模块中运行
				// global WeakMap<CacheToken, WeakSet<Module>> to keep modules without errors/warnings 全局弱映射< Cache令牌，弱集合<模块>>以保持模块没有错误/警告
				// 推测应该在 watch 模式下，重新编译时，只收集变更的模块错误和警告
				const memCache = moduleMemCaches && moduleMemCaches.get(module);
				if (memCache && memCache.get("noWarningsOrErrors")) continue;
				// 下面的错误和警告并不会阻止构建，只是会在控制台中显示
				/**
				 * 这里的错误和警告是什么呢？
				 */
				let hasProblems = this.reportDependencyErrorsAndWarnings(module, [
					module
				]);
				// 这里的错误和警告，可以由 loader 发出
				const errors = module.getErrors();
				if (errors !== undefined) {
					for (const error of errors) {
						if (!error.module) {
							error.module = module; // 绑定错误信息的模块引用
						}
						this.errors.push(error); // 推入到所有模块构建错误集合
						hasProblems = true; // 标记存在模块错误或警告
					}
				}
				const warnings = module.getWarnings(); // 获取当前模块警告列表
				if (warnings !== undefined) {
					for (const warning of warnings) {
						if (!warning.module) {
							warning.module = module;
						}
						this.warnings.push(warning);
						hasProblems = true;
					}
				}
				if (!hasProblems && memCache) memCache.set("noWarningsOrErrors", true);
			}
			this.moduleGraph.unfreeze();
			this.logger.timeEnd("report dependency errors and warnings"); // 报告依赖项错误和警告

			callback();
		});
	}

	unseal() {
		this.hooks.unseal.call();
		this.chunks.clear();
		this.chunkGroups.length = 0;
		this.namedChunks.clear();
		this.namedChunkGroups.clear();
		this.entrypoints.clear();
		this.additionalChunkAssets.length = 0;
		this.assets = {};
		this.assetsInfo.clear();
		this.moduleGraph.removeAllModuleAttributes();
		this.moduleGraph.unfreeze();
		this.moduleMemCaches2 = undefined;
	}

	/**
	 * @param {Callback} callback signals when the call finishes 调用结束时发出的信号
	 * @returns {void}
	 */
	seal(callback) {
		const finalCallback = err => {
			this.factorizeQueue.clear();
			this.buildQueue.clear();
			this.rebuildQueue.clear();
			this.processDependenciesQueue.clear();
			this.addModuleQueue.clear();
			return callback(err);
		};
		// 创建 chunk 图 - 这个 chunkGraph 图是唯一的，用来描述 chunk 的关系 -- 注意与 chunkGroup 的区别
		const chunkGraph = new ChunkGraph(
			this.moduleGraph,
			this.outputOptions.hashFunction // hash 散列算法
		);
		this.chunkGraph = chunkGraph;

		// this._backCompat：为许多 webpack 4 api 启用后向兼容层，并发出弃用警告。
		if (this._backCompat) { 
			// 遍历所有模块
			for (const module of this.modules) {
				ChunkGraph.setChunkGraphForModule(module, chunkGraph);
			}
		}

		/**
		 * compilation 对象停止接收新的模块时触发
		 */
		this.hooks.seal.call();

		this.logger.time("optimize dependencies");
		/**
		 * optimizeDependencies：依赖优化开始时触发。
		 * 如果任何事件函数存在返回值，那么会立即中断后续事件函数的调用
		 */
		while (this.hooks.optimizeDependencies.call(this.modules)) {
			/* empty */
			// ?
		}
		/**
		 * 依赖优化之后触发。
		 */
		this.hooks.afterOptimizeDependencies.call(this.modules);
		this.logger.timeEnd("optimize dependencies");

		this.logger.time("create chunks");
		/**
		 * 开始生成 chunks 触发
		 */
		this.hooks.beforeChunks.call();
		this.moduleGraph.freeze("seal");
		/**
		 * 收集入口 Entrypoint 与 ModuleList，即建立入口 Entrypint(继承至ChunkGroup)的 entryModule
		 * e.g：
		 * 	entry {
		 * 		main: {
		 * 			import: ['./src/index02.js', './src/index.js']
		 * 		}
		 *  }
		 * 此时就会生成
		 * chunkGraphInit map<entrypoint, module[]> {
		 * 	Entrypoint: [Module, Module]
		 * }
		 */
		/** @type {Map<Entrypoint, Module[]>} */
		const chunkGraphInit = new Map(); 
		/**
		 * 遍历 entry：主要用于处理 entryChunk、entryModule、Entrypoint 之间的关系
		 * 	1. 为每个 entry 生成一个 entryChunk
		 * 	2. 为每个 entry 生成一个 Entrypoint(继承至 ChunkGroup)，用于描述 entry 相关 chunk
		 * 	3. 建立 Entrypoint(继承至 ChunkGroup) 与 entryChunk 的联系
		 *  4. 遍历 entry.deps(即 entry.options.import)，这几个都表示 entryModule
		 * 			- 根据 EntryDependency 提取出 entryModule
		 * 			- 连接 entryChunk 和 entryModule
		 * 			- 将一个入口生成的模块收集到 modulesList 中。
		 * 					e.g：
		 * 						entry {
		 * 							main: {
		 * 								import: ['./src/index02.js', './src/index.js']
		 * 							}
		 * 					 }
		 * 					此时就会生成
		 * 					chunkGraphInit map<entrypoint, module[]> {
		 * 						Entrypoint: [Module, Module]
		 * 					}
		 */
		for (const [name /** 入口名称 */, { dependencies, includeDependencies, options /** 入口配置项 */ }] of this.entries) {
			const chunk = this.addChunk(name);
			// options.filename：默认情况下，入口 chunk 的输出文件名是从 output.filename 中提取出来的，但你可以为特定的入口指定一个自定义的输出文件名。
			if (options.filename) {
				chunk.filenameTemplate = options.filename; // chunk 的输出文件名
			}
			const entrypoint = new Entrypoint(options);
			/**
			 * https://webpack.docschina.org/concepts/entry-points/
			 * 	options.dependOn：当前入口所依赖的入口。它们必须在该入口被加载前被加载。
			 * 	options.runtime：运行时 chunk 的名字。如果设置了，就会创建一个新的运行时 chunk。
			 * 		- options.runtime 会生成一个新的 chunk，是 webpack 的 runtime(https://webpack.docschina.org/concepts/manifest/#runtime)
			 * 	这两个配置项指向的 chunk 都需要在这个 chunk 之前先进行加载，也就是这个 chunk 依赖 chunk
			 *  并且如果设置了 optimization.runtimeChunk 的话，那么就相当于设置 options.runtime
			 * 
			 * 如果 dependOn 和 runtime 都不存在，那么就说明 webpack runtime(在浏览器运行过程中，webpack 用来连接模块化应用程序所需的所有代码。) 会内嵌在这个 entryChunk 中
			 */
			if (!options.dependOn && !options.runtime) {
				entrypoint.setRuntimeChunk(chunk);
			}
			entrypoint.setEntrypointChunk(chunk); // 设置 entrypoint 的 entryChunk
			this.namedChunkGroups.set(name, entrypoint); // 将该 entrypoint 推入到 namedChunkGroups 集合中
			this.entrypoints.set(name, entrypoint); // 推入到 entrypoints 集合中
			this.chunkGroups.push(entrypoint); // 推入到 chunkGroups 集合中
			/**
			 * 建立 Entrypoint(继承至 ChunkGroup) 与 chunk 的连接
			 *  1. 将该 chunk 推入到 chunkGroup.chunks 集合中
			 *  2. 将该 chunkGroup 推入到 chunk._groups 集合中
			 */
			connectChunkGroupAndChunk(entrypoint, chunk);

			const entryModules = new Set(); // 入口模块集合
			for (const dep of [...this.globalEntry.dependencies /** 全局 entry 依赖？ */, ...dependencies /** 入口依赖(即入口文件) */]) {
				entrypoint.addOrigin(null, { name }, /** @type {any} */ (dep).request);

				const module = this.moduleGraph.getModule(dep); // 根据入口依赖查找到入口模块
				if (module) {
					// 连接 chunk 和 entryModule 关系
					chunkGraph.connectChunkAndEntryModule(chunk, module, entrypoint);
					entryModules.add(module); // 将该模块推入到集合
					/**
					 * 将一个入口生成的模块收集到 modulesList 中。
					 * e.g：
					 * 	entry {
					 * 		main: {
					 * 			import: ['./src/index02.js', './src/index.js']
					 * 		}
					 *  }
					 * 此时就会生成
					 * chunkGraphInit map<entrypoint, module[]> {
					 * 	Entrypoint: [Module, Module]
					 * }
					 */
					const modulesList = chunkGraphInit.get(entrypoint);
					if (modulesList === undefined) {
						chunkGraphInit.set(entrypoint, [module]);
					} else {
						modulesList.push(module);
					}
				}
			}

			// ？
			this.assignDepths(entryModules);
		
			// 对依赖项集合提取模块并对模块进行排序
			const mapAndSort = deps =>
				deps
					.map(dep => this.moduleGraph.getModule(dep)) // 根据依赖项提取模块
					.filter(Boolean) // 过滤 falsy 值
					.sort(compareModulesByIdentifier); // 模块进行排序
			// 当前入口需要的额外模块？
			const includedModules = [
				...mapAndSort(this.globalEntry.includeDependencies),
				...mapAndSort(includeDependencies)
			];

			// 如果当前入口没有一个模块的话，初始化为 []
			let modulesList = chunkGraphInit.get(entrypoint);
			if (modulesList === undefined) {
				chunkGraphInit.set(entrypoint, (modulesList = []));
			}
			for (const module of includedModules) {
				this.assignDepth(module);
				modulesList.push(module);
			}
		}
		const runtimeChunks = new Set(); // runtime(webpack运行时chunk) chunk 集合
		/**
		 * 继续遍历 entrys，主要用于处理 runtimeChunk
		 *  处理 entry.options.depenOn 和 entry.options.runtime
		 * 	 - 如果同时存在这两个选项，错误提示
		 * 	 - entry.options.depenOn：？？？
		 * 	 - entry.options.runtime：
		 * 			- 如果已经存在这个 runtime 名称的 chunk 的话
		 * 					- 如果这个已存在的 chunk 是 runtimeChunk 的话，重用 chunk
		 * 					- 如果这个已存在的 chunk 不是 runtimeChunk 的话，添加一个错误，并退出本次循环
		 * 			- 如果不存在的话，新建一个 chunk
		 * 	 		- 将该 runtimeChunk 移动到 Entrypoint.chunks 最前端，表示加载 entryChunk 前需要先加载 runtimeChunk，设置 Entrypoint 的 rumtimeChunk 为该 rumtimeChunk
		 */
		outer: for (const [
			name, // 入口名称
			{
				options: { dependOn /** 当前入口所依赖的入口。它们必须在该入口被加载前被加载。 */, runtime /** 运行时 chunk 的名字。 */ }
			}
		] of this.entries) {
			// dependOn 和 runtime 不能同时使用，只需要包含一份运行时代码即可
			if (dependOn && runtime) {
				const err =
					new WebpackError(`Entrypoint '${name}' has 'dependOn' and 'runtime' specified. This is not valid. // 入口点“${name}”已经指定了“depend On”和“runtime”。这是无效的
Entrypoints that depend on other entrypoints do not have their own runtime. // 依赖于其他入口点的入口点没有自己的运行时
They will use the runtime(s) from referenced entrypoints instead. // 它们将使用来自引用入口点的运行时
Remove the 'runtime' option from the entrypoint.`); // 从入口点移除'runtime'选项
				const entry = this.entrypoints.get(name); // 获取当前入口的 Entrypoint
				err.chunk = entry.getEntrypointChunk();
				this.errors.push(err); // 添加一个错误
			}
			// dependOn：当前入口所依赖的入口。它们必须在该入口被加载前被加载。
			if (dependOn) {
				const entry = this.entrypoints.get(name); // 获取当前入口的 Entrypoint
				const referencedChunks = entry
					.getEntrypointChunk() // 入口起点 chunk
					.getAllReferencedChunks();
				const dependOnEntries = [];
				for (const dep of dependOn) {
					const dependency = this.entrypoints.get(dep);
					if (!dependency) {
						throw new Error(
							`Entry ${name} depends on ${dep}, but this entry was not found` // 条目${name}依赖于${dep}，但是没有找到该条目
						);
					}
					if (referencedChunks.has(dependency.getEntrypointChunk())) {
						const err = new WebpackError(
							`Entrypoints '${name}' and '${dep}' use 'dependOn' to depend on each other in a circular way.` // 入口点'${name}'和'${dep}'使用'depend On'以循环的方式相互依赖
						);
						const entryChunk = entry.getEntrypointChunk();
						err.chunk = entryChunk;
						this.errors.push(err);
						entry.setRuntimeChunk(entryChunk);
						continue outer;
					}
					dependOnEntries.push(dependency);
				}
				for (const dependency of dependOnEntries) {
					connectChunkGroupParentAndChild(dependency, entry);
				}
			} else if (runtime) {
				const entry = this.entrypoints.get(name); // 获取当前入口的 Entrypoint
				let chunk = this.namedChunks.get(runtime); // 根据 runtime 提取一下 chunk
				// 如果已经存在 rumtime 同样名称的 chunk 的话
				if (chunk) {
					// 并且这个 chunk 不是 runtime(运行时代码) 的话
					if (!runtimeChunks.has(chunk)) {
						// 入口点'${name}'有一个'runtime'选项，它指向另一个名为'${runtime}'的入口点。
						// 使用其他入口点作为运行时块是无效的
						// 你是想用“depend On”吗
						// 而不是允许使用入口点'${name}'在入口点'${runtime}'的运行时?在使用'${name}'时，必须始终加载'${runtime}'
						// 或者您想使用入口点'${name}'和'${runtime}'独立在一个共享运行时的同一页面上?在本例中，为'runtime'选项提供相同的值。它必须是一个没有被入口点使用过的名称
						const err =
							new WebpackError(`Entrypoint '${name}' has a 'runtime' option which points to another entrypoint named '${runtime}'.
It's not valid to use other entrypoints as runtime chunk.
Did you mean to use 'dependOn: ${JSON.stringify(
								runtime
							)}' instead to allow using entrypoint '${name}' within the runtime of entrypoint '${runtime}'? For this '${runtime}' must always be loaded when '${name}' is used.
Or do you want to use the entrypoints '${name}' and '${runtime}' independently on the same page with a shared runtime? In this case give them both the same value for the 'runtime' option. It must be a name not already used by an entrypoint.`);
						const entryChunk = entry.getEntrypointChunk();
						err.chunk = entryChunk;
						this.errors.push(err); // 推入一个错误
						// 当 rumtime 名称已被占用，并且不是 timetimeChunk 时，重新写入 Entrypoint 的 runtimeChunk 为 entryChunk，即说明 rumtime(运行时代码) 需要嵌入到 entryChunk 中
						entry.setRuntimeChunk(entryChunk);
						continue;
					}
				} else {
					chunk = this.addChunk(runtime); // 添加一个 runtimeChunk
					chunk.preventIntegration = true;
					runtimeChunks.add(chunk); // 推入到集合中
				}
				entry.unshiftChunk(chunk); // 将该 runtimeChunk 移动到 Entrypoint.chunks 最前端，表示加载 entryChunk 前需要先加载 runtimeChunk
				chunk.addGroup(entry); // 建立 chunk 与 Entrypoint(继承 ChunkGroup) 的关系
				entry.setRuntimeChunk(chunk); // 设置 Entrypoint 的 rumtimeChunk 为该 rumtimeChunk
			}
		}

		buildChunkGraph(this, chunkGraphInit);
		/**
		 * 创建 chunk 完成之后触发
		 */
		this.hooks.afterChunks.call(this.chunks);
		this.logger.timeEnd("create chunks");

		this.logger.time("optimize");
		this.hooks.optimize.call();

		while (this.hooks.optimizeModules.call(this.modules)) {
			/* empty */
		}
		this.hooks.afterOptimizeModules.call(this.modules); 

		while (this.hooks.optimizeChunks.call(this.chunks, this.chunkGroups)) {
			/* empty */
		}
		this.hooks.afterOptimizeChunks.call(this.chunks, this.chunkGroups);

		this.hooks.optimizeTree.callAsync(this.chunks, this.modules, err => {
			if (err) {
				return finalCallback(
					makeWebpackError(err, "Compilation.hooks.optimizeTree")
				);
			}

			this.hooks.afterOptimizeTree.call(this.chunks, this.modules);

			this.hooks.optimizeChunkModules.callAsync(
				this.chunks,
				this.modules,
				err => {
					if (err) {
						return finalCallback(
							makeWebpackError(err, "Compilation.hooks.optimizeChunkModules")
						);
					}

					this.hooks.afterOptimizeChunkModules.call(this.chunks, this.modules);

					const shouldRecord = this.hooks.shouldRecord.call() !== false;

					this.hooks.reviveModules.call(this.modules, this.records);
					this.hooks.beforeModuleIds.call(this.modules);
					this.hooks.moduleIds.call(this.modules);
					this.hooks.optimizeModuleIds.call(this.modules);
					this.hooks.afterOptimizeModuleIds.call(this.modules);

					this.hooks.reviveChunks.call(this.chunks, this.records);
					this.hooks.beforeChunkIds.call(this.chunks);
					this.hooks.chunkIds.call(this.chunks);
					this.hooks.optimizeChunkIds.call(this.chunks);
					this.hooks.afterOptimizeChunkIds.call(this.chunks);

					this.assignRuntimeIds();

					this.logger.time("compute affected modules with chunk graph");
					this._computeAffectedModulesWithChunkGraph();
					this.logger.timeEnd("compute affected modules with chunk graph");

					this.sortItemsWithChunkIds();

					if (shouldRecord) {
						this.hooks.recordModules.call(this.modules, this.records);
						this.hooks.recordChunks.call(this.chunks, this.records);
					}

					this.hooks.optimizeCodeGeneration.call(this.modules);
					this.logger.timeEnd("optimize");

					this.logger.time("module hashing");
					this.hooks.beforeModuleHash.call();
					this.createModuleHashes();
					this.hooks.afterModuleHash.call();
					this.logger.timeEnd("module hashing");

					this.logger.time("code generation");
					this.hooks.beforeCodeGeneration.call();
					this.codeGeneration(err => {
						if (err) {
							return finalCallback(err);
						}
						this.hooks.afterCodeGeneration.call();
						this.logger.timeEnd("code generation");

						this.logger.time("runtime requirements");
						this.hooks.beforeRuntimeRequirements.call();
						this.processRuntimeRequirements();
						this.hooks.afterRuntimeRequirements.call();
						this.logger.timeEnd("runtime requirements");

						this.logger.time("hashing");
						this.hooks.beforeHash.call();
						const codeGenerationJobs = this.createHash();
						this.hooks.afterHash.call();
						this.logger.timeEnd("hashing");

						this._runCodeGenerationJobs(codeGenerationJobs, err => {
							if (err) {
								return finalCallback(err);
							}

							if (shouldRecord) {
								this.logger.time("record hash");
								this.hooks.recordHash.call(this.records);
								this.logger.timeEnd("record hash");
							}

							this.logger.time("module assets");
							this.clearAssets();

							this.hooks.beforeModuleAssets.call();
							this.createModuleAssets();
							this.logger.timeEnd("module assets");

							const cont = () => {
								this.logger.time("process assets");
								this.hooks.processAssets.callAsync(this.assets, err => {
									if (err) {
										return finalCallback(
											makeWebpackError(err, "Compilation.hooks.processAssets")
										);
									}
									this.hooks.afterProcessAssets.call(this.assets);
									this.logger.timeEnd("process assets");
									this.assets = this._backCompat
										? soonFrozenObjectDeprecation(
												this.assets,
												"Compilation.assets",
												"DEP_WEBPACK_COMPILATION_ASSETS",
												`BREAKING CHANGE: No more changes should happen to Compilation.assets after sealing the Compilation.
	Do changes to assets earlier, e. g. in Compilation.hooks.processAssets.
	Make sure to select an appropriate stage from Compilation.PROCESS_ASSETS_STAGE_*.`
										  )
										: Object.freeze(this.assets);

									this.summarizeDependencies();
									if (shouldRecord) {
										this.hooks.record.call(this, this.records);
									}

									if (this.hooks.needAdditionalSeal.call()) {
										this.unseal();
										return this.seal(callback);
									}
									return this.hooks.afterSeal.callAsync(err => {
										if (err) {
											return finalCallback(
												makeWebpackError(err, "Compilation.hooks.afterSeal")
											);
										}
										this.fileSystemInfo.logStatistics();
										finalCallback();
									});
								});
							};

							this.logger.time("create chunk assets");
							if (this.hooks.shouldGenerateChunkAssets.call() !== false) {
								this.hooks.beforeChunkAssets.call();
								this.createChunkAssets(err => {
									this.logger.timeEnd("create chunk assets");
									if (err) {
										return finalCallback(err);
									}
									cont();
								});
							} else {
								this.logger.timeEnd("create chunk assets");
								cont();
							}
						});
					});
				}
			);
		});
	}

	/**
	 * 检测
	 * @param {Module} module module to report from 要报告的模块
	 * @param {DependenciesBlock[]} blocks blocks to report from 要报告的区块
	 * @returns {boolean} true, when it has warnings or errors 当它有警告或错误时
	 */
	reportDependencyErrorsAndWarnings(module, blocks) {
		let hasProblems = false; // 检测的模块中是否存在警告或错误
		for (let indexBlock = 0; indexBlock < blocks.length; indexBlock++) {
			const block = blocks[indexBlock];
			const dependencies = block.dependencies; // 所有依赖项

			for (let indexDep = 0; indexDep < dependencies.length; indexDep++) {
				const d = dependencies[indexDep]; // 

				const warnings = d.getWarnings(this.moduleGraph); // 是否存在警告
				if (warnings) {
					for (let indexWar = 0; indexWar < warnings.length; indexWar++) {
						const w = warnings[indexWar];

						const warning = new ModuleDependencyWarning(module, w, d.loc);
						this.warnings.push(warning);
						hasProblems = true;
					}
				}
				const errors = d.getErrors(this.moduleGraph);
				if (errors) {
					for (let indexErr = 0; indexErr < errors.length; indexErr++) {
						const e = errors[indexErr];

						const error = new ModuleDependencyError(module, e, d.loc);
						this.errors.push(error);
						hasProblems = true;
					}
				}
			}

			if (this.reportDependencyErrorsAndWarnings(module, block.blocks))
				hasProblems = true;
		}
		return hasProblems;
	}

	codeGeneration(callback) {
		const { chunkGraph } = this;
		this.codeGenerationResults = new CodeGenerationResults(
			this.outputOptions.hashFunction
		);
		/** @type {{module: Module, hash: string, runtime: RuntimeSpec, runtimes: RuntimeSpec[]}[]} */
		const jobs = [];
		for (const module of this.modules) {
			const runtimes = chunkGraph.getModuleRuntimes(module);
			if (runtimes.size === 1) {
				for (const runtime of runtimes) {
					const hash = chunkGraph.getModuleHash(module, runtime);
					jobs.push({ module, hash, runtime, runtimes: [runtime] });
				}
			} else if (runtimes.size > 1) {
				/** @type {Map<string, { runtimes: RuntimeSpec[] }>} */
				const map = new Map();
				for (const runtime of runtimes) {
					const hash = chunkGraph.getModuleHash(module, runtime);
					const job = map.get(hash);
					if (job === undefined) {
						const newJob = { module, hash, runtime, runtimes: [runtime] };
						jobs.push(newJob);
						map.set(hash, newJob);
					} else {
						job.runtimes.push(runtime);
					}
				}
			}
		}

		this._runCodeGenerationJobs(jobs, callback);
	}

	_runCodeGenerationJobs(jobs, callback) {
		let statModulesFromCache = 0;
		let statModulesGenerated = 0;
		const { chunkGraph, moduleGraph, dependencyTemplates, runtimeTemplate } =
			this;
		const results = this.codeGenerationResults;
		const errors = [];
		/** @type {Set<Module> | undefined} */
		let notCodeGeneratedModules = undefined;
		const runIteration = () => {
			let delayedJobs = [];
			let delayedModules = new Set();
			asyncLib.eachLimit(
				jobs,
				this.options.parallelism,
				(job, callback) => {
					const { module } = job;
					const { codeGenerationDependencies } = module;
					if (codeGenerationDependencies !== undefined) {
						if (
							notCodeGeneratedModules === undefined ||
							codeGenerationDependencies.some(dep => {
								const referencedModule = moduleGraph.getModule(dep);
								return notCodeGeneratedModules.has(referencedModule);
							})
						) {
							delayedJobs.push(job);
							delayedModules.add(module);
							return callback();
						}
					}
					const { hash, runtime, runtimes } = job;
					this._codeGenerationModule(
						module,
						runtime,
						runtimes,
						hash,
						dependencyTemplates,
						chunkGraph,
						moduleGraph,
						runtimeTemplate,
						errors,
						results,
						(err, codeGenerated) => {
							if (codeGenerated) statModulesGenerated++;
							else statModulesFromCache++;
							callback(err);
						}
					);
				},
				err => {
					if (err) return callback(err);
					if (delayedJobs.length > 0) {
						if (delayedJobs.length === jobs.length) {
							return callback(
								new Error(
									`Unable to make progress during code generation because of circular code generation dependency: ${Array.from(
										delayedModules,
										m => m.identifier()
									).join(", ")}`
								)
							);
						}
						jobs = delayedJobs;
						delayedJobs = [];
						notCodeGeneratedModules = delayedModules;
						delayedModules = new Set();
						return runIteration();
					}
					if (errors.length > 0) {
						errors.sort(
							compareSelect(err => err.module, compareModulesByIdentifier)
						);
						for (const error of errors) {
							this.errors.push(error);
						}
					}
					this.logger.log(
						`${Math.round(
							(100 * statModulesGenerated) /
								(statModulesGenerated + statModulesFromCache)
						)}% code generated (${statModulesGenerated} generated, ${statModulesFromCache} from cache)`
					);
					callback();
				}
			);
		};
		runIteration();
	}

	/**
	 * @param {Module} module module
	 * @param {RuntimeSpec} runtime runtime
	 * @param {RuntimeSpec[]} runtimes runtimes
	 * @param {string} hash hash
	 * @param {DependencyTemplates} dependencyTemplates dependencyTemplates
	 * @param {ChunkGraph} chunkGraph chunkGraph
	 * @param {ModuleGraph} moduleGraph moduleGraph
	 * @param {RuntimeTemplate} runtimeTemplate runtimeTemplate
	 * @param {WebpackError[]} errors errors
	 * @param {CodeGenerationResults} results results
	 * @param {function(WebpackError=, boolean=): void} callback callback
	 */
	_codeGenerationModule(
		module,
		runtime,
		runtimes,
		hash,
		dependencyTemplates,
		chunkGraph,
		moduleGraph,
		runtimeTemplate,
		errors,
		results,
		callback
	) {
		let codeGenerated = false;
		const cache = new MultiItemCache(
			runtimes.map(runtime =>
				this._codeGenerationCache.getItemCache(
					`${module.identifier()}|${getRuntimeKey(runtime)}`,
					`${hash}|${dependencyTemplates.getHash()}`
				)
			)
		);
		cache.get((err, cachedResult) => {
			if (err) return callback(err);
			let result;
			if (!cachedResult) {
				try {
					codeGenerated = true;
					this.codeGeneratedModules.add(module);
					result = module.codeGeneration({
						chunkGraph,
						moduleGraph,
						dependencyTemplates,
						runtimeTemplate,
						runtime,
						codeGenerationResults: results
					});
				} catch (err) {
					errors.push(new CodeGenerationError(module, err));
					result = cachedResult = {
						sources: new Map(),
						runtimeRequirements: null
					};
				}
			} else {
				result = cachedResult;
			}
			for (const runtime of runtimes) {
				results.add(module, runtime, result);
			}
			if (!cachedResult) {
				cache.store(result, err => callback(err, codeGenerated));
			} else {
				callback(null, codeGenerated);
			}
		});
	}

	_getChunkGraphEntries() {
		/** @type {Set<Chunk>} */
		const treeEntries = new Set();
		for (const ep of this.entrypoints.values()) {
			const chunk = ep.getRuntimeChunk();
			if (chunk) treeEntries.add(chunk);
		}
		for (const ep of this.asyncEntrypoints) {
			const chunk = ep.getRuntimeChunk();
			if (chunk) treeEntries.add(chunk);
		}
		return treeEntries;
	}

	/**
	 * @param {Object} options options
	 * @param {ChunkGraph=} options.chunkGraph the chunk graph
	 * @param {Iterable<Module>=} options.modules modules
	 * @param {Iterable<Chunk>=} options.chunks chunks
	 * @param {CodeGenerationResults=} options.codeGenerationResults codeGenerationResults
	 * @param {Iterable<Chunk>=} options.chunkGraphEntries chunkGraphEntries
	 * @returns {void}
	 */
	processRuntimeRequirements({
		chunkGraph = this.chunkGraph,
		modules = this.modules,
		chunks = this.chunks,
		codeGenerationResults = this.codeGenerationResults,
		chunkGraphEntries = this._getChunkGraphEntries()
	} = {}) {
		const context = { chunkGraph, codeGenerationResults };
		const { moduleMemCaches2 } = this;
		this.logger.time("runtime requirements.modules");
		const additionalModuleRuntimeRequirements =
			this.hooks.additionalModuleRuntimeRequirements;
		const runtimeRequirementInModule = this.hooks.runtimeRequirementInModule;
		for (const module of modules) {
			if (chunkGraph.getNumberOfModuleChunks(module) > 0) {
				const memCache = moduleMemCaches2 && moduleMemCaches2.get(module);
				for (const runtime of chunkGraph.getModuleRuntimes(module)) {
					if (memCache) {
						const cached = memCache.get(
							`moduleRuntimeRequirements-${getRuntimeKey(runtime)}`
						);
						if (cached !== undefined) {
							if (cached !== null) {
								chunkGraph.addModuleRuntimeRequirements(
									module,
									runtime,
									cached,
									false
								);
							}
							continue;
						}
					}
					let set;
					const runtimeRequirements =
						codeGenerationResults.getRuntimeRequirements(module, runtime);
					if (runtimeRequirements && runtimeRequirements.size > 0) {
						set = new Set(runtimeRequirements);
					} else if (additionalModuleRuntimeRequirements.isUsed()) {
						set = new Set();
					} else {
						if (memCache) {
							memCache.set(
								`moduleRuntimeRequirements-${getRuntimeKey(runtime)}`,
								null
							);
						}
						continue;
					}
					additionalModuleRuntimeRequirements.call(module, set, context);

					for (const r of set) {
						const hook = runtimeRequirementInModule.get(r);
						if (hook !== undefined) hook.call(module, set, context);
					}
					if (set.size === 0) {
						if (memCache) {
							memCache.set(
								`moduleRuntimeRequirements-${getRuntimeKey(runtime)}`,
								null
							);
						}
					} else {
						if (memCache) {
							memCache.set(
								`moduleRuntimeRequirements-${getRuntimeKey(runtime)}`,
								set
							);
							chunkGraph.addModuleRuntimeRequirements(
								module,
								runtime,
								set,
								false
							);
						} else {
							chunkGraph.addModuleRuntimeRequirements(module, runtime, set);
						}
					}
				}
			}
		}
		this.logger.timeEnd("runtime requirements.modules");

		this.logger.time("runtime requirements.chunks");
		for (const chunk of chunks) {
			const set = new Set();
			for (const module of chunkGraph.getChunkModulesIterable(chunk)) {
				const runtimeRequirements = chunkGraph.getModuleRuntimeRequirements(
					module,
					chunk.runtime
				);
				for (const r of runtimeRequirements) set.add(r);
			}
			this.hooks.additionalChunkRuntimeRequirements.call(chunk, set, context);

			for (const r of set) {
				this.hooks.runtimeRequirementInChunk.for(r).call(chunk, set, context);
			}

			chunkGraph.addChunkRuntimeRequirements(chunk, set);
		}
		this.logger.timeEnd("runtime requirements.chunks");

		this.logger.time("runtime requirements.entries");
		for (const treeEntry of chunkGraphEntries) {
			const set = new Set();
			for (const chunk of treeEntry.getAllReferencedChunks()) {
				const runtimeRequirements =
					chunkGraph.getChunkRuntimeRequirements(chunk);
				for (const r of runtimeRequirements) set.add(r);
			}

			this.hooks.additionalTreeRuntimeRequirements.call(
				treeEntry,
				set,
				context
			);

			for (const r of set) {
				this.hooks.runtimeRequirementInTree
					.for(r)
					.call(treeEntry, set, context);
			}

			chunkGraph.addTreeRuntimeRequirements(treeEntry, set);
		}
		this.logger.timeEnd("runtime requirements.entries");
	}

	// TODO webpack 6 make chunkGraph argument non-optional
	/**
	 * @param {Chunk} chunk target chunk
	 * @param {RuntimeModule} module runtime module
	 * @param {ChunkGraph} chunkGraph the chunk graph
	 * @returns {void}
	 */
	addRuntimeModule(chunk, module, chunkGraph = this.chunkGraph) {
		// Deprecated ModuleGraph association
		if (this._backCompat)
			ModuleGraph.setModuleGraphForModule(module, this.moduleGraph);

		// add it to the list
		this.modules.add(module);
		this._modules.set(module.identifier(), module);

		// connect to the chunk graph
		chunkGraph.connectChunkAndModule(chunk, module);
		chunkGraph.connectChunkAndRuntimeModule(chunk, module);
		if (module.fullHash) {
			chunkGraph.addFullHashModuleToChunk(chunk, module);
		} else if (module.dependentHash) {
			chunkGraph.addDependentHashModuleToChunk(chunk, module);
		}

		// attach runtime module
		module.attach(this, chunk, chunkGraph);

		// Setup internals
		const exportsInfo = this.moduleGraph.getExportsInfo(module);
		exportsInfo.setHasProvideInfo();
		if (typeof chunk.runtime === "string") {
			exportsInfo.setUsedForSideEffectsOnly(chunk.runtime);
		} else if (chunk.runtime === undefined) {
			exportsInfo.setUsedForSideEffectsOnly(undefined);
		} else {
			for (const runtime of chunk.runtime) {
				exportsInfo.setUsedForSideEffectsOnly(runtime);
			}
		}
		chunkGraph.addModuleRuntimeRequirements(
			module,
			chunk.runtime,
			new Set([RuntimeGlobals.requireScope])
		);

		// runtime modules don't need ids
		chunkGraph.setModuleId(module, "");

		// Call hook
		this.hooks.runtimeModule.call(module, chunk);
	}

	/**
	 * If `module` is passed, `loc` and `request` must also be passed.
	 * @param {string | ChunkGroupOptions} groupOptions options for the chunk group
	 * @param {Module=} module the module the references the chunk group
	 * @param {DependencyLocation=} loc the location from with the chunk group is referenced (inside of module)
	 * @param {string=} request the request from which the the chunk group is referenced
	 * @returns {ChunkGroup} the new or existing chunk group
	 */
	addChunkInGroup(groupOptions, module, loc, request) {
		if (typeof groupOptions === "string") {
			groupOptions = { name: groupOptions };
		}
		const name = groupOptions.name;

		if (name) {
			const chunkGroup = this.namedChunkGroups.get(name);
			if (chunkGroup !== undefined) {
				chunkGroup.addOptions(groupOptions);
				if (module) {
					chunkGroup.addOrigin(module, loc, request);
				}
				return chunkGroup;
			}
		}
		const chunkGroup = new ChunkGroup(groupOptions);
		if (module) chunkGroup.addOrigin(module, loc, request);
		const chunk = this.addChunk(name);

		connectChunkGroupAndChunk(chunkGroup, chunk);

		this.chunkGroups.push(chunkGroup);
		if (name) {
			this.namedChunkGroups.set(name, chunkGroup);
		}
		return chunkGroup;
	}

	/**
	 * @param {EntryOptions} options options for the entrypoint
	 * @param {Module} module the module the references the chunk group
	 * @param {DependencyLocation} loc the location from with the chunk group is referenced (inside of module)
	 * @param {string} request the request from which the the chunk group is referenced
	 * @returns {Entrypoint} the new or existing entrypoint
	 */
	addAsyncEntrypoint(options, module, loc, request) {
		const name = options.name;
		if (name) {
			const entrypoint = this.namedChunkGroups.get(name);
			if (entrypoint instanceof Entrypoint) {
				if (entrypoint !== undefined) {
					if (module) {
						entrypoint.addOrigin(module, loc, request);
					}
					return entrypoint;
				}
			} else if (entrypoint) {
				throw new Error(
					`Cannot add an async entrypoint with the name '${name}', because there is already an chunk group with this name`
				);
			}
		}
		const chunk = this.addChunk(name);
		if (options.filename) {
			chunk.filenameTemplate = options.filename;
		}
		const entrypoint = new Entrypoint(options, false);
		entrypoint.setRuntimeChunk(chunk);
		entrypoint.setEntrypointChunk(chunk);
		if (name) {
			this.namedChunkGroups.set(name, entrypoint);
		}
		this.chunkGroups.push(entrypoint);
		this.asyncEntrypoints.push(entrypoint);
		connectChunkGroupAndChunk(entrypoint, chunk);
		if (module) {
			entrypoint.addOrigin(module, loc, request);
		}
		return entrypoint;
	}

	/**
	 * 添加一个 Chunk 类，首先如果提供了 name 名字，那么查看一下是否存在相同的 chunk
	 * 不存在的话那么就新建一个 Chunk 类
	 * 
	 * This method first looks to see if a name is provided for a new chunk, 此方法首先查看是否为新块提供了名称
	 * and first looks to see if any named chunks already exist and reuse that chunk instead. 首先查看是否存在任何已命名的块，然后重用该块
	 *
	 * @param {string=} name optional chunk name to be provided 可选要提供的chunk名称
	 * @returns {Chunk} create a chunk (invoked during seal event) 创建一个块(在密封事件期间调用)
	 */
	addChunk(name) {
		if (name) {
			const chunk = this.namedChunks.get(name); // 根据 name 提取值
			if (chunk !== undefined) {
				return chunk;
			}
		}
		// 初始化一个 Chunk 类，初始化一些参数而已
		const chunk = new Chunk(name, this._backCompat);
		this.chunks.add(chunk); // 将该 chunk 推入到 chunks 集合中
		if (this._backCompat)
			ChunkGraph.setChunkGraphForChunk(chunk, this.chunkGraph);
		// 如果存在名字的话，则将其缓存一下
		if (name) {
			this.namedChunks.set(name, chunk);
		}
		return chunk;
	}

	/**
	 * @deprecated
	 * @param {Module} module module to assign depth
	 * @returns {void}
	 */
	assignDepth(module) {
		const moduleGraph = this.moduleGraph;

		const queue = new Set([module]);
		let depth;

		moduleGraph.setDepth(module, 0);

		/**
		 * @param {Module} module module for processing
		 * @returns {void}
		 */
		const processModule = module => {
			if (!moduleGraph.setDepthIfLower(module, depth)) return;
			queue.add(module);
		};

		for (module of queue) {
			queue.delete(module);
			depth = moduleGraph.getDepth(module) + 1;

			for (const connection of moduleGraph.getOutgoingConnections(module)) {
				const refModule = connection.module;
				if (refModule) {
					processModule(refModule);
				}
			}
		}
	}

	/**
	 * @param {Set<Module>} modules module to assign depth 模块来分配深度
	 * @returns {void}
	 */
	assignDepths(modules) {
		const moduleGraph = this.moduleGraph;

		/** @type {Set<Module | number>} */
		const queue = new Set(modules);
		queue.add(1);
		let depth = 0;

		let i = 0;
		for (const module of queue) {
			i++;
			if (typeof module === "number") {
				depth = module;
				if (queue.size === i) return;
				queue.add(depth + 1);
			} else {
				moduleGraph.setDepth(module, depth);
				for (const { module: refModule } of moduleGraph.getOutgoingConnections(
					module
				)) {
					if (refModule) {
						queue.add(refModule);
					}
				}
			}
		}
	}

	/**
	 * @param {Dependency} dependency the dependency
	 * @param {RuntimeSpec} runtime the runtime
	 * @returns {(string[] | ReferencedExport)[]} referenced exports
	 */
	getDependencyReferencedExports(dependency, runtime) {
		const referencedExports = dependency.getReferencedExports(
			this.moduleGraph,
			runtime
		);
		return this.hooks.dependencyReferencedExports.call(
			referencedExports,
			dependency,
			runtime
		);
	}

	/**
	 *
	 * @param {Module} module module relationship for removal
	 * @param {DependenciesBlockLike} block //TODO: good description
	 * @returns {void}
	 */
	removeReasonsOfDependencyBlock(module, block) {
		if (block.blocks) {
			for (const b of block.blocks) {
				this.removeReasonsOfDependencyBlock(module, b);
			}
		}

		if (block.dependencies) {
			for (const dep of block.dependencies) {
				const originalModule = this.moduleGraph.getModule(dep);
				if (originalModule) {
					this.moduleGraph.removeConnection(dep);

					if (this.chunkGraph) {
						for (const chunk of this.chunkGraph.getModuleChunks(
							originalModule
						)) {
							this.patchChunksAfterReasonRemoval(originalModule, chunk);
						}
					}
				}
			}
		}
	}

	/**
	 * @param {Module} module module to patch tie
	 * @param {Chunk} chunk chunk to patch tie
	 * @returns {void}
	 */
	patchChunksAfterReasonRemoval(module, chunk) {
		if (!module.hasReasons(this.moduleGraph, chunk.runtime)) {
			this.removeReasonsOfDependencyBlock(module, module);
		}
		if (!module.hasReasonForChunk(chunk, this.moduleGraph, this.chunkGraph)) {
			if (this.chunkGraph.isModuleInChunk(module, chunk)) {
				this.chunkGraph.disconnectChunkAndModule(chunk, module);
				this.removeChunkFromDependencies(module, chunk);
			}
		}
	}

	/**
	 *
	 * @param {DependenciesBlock} block block tie for Chunk
	 * @param {Chunk} chunk chunk to remove from dep
	 * @returns {void}
	 */
	removeChunkFromDependencies(block, chunk) {
		/**
		 * @param {Dependency} d dependency to (maybe) patch up
		 */
		const iteratorDependency = d => {
			const depModule = this.moduleGraph.getModule(d);
			if (!depModule) {
				return;
			}
			this.patchChunksAfterReasonRemoval(depModule, chunk);
		};

		const blocks = block.blocks;
		for (let indexBlock = 0; indexBlock < blocks.length; indexBlock++) {
			const asyncBlock = blocks[indexBlock];
			const chunkGroup = this.chunkGraph.getBlockChunkGroup(asyncBlock);
			// Grab all chunks from the first Block's AsyncDepBlock
			const chunks = chunkGroup.chunks;
			// For each chunk in chunkGroup
			for (let indexChunk = 0; indexChunk < chunks.length; indexChunk++) {
				const iteratedChunk = chunks[indexChunk];
				chunkGroup.removeChunk(iteratedChunk);
				// Recurse
				this.removeChunkFromDependencies(block, iteratedChunk);
			}
		}

		if (block.dependencies) {
			for (const dep of block.dependencies) iteratorDependency(dep);
		}
	}

	assignRuntimeIds() {
		const { chunkGraph } = this;
		const processEntrypoint = ep => {
			const runtime = ep.options.runtime || ep.name;
			const chunk = ep.getRuntimeChunk();
			chunkGraph.setRuntimeId(runtime, chunk.id);
		};
		for (const ep of this.entrypoints.values()) {
			processEntrypoint(ep);
		}
		for (const ep of this.asyncEntrypoints) {
			processEntrypoint(ep);
		}
	}

	sortItemsWithChunkIds() {
		for (const chunkGroup of this.chunkGroups) {
			chunkGroup.sortItems();
		}

		this.errors.sort(compareErrors);
		this.warnings.sort(compareErrors);
		this.children.sort(byNameOrHash);
	}

	summarizeDependencies() {
		for (
			let indexChildren = 0;
			indexChildren < this.children.length;
			indexChildren++
		) {
			const child = this.children[indexChildren];

			this.fileDependencies.addAll(child.fileDependencies);
			this.contextDependencies.addAll(child.contextDependencies);
			this.missingDependencies.addAll(child.missingDependencies);
			this.buildDependencies.addAll(child.buildDependencies);
		}

		for (const module of this.modules) {
			module.addCacheDependencies(
				this.fileDependencies,
				this.contextDependencies,
				this.missingDependencies,
				this.buildDependencies
			);
		}
	}

	createModuleHashes() {
		let statModulesHashed = 0;
		let statModulesFromCache = 0;
		const { chunkGraph, runtimeTemplate, moduleMemCaches2 } = this;
		const { hashFunction, hashDigest, hashDigestLength } = this.outputOptions;
		for (const module of this.modules) {
			const memCache = moduleMemCaches2 && moduleMemCaches2.get(module);
			for (const runtime of chunkGraph.getModuleRuntimes(module)) {
				if (memCache) {
					const digest = memCache.get(`moduleHash-${getRuntimeKey(runtime)}`);
					if (digest !== undefined) {
						chunkGraph.setModuleHashes(
							module,
							runtime,
							digest,
							digest.substr(0, hashDigestLength)
						);
						statModulesFromCache++;
						continue;
					}
				}
				statModulesHashed++;
				const digest = this._createModuleHash(
					module,
					chunkGraph,
					runtime,
					hashFunction,
					runtimeTemplate,
					hashDigest,
					hashDigestLength
				);
				if (memCache) {
					memCache.set(`moduleHash-${getRuntimeKey(runtime)}`, digest);
				}
			}
		}
		this.logger.log(
			`${statModulesHashed} modules hashed, ${statModulesFromCache} from cache (${
				Math.round(
					(100 * (statModulesHashed + statModulesFromCache)) / this.modules.size
				) / 100
			} variants per module in average)`
		);
	}

	_createModuleHash(
		module,
		chunkGraph,
		runtime,
		hashFunction,
		runtimeTemplate,
		hashDigest,
		hashDigestLength
	) {
		const moduleHash = createHash(hashFunction);
		module.updateHash(moduleHash, {
			chunkGraph,
			runtime,
			runtimeTemplate
		});
		const moduleHashDigest = /** @type {string} */ (
			moduleHash.digest(hashDigest)
		);
		chunkGraph.setModuleHashes(
			module,
			runtime,
			moduleHashDigest,
			moduleHashDigest.substr(0, hashDigestLength)
		);
		return moduleHashDigest;
	}

	createHash() {
		this.logger.time("hashing: initialize hash");
		const chunkGraph = this.chunkGraph;
		const runtimeTemplate = this.runtimeTemplate;
		const outputOptions = this.outputOptions;
		const hashFunction = outputOptions.hashFunction;
		const hashDigest = outputOptions.hashDigest;
		const hashDigestLength = outputOptions.hashDigestLength;
		const hash = createHash(hashFunction);
		if (outputOptions.hashSalt) {
			hash.update(outputOptions.hashSalt);
		}
		this.logger.timeEnd("hashing: initialize hash");
		if (this.children.length > 0) {
			this.logger.time("hashing: hash child compilations");
			for (const child of this.children) {
				hash.update(child.hash);
			}
			this.logger.timeEnd("hashing: hash child compilations");
		}
		if (this.warnings.length > 0) {
			this.logger.time("hashing: hash warnings");
			for (const warning of this.warnings) {
				hash.update(`${warning.message}`);
			}
			this.logger.timeEnd("hashing: hash warnings");
		}
		if (this.errors.length > 0) {
			this.logger.time("hashing: hash errors");
			for (const error of this.errors) {
				hash.update(`${error.message}`);
			}
			this.logger.timeEnd("hashing: hash errors");
		}

		this.logger.time("hashing: sort chunks");
		/*
		 * all non-runtime chunks need to be hashes first,
		 * since runtime chunk might use their hashes.
		 * runtime chunks need to be hashed in the correct order
		 * since they may depend on each other (for async entrypoints).
		 * So we put all non-runtime chunks first and hash them in any order.
		 * And order runtime chunks according to referenced between each other.
		 * Chunks need to be in deterministic order since we add hashes to full chunk
		 * during these hashing.
		 */
		/** @type {Chunk[]} */
		const unorderedRuntimeChunks = [];
		/** @type {Chunk[]} */
		const otherChunks = [];
		for (const c of this.chunks) {
			if (c.hasRuntime()) {
				unorderedRuntimeChunks.push(c);
			} else {
				otherChunks.push(c);
			}
		}
		unorderedRuntimeChunks.sort(byId);
		otherChunks.sort(byId);

		/** @typedef {{ chunk: Chunk, referencedBy: RuntimeChunkInfo[], remaining: number }} RuntimeChunkInfo */
		/** @type {Map<Chunk, RuntimeChunkInfo>} */
		const runtimeChunksMap = new Map();
		for (const chunk of unorderedRuntimeChunks) {
			runtimeChunksMap.set(chunk, {
				chunk,
				referencedBy: [],
				remaining: 0
			});
		}
		let remaining = 0;
		for (const info of runtimeChunksMap.values()) {
			for (const other of new Set(
				Array.from(info.chunk.getAllReferencedAsyncEntrypoints()).map(
					e => e.chunks[e.chunks.length - 1]
				)
			)) {
				const otherInfo = runtimeChunksMap.get(other);
				otherInfo.referencedBy.push(info);
				info.remaining++;
				remaining++;
			}
		}
		/** @type {Chunk[]} */
		const runtimeChunks = [];
		for (const info of runtimeChunksMap.values()) {
			if (info.remaining === 0) {
				runtimeChunks.push(info.chunk);
			}
		}
		// If there are any references between chunks
		// make sure to follow these chains
		if (remaining > 0) {
			const readyChunks = [];
			for (const chunk of runtimeChunks) {
				const hasFullHashModules =
					chunkGraph.getNumberOfChunkFullHashModules(chunk) !== 0;
				const info = runtimeChunksMap.get(chunk);
				for (const otherInfo of info.referencedBy) {
					if (hasFullHashModules) {
						chunkGraph.upgradeDependentToFullHashModules(otherInfo.chunk);
					}
					remaining--;
					if (--otherInfo.remaining === 0) {
						readyChunks.push(otherInfo.chunk);
					}
				}
				if (readyChunks.length > 0) {
					// This ensures deterministic ordering, since referencedBy is non-deterministic
					readyChunks.sort(byId);
					for (const c of readyChunks) runtimeChunks.push(c);
					readyChunks.length = 0;
				}
			}
		}
		// If there are still remaining references we have cycles and want to create a warning
		if (remaining > 0) {
			let circularRuntimeChunkInfo = [];
			for (const info of runtimeChunksMap.values()) {
				if (info.remaining !== 0) {
					circularRuntimeChunkInfo.push(info);
				}
			}
			circularRuntimeChunkInfo.sort(compareSelect(i => i.chunk, byId));
			const err =
				new WebpackError(`Circular dependency between chunks with runtime (${Array.from(
					circularRuntimeChunkInfo,
					c => c.chunk.name || c.chunk.id
				).join(", ")})
This prevents using hashes of each other and should be avoided.`);
			err.chunk = circularRuntimeChunkInfo[0].chunk;
			this.warnings.push(err);
			for (const i of circularRuntimeChunkInfo) runtimeChunks.push(i.chunk);
		}
		this.logger.timeEnd("hashing: sort chunks");

		const fullHashChunks = new Set();
		/** @type {{module: Module, hash: string, runtime: RuntimeSpec, runtimes: RuntimeSpec[]}[]} */
		const codeGenerationJobs = [];
		/** @type {Map<string, Map<Module, {module: Module, hash: string, runtime: RuntimeSpec, runtimes: RuntimeSpec[]}>>} */
		const codeGenerationJobsMap = new Map();

		const processChunk = chunk => {
			// Last minute module hash generation for modules that depend on chunk hashes
			this.logger.time("hashing: hash runtime modules");
			const runtime = chunk.runtime;
			for (const module of chunkGraph.getChunkModulesIterable(chunk)) {
				if (!chunkGraph.hasModuleHashes(module, runtime)) {
					const hash = this._createModuleHash(
						module,
						chunkGraph,
						runtime,
						hashFunction,
						runtimeTemplate,
						hashDigest,
						hashDigestLength
					);
					let hashMap = codeGenerationJobsMap.get(hash);
					if (hashMap) {
						const moduleJob = hashMap.get(module);
						if (moduleJob) {
							moduleJob.runtimes.push(runtime);
							continue;
						}
					} else {
						hashMap = new Map();
						codeGenerationJobsMap.set(hash, hashMap);
					}
					const job = {
						module,
						hash,
						runtime,
						runtimes: [runtime]
					};
					hashMap.set(module, job);
					codeGenerationJobs.push(job);
				}
			}
			this.logger.timeAggregate("hashing: hash runtime modules");
			this.logger.time("hashing: hash chunks");
			const chunkHash = createHash(hashFunction);
			try {
				if (outputOptions.hashSalt) {
					chunkHash.update(outputOptions.hashSalt);
				}
				chunk.updateHash(chunkHash, chunkGraph);
				this.hooks.chunkHash.call(chunk, chunkHash, {
					chunkGraph,
					moduleGraph: this.moduleGraph,
					runtimeTemplate: this.runtimeTemplate
				});
				const chunkHashDigest = /** @type {string} */ (
					chunkHash.digest(hashDigest)
				);
				hash.update(chunkHashDigest);
				chunk.hash = chunkHashDigest;
				chunk.renderedHash = chunk.hash.substr(0, hashDigestLength);
				const fullHashModules =
					chunkGraph.getChunkFullHashModulesIterable(chunk);
				if (fullHashModules) {
					fullHashChunks.add(chunk);
				} else {
					this.hooks.contentHash.call(chunk);
				}
			} catch (err) {
				this.errors.push(new ChunkRenderError(chunk, "", err));
			}
			this.logger.timeAggregate("hashing: hash chunks");
		};
		otherChunks.forEach(processChunk);
		for (const chunk of runtimeChunks) processChunk(chunk);

		this.logger.timeAggregateEnd("hashing: hash runtime modules");
		this.logger.timeAggregateEnd("hashing: hash chunks");
		this.logger.time("hashing: hash digest");
		this.hooks.fullHash.call(hash);
		this.fullHash = /** @type {string} */ (hash.digest(hashDigest));
		this.hash = this.fullHash.substr(0, hashDigestLength);
		this.logger.timeEnd("hashing: hash digest");

		this.logger.time("hashing: process full hash modules");
		for (const chunk of fullHashChunks) {
			for (const module of chunkGraph.getChunkFullHashModulesIterable(chunk)) {
				const moduleHash = createHash(hashFunction);
				module.updateHash(moduleHash, {
					chunkGraph,
					runtime: chunk.runtime,
					runtimeTemplate
				});
				const moduleHashDigest = /** @type {string} */ (
					moduleHash.digest(hashDigest)
				);
				const oldHash = chunkGraph.getModuleHash(module, chunk.runtime);
				chunkGraph.setModuleHashes(
					module,
					chunk.runtime,
					moduleHashDigest,
					moduleHashDigest.substr(0, hashDigestLength)
				);
				codeGenerationJobsMap.get(oldHash).get(module).hash = moduleHashDigest;
			}
			const chunkHash = createHash(hashFunction);
			chunkHash.update(chunk.hash);
			chunkHash.update(this.hash);
			const chunkHashDigest = /** @type {string} */ (
				chunkHash.digest(hashDigest)
			);
			chunk.hash = chunkHashDigest;
			chunk.renderedHash = chunk.hash.substr(0, hashDigestLength);
			this.hooks.contentHash.call(chunk);
		}
		this.logger.timeEnd("hashing: process full hash modules");
		return codeGenerationJobs;
	}

	/**
	 * @param {string} file file name
	 * @param {Source} source asset source
	 * @param {AssetInfo} assetInfo extra asset information
	 * @returns {void}
	 */
	emitAsset(file, source, assetInfo = {}) {
		if (this.assets[file]) {
			if (!isSourceEqual(this.assets[file], source)) {
				this.errors.push(
					new WebpackError(
						`Conflict: Multiple assets emit different content to the same filename ${file}`
					)
				);
				this.assets[file] = source;
				this._setAssetInfo(file, assetInfo);
				return;
			}
			const oldInfo = this.assetsInfo.get(file);
			const newInfo = Object.assign({}, oldInfo, assetInfo);
			this._setAssetInfo(file, newInfo, oldInfo);
			return;
		}
		this.assets[file] = source;
		this._setAssetInfo(file, assetInfo, undefined);
	}

	_setAssetInfo(file, newInfo, oldInfo = this.assetsInfo.get(file)) {
		if (newInfo === undefined) {
			this.assetsInfo.delete(file);
		} else {
			this.assetsInfo.set(file, newInfo);
		}
		const oldRelated = oldInfo && oldInfo.related;
		const newRelated = newInfo && newInfo.related;
		if (oldRelated) {
			for (const key of Object.keys(oldRelated)) {
				const remove = name => {
					const relatedIn = this._assetsRelatedIn.get(name);
					if (relatedIn === undefined) return;
					const entry = relatedIn.get(key);
					if (entry === undefined) return;
					entry.delete(file);
					if (entry.size !== 0) return;
					relatedIn.delete(key);
					if (relatedIn.size === 0) this._assetsRelatedIn.delete(name);
				};
				const entry = oldRelated[key];
				if (Array.isArray(entry)) {
					entry.forEach(remove);
				} else if (entry) {
					remove(entry);
				}
			}
		}
		if (newRelated) {
			for (const key of Object.keys(newRelated)) {
				const add = name => {
					let relatedIn = this._assetsRelatedIn.get(name);
					if (relatedIn === undefined) {
						this._assetsRelatedIn.set(name, (relatedIn = new Map()));
					}
					let entry = relatedIn.get(key);
					if (entry === undefined) {
						relatedIn.set(key, (entry = new Set()));
					}
					entry.add(file);
				};
				const entry = newRelated[key];
				if (Array.isArray(entry)) {
					entry.forEach(add);
				} else if (entry) {
					add(entry);
				}
			}
		}
	}

	/**
	 * @param {string} file file name
	 * @param {Source | function(Source): Source} newSourceOrFunction new asset source or function converting old to new
	 * @param {AssetInfo | function(AssetInfo | undefined): AssetInfo} assetInfoUpdateOrFunction new asset info or function converting old to new
	 */
	updateAsset(
		file,
		newSourceOrFunction,
		assetInfoUpdateOrFunction = undefined
	) {
		if (!this.assets[file]) {
			throw new Error(
				`Called Compilation.updateAsset for not existing filename ${file}`
			);
		}
		if (typeof newSourceOrFunction === "function") {
			this.assets[file] = newSourceOrFunction(this.assets[file]);
		} else {
			this.assets[file] = newSourceOrFunction;
		}
		if (assetInfoUpdateOrFunction !== undefined) {
			const oldInfo = this.assetsInfo.get(file) || EMPTY_ASSET_INFO;
			if (typeof assetInfoUpdateOrFunction === "function") {
				this._setAssetInfo(file, assetInfoUpdateOrFunction(oldInfo), oldInfo);
			} else {
				this._setAssetInfo(
					file,
					cachedCleverMerge(oldInfo, assetInfoUpdateOrFunction),
					oldInfo
				);
			}
		}
	}

	renameAsset(file, newFile) {
		const source = this.assets[file];
		if (!source) {
			throw new Error(
				`Called Compilation.renameAsset for not existing filename ${file}`
			);
		}
		if (this.assets[newFile]) {
			if (!isSourceEqual(this.assets[file], source)) {
				this.errors.push(
					new WebpackError(
						`Conflict: Called Compilation.renameAsset for already existing filename ${newFile} with different content`
					)
				);
			}
		}
		const assetInfo = this.assetsInfo.get(file);
		// Update related in all other assets
		const relatedInInfo = this._assetsRelatedIn.get(file);
		if (relatedInInfo) {
			for (const [key, assets] of relatedInInfo) {
				for (const name of assets) {
					const info = this.assetsInfo.get(name);
					if (!info) continue;
					const related = info.related;
					if (!related) continue;
					const entry = related[key];
					let newEntry;
					if (Array.isArray(entry)) {
						newEntry = entry.map(x => (x === file ? newFile : x));
					} else if (entry === file) {
						newEntry = newFile;
					} else continue;
					this.assetsInfo.set(name, {
						...info,
						related: {
							...related,
							[key]: newEntry
						}
					});
				}
			}
		}
		this._setAssetInfo(file, undefined, assetInfo);
		this._setAssetInfo(newFile, assetInfo);
		delete this.assets[file];
		this.assets[newFile] = source;
		for (const chunk of this.chunks) {
			{
				const size = chunk.files.size;
				chunk.files.delete(file);
				if (size !== chunk.files.size) {
					chunk.files.add(newFile);
				}
			}
			{
				const size = chunk.auxiliaryFiles.size;
				chunk.auxiliaryFiles.delete(file);
				if (size !== chunk.auxiliaryFiles.size) {
					chunk.auxiliaryFiles.add(newFile);
				}
			}
		}
	}

	/**
	 * @param {string} file file name
	 */
	deleteAsset(file) {
		if (!this.assets[file]) {
			return;
		}
		delete this.assets[file];
		const assetInfo = this.assetsInfo.get(file);
		this._setAssetInfo(file, undefined, assetInfo);
		const related = assetInfo && assetInfo.related;
		if (related) {
			for (const key of Object.keys(related)) {
				const checkUsedAndDelete = file => {
					if (!this._assetsRelatedIn.has(file)) {
						this.deleteAsset(file);
					}
				};
				const items = related[key];
				if (Array.isArray(items)) {
					items.forEach(checkUsedAndDelete);
				} else if (items) {
					checkUsedAndDelete(items);
				}
			}
		}
		// TODO If this becomes a performance problem
		// store a reverse mapping from asset to chunk
		for (const chunk of this.chunks) {
			chunk.files.delete(file);
			chunk.auxiliaryFiles.delete(file);
		}
	}

	getAssets() {
		/** @type {Readonly<Asset>[]} */
		const array = [];
		for (const assetName of Object.keys(this.assets)) {
			if (Object.prototype.hasOwnProperty.call(this.assets, assetName)) {
				array.push({
					name: assetName,
					source: this.assets[assetName],
					info: this.assetsInfo.get(assetName) || EMPTY_ASSET_INFO
				});
			}
		}
		return array;
	}

	/**
	 * @param {string} name the name of the asset
	 * @returns {Readonly<Asset> | undefined} the asset or undefined when not found
	 */
	getAsset(name) {
		if (!Object.prototype.hasOwnProperty.call(this.assets, name))
			return undefined;
		return {
			name,
			source: this.assets[name],
			info: this.assetsInfo.get(name) || EMPTY_ASSET_INFO
		};
	}

	clearAssets() {
		for (const chunk of this.chunks) {
			chunk.files.clear();
			chunk.auxiliaryFiles.clear();
		}
	}

	createModuleAssets() {
		const { chunkGraph } = this;
		for (const module of this.modules) {
			if (module.buildInfo.assets) {
				const assetsInfo = module.buildInfo.assetsInfo;
				for (const assetName of Object.keys(module.buildInfo.assets)) {
					const fileName = this.getPath(assetName, {
						chunkGraph: this.chunkGraph,
						module
					});
					for (const chunk of chunkGraph.getModuleChunksIterable(module)) {
						chunk.auxiliaryFiles.add(fileName);
					}
					this.emitAsset(
						fileName,
						module.buildInfo.assets[assetName],
						assetsInfo ? assetsInfo.get(assetName) : undefined
					);
					this.hooks.moduleAsset.call(module, fileName);
				}
			}
		}
	}

	/**
	 * @param {RenderManifestOptions} options options object
	 * @returns {RenderManifestEntry[]} manifest entries
	 */
	getRenderManifest(options) {
		return this.hooks.renderManifest.call([], options);
	}

	/**
	 * @param {Callback} callback signals when the call finishes
	 * @returns {void}
	 */
	createChunkAssets(callback) {
		const outputOptions = this.outputOptions;
		const cachedSourceMap = new WeakMap();
		/** @type {Map<string, {hash: string, source: Source, chunk: Chunk}>} */
		const alreadyWrittenFiles = new Map();

		asyncLib.forEachLimit(
			this.chunks,
			15,
			(chunk, callback) => {
				/** @type {RenderManifestEntry[]} */
				let manifest;
				try {
					manifest = this.getRenderManifest({
						chunk,
						hash: this.hash,
						fullHash: this.fullHash,
						outputOptions,
						codeGenerationResults: this.codeGenerationResults,
						moduleTemplates: this.moduleTemplates,
						dependencyTemplates: this.dependencyTemplates,
						chunkGraph: this.chunkGraph,
						moduleGraph: this.moduleGraph,
						runtimeTemplate: this.runtimeTemplate
					});
				} catch (err) {
					this.errors.push(new ChunkRenderError(chunk, "", err));
					return callback();
				}
				asyncLib.forEach(
					manifest,
					(fileManifest, callback) => {
						const ident = fileManifest.identifier;
						const usedHash = fileManifest.hash;

						const assetCacheItem = this._assetsCache.getItemCache(
							ident,
							usedHash
						);

						assetCacheItem.get((err, sourceFromCache) => {
							/** @type {string | function(PathData, AssetInfo=): string} */
							let filenameTemplate;
							/** @type {string} */
							let file;
							/** @type {AssetInfo} */
							let assetInfo;

							let inTry = true;
							const errorAndCallback = err => {
								const filename =
									file ||
									(typeof file === "string"
										? file
										: typeof filenameTemplate === "string"
										? filenameTemplate
										: "");

								this.errors.push(new ChunkRenderError(chunk, filename, err));
								inTry = false;
								return callback();
							};

							try {
								if ("filename" in fileManifest) {
									file = fileManifest.filename;
									assetInfo = fileManifest.info;
								} else {
									filenameTemplate = fileManifest.filenameTemplate;
									const pathAndInfo = this.getPathWithInfo(
										filenameTemplate,
										fileManifest.pathOptions
									);
									file = pathAndInfo.path;
									assetInfo = fileManifest.info
										? {
												...pathAndInfo.info,
												...fileManifest.info
										  }
										: pathAndInfo.info;
								}

								if (err) {
									return errorAndCallback(err);
								}

								let source = sourceFromCache;

								// check if the same filename was already written by another chunk
								const alreadyWritten = alreadyWrittenFiles.get(file);
								if (alreadyWritten !== undefined) {
									if (alreadyWritten.hash !== usedHash) {
										inTry = false;
										return callback(
											new WebpackError(
												`Conflict: Multiple chunks emit assets to the same filename ${file}` +
													` (chunks ${alreadyWritten.chunk.id} and ${chunk.id})`
											)
										);
									} else {
										source = alreadyWritten.source;
									}
								} else if (!source) {
									// render the asset
									source = fileManifest.render();

									// Ensure that source is a cached source to avoid additional cost because of repeated access
									if (!(source instanceof CachedSource)) {
										const cacheEntry = cachedSourceMap.get(source);
										if (cacheEntry) {
											source = cacheEntry;
										} else {
											const cachedSource = new CachedSource(source);
											cachedSourceMap.set(source, cachedSource);
											source = cachedSource;
										}
									}
								}
								this.emitAsset(file, source, assetInfo);
								if (fileManifest.auxiliary) {
									chunk.auxiliaryFiles.add(file);
								} else {
									chunk.files.add(file);
								}
								this.hooks.chunkAsset.call(chunk, file);
								alreadyWrittenFiles.set(file, {
									hash: usedHash,
									source,
									chunk
								});
								if (source !== sourceFromCache) {
									assetCacheItem.store(source, err => {
										if (err) return errorAndCallback(err);
										inTry = false;
										return callback();
									});
								} else {
									inTry = false;
									callback();
								}
							} catch (err) {
								if (!inTry) throw err;
								errorAndCallback(err);
							}
						});
					},
					callback
				);
			},
			callback
		);
	}

	/**
	 * @param {string | function(PathData, AssetInfo=): string} filename used to get asset path with hash
	 * @param {PathData} data context data
	 * @returns {string} interpolated path
	 */
	getPath(filename, data = {}) {
		if (!data.hash) {
			data = {
				hash: this.hash,
				...data
			};
		}
		return this.getAssetPath(filename, data);
	}

	/**
	 * @param {string | function(PathData, AssetInfo=): string} filename used to get asset path with hash
	 * @param {PathData} data context data
	 * @returns {{ path: string, info: AssetInfo }} interpolated path and asset info
	 */
	getPathWithInfo(filename, data = {}) {
		if (!data.hash) {
			data = {
				hash: this.hash,
				...data
			};
		}
		return this.getAssetPathWithInfo(filename, data);
	}

	/**
	 * @param {string | function(PathData, AssetInfo=): string} filename used to get asset path with hash 用于通过哈希获取资产路径
	 * @param {PathData} data context data
	 * @returns {string} interpolated path 插值路径
	 */
	getAssetPath(filename, data) {
		return this.hooks.assetPath.call(
			typeof filename === "function" ? filename(data) : filename,
			data,
			undefined
		);
	}

	/**
	 * @param {string | function(PathData, AssetInfo=): string} filename used to get asset path with hash 用于通过哈希获取资产路径
	 * @param {PathData} data context data
	 * @returns {{ path: string, info: AssetInfo }} interpolated path and asset info 插值路径和资产信息
	 */
	getAssetPathWithInfo(filename, data) {
		const assetInfo = {};
		// TODO webpack 5: refactor assetPath hook to receive { path, info } object TODO webpack 5：重构assetPath钩子以接收{path，info}对象
		/**
		 * assetPath：调用以决定 asset 的路径
		 * SyncWaterfallHook：同步钩子，接受至少一个参数，上一个注册的回调返回值会作为下一个注册的回调的参数
		 * 在这个钩子中，决定 chunk 的名称
		 */
		const newPath = this.hooks.assetPath.call(
			typeof filename === "function" ? filename(data, assetInfo) : filename,
			data,
			assetInfo
		);
		return { path: newPath, info: assetInfo };
	}

	getWarnings() {
		return this.hooks.processWarnings.call(this.warnings);
	}

	getErrors() {
		return this.hooks.processErrors.call(this.errors);
	}

	/**
	 * This function allows you to run another instance of webpack inside of webpack however as 这个函数允许你在webpack内部运行另一个webpack实例
	 * a child with different settings and configurations (if desired) applied. It copies all hooks, plugins 具有不同设置和配置(如果需要)的子应用。它复制所有的钩子和插件
	 * from parent (or top level compiler) and creates a child Compilation 从父编译器(或顶级编译器)创建一个子编译器
	 *
	 * @param {string} name name of the child compiler
	 * @param {OutputOptions=} outputOptions // Need to convert config schema to types for this
	 * @param {Array<WebpackPluginInstance | WebpackPluginFunction>=} plugins webpack plugins that will be applied
	 * @returns {Compiler} creates a child Compiler instance
	 */
	createChildCompiler(name, outputOptions, plugins) {
		const idx = this.childrenCounters[name] || 0;
		this.childrenCounters[name] = idx + 1;
		return this.compiler.createChildCompiler(
			this,
			name,
			idx,
			outputOptions,
			plugins
		);
	}

	/**
	 * @param {Module} module the module
	 * @param {ExecuteModuleOptions} options options
	 * @param {ExecuteModuleCallback} callback callback
	 */
	executeModule(module, options, callback) {
		// Aggregate all referenced modules and ensure they are ready
		const modules = new Set([module]);
		processAsyncTree(
			modules,
			10,
			/**
			 * @param {Module} module the module
			 * @param {function(Module): void} push push more jobs
			 * @param {Callback} callback callback
			 * @returns {void}
			 */
			(module, push, callback) => {
				this.buildQueue.waitFor(module, err => {
					if (err) return callback(err);
					this.processDependenciesQueue.waitFor(module, err => {
						if (err) return callback(err);
						for (const { module: m } of this.moduleGraph.getOutgoingConnections(
							module
						)) {
							const size = modules.size;
							modules.add(m);
							if (modules.size !== size) push(m);
						}
						callback();
					});
				});
			},
			err => {
				if (err) return callback(err);

				// Create new chunk graph, chunk and entrypoint for the build time execution
				const chunkGraph = new ChunkGraph(
					this.moduleGraph,
					this.outputOptions.hashFunction
				);
				const runtime = "build time";
				const { hashFunction, hashDigest, hashDigestLength } =
					this.outputOptions;
				const runtimeTemplate = this.runtimeTemplate;

				const chunk = new Chunk("build time chunk", this._backCompat);
				chunk.id = chunk.name;
				chunk.ids = [chunk.id];
				chunk.runtime = runtime;

				const entrypoint = new Entrypoint({
					runtime,
					chunkLoading: false,
					...options.entryOptions
				});
				chunkGraph.connectChunkAndEntryModule(chunk, module, entrypoint);
				connectChunkGroupAndChunk(entrypoint, chunk);
				entrypoint.setRuntimeChunk(chunk);
				entrypoint.setEntrypointChunk(chunk);

				const chunks = new Set([chunk]);

				// Assign ids to modules and modules to the chunk
				for (const module of modules) {
					const id = module.identifier();
					chunkGraph.setModuleId(module, id);
					chunkGraph.connectChunkAndModule(chunk, module);
				}

				// Hash modules
				for (const module of modules) {
					this._createModuleHash(
						module,
						chunkGraph,
						runtime,
						hashFunction,
						runtimeTemplate,
						hashDigest,
						hashDigestLength
					);
				}

				const codeGenerationResults = new CodeGenerationResults(
					this.outputOptions.hashFunction
				);
				/** @type {WebpackError[]} */
				const errors = [];
				/**
				 * @param {Module} module the module
				 * @param {Callback} callback callback
				 * @returns {void}
				 */
				const codeGen = (module, callback) => {
					this._codeGenerationModule(
						module,
						runtime,
						[runtime],
						chunkGraph.getModuleHash(module, runtime),
						this.dependencyTemplates,
						chunkGraph,
						this.moduleGraph,
						runtimeTemplate,
						errors,
						codeGenerationResults,
						(err, codeGenerated) => {
							callback(err);
						}
					);
				};

				const reportErrors = () => {
					if (errors.length > 0) {
						errors.sort(
							compareSelect(err => err.module, compareModulesByIdentifier)
						);
						for (const error of errors) {
							this.errors.push(error);
						}
						errors.length = 0;
					}
				};

				// Generate code for all aggregated modules
				asyncLib.eachLimit(modules, 10, codeGen, err => {
					if (err) return callback(err);
					reportErrors();

					// for backward-compat temporary set the chunk graph
					// TODO webpack 6
					const old = this.chunkGraph;
					this.chunkGraph = chunkGraph;
					this.processRuntimeRequirements({
						chunkGraph,
						modules,
						chunks,
						codeGenerationResults,
						chunkGraphEntries: chunks
					});
					this.chunkGraph = old;

					const runtimeModules =
						chunkGraph.getChunkRuntimeModulesIterable(chunk);

					// Hash runtime modules
					for (const module of runtimeModules) {
						modules.add(module);
						this._createModuleHash(
							module,
							chunkGraph,
							runtime,
							hashFunction,
							runtimeTemplate,
							hashDigest,
							hashDigestLength
						);
					}

					// Generate code for all runtime modules
					asyncLib.eachLimit(runtimeModules, 10, codeGen, err => {
						if (err) return callback(err);
						reportErrors();

						/** @type {Map<Module, ExecuteModuleArgument>} */
						const moduleArgumentsMap = new Map();
						/** @type {Map<string, ExecuteModuleArgument>} */
						const moduleArgumentsById = new Map();

						/** @type {ExecuteModuleResult["fileDependencies"]} */
						const fileDependencies = new LazySet();
						/** @type {ExecuteModuleResult["contextDependencies"]} */
						const contextDependencies = new LazySet();
						/** @type {ExecuteModuleResult["missingDependencies"]} */
						const missingDependencies = new LazySet();
						/** @type {ExecuteModuleResult["buildDependencies"]} */
						const buildDependencies = new LazySet();

						/** @type {ExecuteModuleResult["assets"]} */
						const assets = new Map();

						let cacheable = true;

						/** @type {ExecuteModuleContext} */
						const context = {
							assets,
							__webpack_require__: undefined,
							chunk,
							chunkGraph
						};

						// Prepare execution
						asyncLib.eachLimit(
							modules,
							10,
							(module, callback) => {
								const codeGenerationResult = codeGenerationResults.get(
									module,
									runtime
								);
								/** @type {ExecuteModuleArgument} */
								const moduleArgument = {
									module,
									codeGenerationResult,
									preparedInfo: undefined,
									moduleObject: undefined
								};
								moduleArgumentsMap.set(module, moduleArgument);
								moduleArgumentsById.set(module.identifier(), moduleArgument);
								module.addCacheDependencies(
									fileDependencies,
									contextDependencies,
									missingDependencies,
									buildDependencies
								);
								if (module.buildInfo.cacheable === false) {
									cacheable = false;
								}
								if (module.buildInfo && module.buildInfo.assets) {
									const { assets: moduleAssets, assetsInfo } = module.buildInfo;
									for (const assetName of Object.keys(moduleAssets)) {
										assets.set(assetName, {
											source: moduleAssets[assetName],
											info: assetsInfo ? assetsInfo.get(assetName) : undefined
										});
									}
								}
								this.hooks.prepareModuleExecution.callAsync(
									moduleArgument,
									context,
									callback
								);
							},
							err => {
								if (err) return callback(err);

								let exports;
								try {
									const {
										strictModuleErrorHandling,
										strictModuleExceptionHandling
									} = this.outputOptions;
									const __webpack_require__ = id => {
										const cached = moduleCache[id];
										if (cached !== undefined) {
											if (cached.error) throw cached.error;
											return cached.exports;
										}
										const moduleArgument = moduleArgumentsById.get(id);
										return __webpack_require_module__(moduleArgument, id);
									};
									const interceptModuleExecution = (__webpack_require__[
										RuntimeGlobals.interceptModuleExecution.replace(
											"__webpack_require__.",
											""
										)
									] = []);
									const moduleCache = (__webpack_require__[
										RuntimeGlobals.moduleCache.replace(
											"__webpack_require__.",
											""
										)
									] = {});

									context.__webpack_require__ = __webpack_require__;

									/**
									 * @param {ExecuteModuleArgument} moduleArgument the module argument
									 * @param {string=} id id
									 * @returns {any} exports
									 */
									const __webpack_require_module__ = (moduleArgument, id) => {
										var execOptions = {
											id,
											module: {
												id,
												exports: {},
												loaded: false,
												error: undefined
											},
											require: __webpack_require__
										};
										interceptModuleExecution.forEach(handler =>
											handler(execOptions)
										);
										const module = moduleArgument.module;
										this.buildTimeExecutedModules.add(module);
										const moduleObject = execOptions.module;
										moduleArgument.moduleObject = moduleObject;
										try {
											if (id) moduleCache[id] = moduleObject;

											tryRunOrWebpackError(
												() =>
													this.hooks.executeModule.call(
														moduleArgument,
														context
													),
												"Compilation.hooks.executeModule"
											);
											moduleObject.loaded = true;
											return moduleObject.exports;
										} catch (e) {
											if (strictModuleExceptionHandling) {
												if (id) delete moduleCache[id];
											} else if (strictModuleErrorHandling) {
												moduleObject.error = e;
											}
											if (!e.module) e.module = module;
											throw e;
										}
									};

									for (const runtimeModule of chunkGraph.getChunkRuntimeModulesInOrder(
										chunk
									)) {
										__webpack_require_module__(
											moduleArgumentsMap.get(runtimeModule)
										);
									}
									exports = __webpack_require__(module.identifier());
								} catch (e) {
									const err = new WebpackError(
										`Execution of module code from module graph (${module.readableIdentifier(
											this.requestShortener
										)}) failed: ${e.message}`
									);
									err.stack = e.stack;
									err.module = e.module;
									return callback(err);
								}

								callback(null, {
									exports,
									assets,
									cacheable,
									fileDependencies,
									contextDependencies,
									missingDependencies,
									buildDependencies
								});
							}
						);
					});
				});
			}
		);
	}

	checkConstraints() {
		const chunkGraph = this.chunkGraph;

		/** @type {Set<number|string>} */
		const usedIds = new Set();

		for (const module of this.modules) {
			if (module.type === "runtime") continue;
			const moduleId = chunkGraph.getModuleId(module);
			if (moduleId === null) continue;
			if (usedIds.has(moduleId)) {
				throw new Error(`checkConstraints: duplicate module id ${moduleId}`);
			}
			usedIds.add(moduleId);
		}

		for (const chunk of this.chunks) {
			for (const module of chunkGraph.getChunkModulesIterable(chunk)) {
				if (!this.modules.has(module)) {
					throw new Error(
						"checkConstraints: module in chunk but not in compilation " +
							` ${chunk.debugId} ${module.debugId}`
					);
				}
			}
			for (const module of chunkGraph.getChunkEntryModulesIterable(chunk)) {
				if (!this.modules.has(module)) {
					throw new Error(
						"checkConstraints: entry module in chunk but not in compilation " +
							` ${chunk.debugId} ${module.debugId}`
					);
				}
			}
		}

		for (const chunkGroup of this.chunkGroups) {
			chunkGroup.checkConstraints();
		}
	}
}

/**
 * @typedef {Object} FactorizeModuleOptions
 * @property {ModuleProfile} currentProfile
 * @property {ModuleFactory} factory
 * @property {Dependency[]} dependencies
 * @property {boolean=} factoryResult return full ModuleFactoryResult instead of only module
 * @property {Module | null} originModule
 * @property {Partial<ModuleFactoryCreateDataContextInfo>=} contextInfo
 * @property {string=} context
 */

/**
 * @param {FactorizeModuleOptions} options options object
 * @param {ModuleCallback | ModuleFactoryResultCallback} callback callback
 * @returns {void}
 */

// Workaround for typescript as it doesn't support function overloading in jsdoc within a class typescript的变通方法，因为它不支持类内jsdoc中的函数重载
// 启动创建模块实例(可以用来表示这个模块，例如：loaders、parser、模块路径等信息) - 在内部通过一种运行机制，最终会调用 _factorizeModule 方法进而启动创建流程
Compilation.prototype.factorizeModule = /** @type {{
	(options: FactorizeModuleOptions & { factoryResult?: false }, callback: ModuleCallback): void;
	(options: FactorizeModuleOptions & { factoryResult: true }, callback: ModuleFactoryResultCallback): void;
}} */ (
	function (options, callback) {
		this.factorizeQueue.add(options, callback);
	}
);

// Hide from typescript
const compilationPrototype = Compilation.prototype;

// TODO webpack 6 remove
Object.defineProperty(compilationPrototype, "modifyHash", {
	writable: false,
	enumerable: false,
	configurable: false,
	value: () => {
		throw new Error(
			"Compilation.modifyHash was removed in favor of Compilation.hooks.fullHash"
		);
	}
});

// TODO webpack 6 remove
Object.defineProperty(compilationPrototype, "cache", {
	enumerable: false,
	configurable: false,
	get: util.deprecate(
		/**
		 * @this {Compilation} the compilation
		 * @returns {Cache} the cache
		 */
		function () {
			return this.compiler.cache;
		},
		"Compilation.cache was removed in favor of Compilation.getCache()",
		"DEP_WEBPACK_COMPILATION_CACHE"
	),
	set: util.deprecate(
		v => {},
		"Compilation.cache was removed in favor of Compilation.getCache()",
		"DEP_WEBPACK_COMPILATION_CACHE"
	)
});

/**
 * Add additional assets to the compilation.
 */
Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL = -2000;

/**
 * Basic preprocessing of assets.
 */
Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS = -1000;

/**
 * Derive new assets from existing assets.
 * Existing assets should not be treated as complete.
 */
Compilation.PROCESS_ASSETS_STAGE_DERIVED = -200;

/**
 * Add additional sections to existing assets, like a banner or initialization code.
 */
Compilation.PROCESS_ASSETS_STAGE_ADDITIONS = -100;

/**
 * Optimize existing assets in a general way.
 */
Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE = 100;

/**
 * Optimize the count of existing assets, e. g. by merging them.
 * Only assets of the same type should be merged.
 * For assets of different types see PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE.
 */
Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_COUNT = 200;

/**
 * Optimize the compatibility of existing assets, e. g. add polyfills or vendor-prefixes.
 */
Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_COMPATIBILITY = 300;

/**
 * Optimize the size of existing assets, e. g. by minimizing or omitting whitespace.
 */
Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE = 400;

/**
 * Add development tooling to assets, e. g. by extracting a SourceMap.
 */
Compilation.PROCESS_ASSETS_STAGE_DEV_TOOLING = 500;

/**
 * Optimize the count of existing assets, e. g. by inlining assets of into other assets.
 * Only assets of different types should be inlined.
 * For assets of the same type see PROCESS_ASSETS_STAGE_OPTIMIZE_COUNT.
 */
Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE = 700;

/**
 * Summarize the list of existing assets
 * e. g. creating an assets manifest of Service Workers.
 */
Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE = 1000;

/**
 * Optimize the hashes of the assets, e. g. by generating real hashes of the asset content.
 */
Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_HASH = 2500;

/**
 * Optimize the transfer of existing assets, e. g. by preparing a compressed (gzip) file as separate asset.
 */
Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER = 3000;

/**
 * Analyse existing assets.
 */
Compilation.PROCESS_ASSETS_STAGE_ANALYSE = 4000;

/**
 * Creating assets for reporting purposes.
 */
Compilation.PROCESS_ASSETS_STAGE_REPORT = 5000;

module.exports = Compilation;
