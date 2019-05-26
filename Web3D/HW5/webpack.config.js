var path = require('path');
var AutoDllPlugin = require('autodll-webpack-plugin');

var config = {
    module: {}
};

// npm init
// npm install @babel/core @babel/preset-env babel-loader webpack webpack-cli three express autodll-webpack-plugin
// 去改package.json 裡的 script
/*
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "webpack --progress --mode=production",        <-- 新增這兩行
        "watch": "webpack --progress --mode=production --watch"
    }
*/

// cmd 打 npm run watch 程式就會自動聆聽檔案反應
/*
    在index.html中，只要引入
    <script src="build/vendor.dll.js"></script>
    <script src="build/main.bundle.js"></script>

    即可，有問題再問阿土
*/

var Config = Object.assign({},config,{
    name: "main",
    entry: "./main.js",     // <--要動的檔案(入口)
    output: {
        path: path.resolve('E:/GameProgram/web3D/HW5/build'),  //<---路徑
        filename: "main.bundle.js"
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new AutoDllPlugin({
            filename: '[name].dll.js',
            entry: {
                vendor: ['three']
            }
        })
    ],

    stats: {
        colors: true
    },
    devtool: 'source-map'
})

module.exports = [
    Config
];
