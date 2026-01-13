const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  
  // 프로덕션 배포를 위한 설정
  publicPath: '/',
  
  // 빌드 최적화 설정
  productionSourceMap: false,

  // 오프라인 실행을 위한 추가 설정
  configureWebpack: {
    entry: {
      app: './src/main.ts'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.vue', '.json']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
          exclude: /node_modules/,
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    }
  },

  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Easy-Epidemiology Web v2.0';
        // 오프라인 실행을 위한 메타 태그 추가
        args[0].meta = {
          ...args[0].meta,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        };
        // Cloudflare Pages 호환성을 위한 추가 설정
        args[0].templateParameters = {
          ...args[0].templateParameters,
          BASE_URL: './'
        };
        return args;
      });

    // Feature flags definition
    config.plugin('define').tap(definitions => {
      Object.assign(definitions[0], {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      });
      return definitions;
    });

    // 외부 리소스 처리
    config.module
      .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 10000,
        name: 'fonts/[name].[hash:8].[ext]'
      });
  }
});
