const { env } = require('process');
const { DefinePlugin } = require('webpack');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserDisconnectTimeout: 100000,

        browserNoActivityTimeout: 100000,

        concurrency: 1,

        files: ['test/expectation/edge/legacy/**/*.js'],

        frameworks: ['mocha', 'sinon-chai'],

        preprocessors: {
            'test/expectation-edge/**/*.js': 'webpack'
        },

        reporters: ['dots'],

        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.ts?$/,
                        use: {
                            loader: 'ts-loader',
                            options: {
                                compilerOptions: {
                                    declaration: false,
                                    declarationMap: false
                                }
                            }
                        }
                    }
                ]
            },
            plugins: [
                new DefinePlugin({
                    'process.env': {
                        CI: JSON.stringify(env.CI)
                    }
                })
            ],
            resolve: {
                extensions: ['.js', '.ts'],
                fallback: { util: false }
            }
        },

        webpackMiddleware: {
            noInfo: true
        }
    });

    if (env.CI) {
        config.set({
            browsers:
                env.TARGET === 'chrome'
                    ? ['ChromeSauceLabs']
                    : env.TARGET === 'firefox'
                    ? ['FirefoxSauceLabs']
                    : env.TARGET === 'safari'
                    ? ['SafariSauceLabs']
                    : ['ChromeSauceLabs', 'FirefoxSauceLabs', 'SafariSauceLabs'],

            captureTimeout: 300000,

            customLaunchers: {
                ChromeSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'chrome',
                    captureTimeout: 300,
                    platform: 'macOS 11.00'
                },
                FirefoxSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'firefox',
                    captureTimeout: 300,
                    platform: 'macOS 11.00'
                },
                SafariSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'safari',
                    captureTimeout: 300,
                    platform: 'macOS 11.00'
                }
            },

            sauceLabs: {
                recordVideo: false
            }
        });
    } else {
        config.set({
            browsers: ['ChromeCanaryHeadless', 'ChromeHeadless', 'FirefoxDeveloperHeadless', 'FirefoxHeadless', 'Safari']
        });
    }
};