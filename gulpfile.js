var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const gulp = require('gulp');
const ts = require('gulp-typescript');
const project = ts.createProject('tsconfig.json');
gulp.task('compile', () => {
    return gulp.src('src/**/*.ts')
        .pipe(project())
        .pipe(gulp.dest('dist/'));
});
gulp.task('copy', () => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        gulp.src('README.md').pipe(gulp.dest("dist/"));
        gulp.src("src/module.json").pipe(gulp.dest('dist/'));
        gulp.src("src/lang/**").pipe(gulp.dest('dist/lang/'));
        gulp.src("src/templates/**").pipe(gulp.dest('dist/templates/'));
        gulp.src("src/styles/**").pipe(gulp.dest('dist/styles/'));
        gulp.src("src/assets/**").pipe(gulp.dest('dist/assets/'));
        resolve();
    });
}));
gulp.task('build', gulp.parallel('compile', 'copy'));
/*
// This is supposed to copy the dist folder into the modules directory for testing. Only works if you've set it up the right way
//This works if development path is FoundryVTT/Data/dev/modules/swade-item-macros
const MODULEPATH = "../../../modules/swade-item-macros/"

gulp.task('foundry', () => {
  return gulp.src('dist/**').pipe(gulp.dest(MODULEPATH))
})

gulp.task("update", gulp.series('build', 'foundry'))
*/
