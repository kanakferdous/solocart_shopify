const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("sass");
const gulpSass = require("gulp-sass")(sass);
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const exec = require("child_process").exec; // Import exec for running shopify theme serve

const isProduction = process.env.NODE_ENV === "production";

// Paths
const paths = {
  scss: "src/scss/**/*.scss", // Source SCSS files
  js: "src/js/**/*.js", // Source JS files
  cssOutput: "assets", // Output styles.css to the assets folder
  jsOutput: "assets", // Output main.js to the assets folder
};

// Compile SCSS to minified CSS and output to styles.css
function compileSCSS() {
  return src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(gulpSass().on("error", gulpSass.logError))
    .pipe(
      postcss([
        autoprefixer({
          overrideBrowserslist: ["last 2 versions"],
          cascade: false,
        }),
        cssnano(), // Minifies the CSS
      ])
    )
    .pipe(rename({ basename: "styles" })) // Output to styles.css
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.cssOutput))
    .pipe(browserSync.stream());
}

// Minify JavaScript and output to main.js
function minifyJS() {
  return src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ basename: "main" })) // Output to main.js
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.jsOutput))
    .pipe(browserSync.stream());
}

// Shopify Theme Serve
function shopifyServe(cb) {
  exec("shopify theme serve", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

// Watch for changes
function watchFiles() {
  watch(paths.scss, compileSCSS);
  watch(paths.js, minifyJS);
}

// Default task combining Gulp tasks and Shopify theme serve
exports.default = parallel(shopifyServe, watchFiles);
