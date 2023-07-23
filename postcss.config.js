module.exports = {
    plugins: [
        require('autoprefixer'),
        require('css-mqpacker'),
        require('cssnano')({
            preset: [
                'default',
                {
                    normalizeWhitespace: false,
                },
            ],
        }),
    ],
    minimize: false,
}
