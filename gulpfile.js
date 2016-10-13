var gulp = require("gulp"); //gulp核心模块
var sass = require("gulp-sass");  //sass编译
var server = require("gulp-connect"); //服务器
var concat = require("gulp-concat"); //合并
var uglify = require("gulp-uglify"); //压缩
var minifyCss = require("gulp-minify-css"); //css压缩
var imgmin = require("gulp-imagemin");  //图片压缩
var rename = require("gulp-rename");  //对文件进行重命名
var rev = require("gulp-rev"); //给静态资源添加上一个hash值后缀
var revCollector = require("gulp-rev-collector");  //根据rev生成manifest用来替换html link
var prefixer = require("gulp-autoprefixer"); //自动添加浏览器厂商前缀
var htmlmin = require("gulp-htmlmin"); //对页面进行压缩

gulp.task("default",["copyindex","copy-img","copy-data"]);

//根据rev-manifest对link路径进行替换
gulp.task("rev-collector",function(){
    return gulp.src(["dist/css/**/*.json","dist/index.html"])
        .pipe(revCollector({
            replaceReved: true,
        }))
        .pipe(gulp.dest("dist/"))

})

gulp.task("addPrx",function(){
    return gulp.src("src/css2/*.css")
        .pipe(prefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(gulp.dest("dist/css/"))
})

//创建服务器
gulp.task("server",function(){
    server.server({
       root:"dist"
    })
})

//js 合并
gulp.task("js",function(){
    return gulp.src("src/js/**/*")
        .pipe(concat("all.js"))
        .pipe(gulp.dest("dist/js/"))

});

//合并与压缩
gulp.task("js-c",function(){
    return gulp.src("src/script/**/*")
        .pipe(concat("all-c.js"))
        .pipe(gulp.dest("dist/js/"))
        .pipe(uglify())
        .pipe(rename("all-c-min.js"))
        .pipe(gulp.dest("dist/js/"))


});

//对css文件进行压缩
gulp.task("css",function(){
    return gulp.src("src/css/*.css")
        .pipe(minifyCss())
        .pipe(gulp.dest("dist/css/"))
        .pipe(rev())
        .pipe(gulp.dest("dist/css/"))
        .pipe(rev.manifest())
        .pipe(gulp.dest("dist/css/"))
})


//<!--copy src:操作的目录 dest:目标目录-->
gulp.task("copyindex",function(){
    return gulp.src("src/index.html")
        .pipe(htmlmin({
            minifyCSS:true,
            minifyJS:true,
            removeComments:true,
            collapseWhitespace:true
        }))
        .pipe(gulp.dest("dist/"))
})

//批量copy
gulp.task("copy-img",function(){
    return gulp.src("src/images/**/*")
        .pipe(imgmin())
        .pipe(gulp.dest("dist/images/"))
})

//多组文件的操作
gulp.task("copy-data",function(){
    return gulp.src(["src/json/*","src/xml/*","!src/json/s-*.json"])
        .pipe(gulp.dest("dist/data/"));
})

gulp.task("sass-c",function(){
    return gulp.src("src/scss/**/*.scss")
        .pipe(sass())

        .pipe(gulp.dest("dist/css/"))
})

//watch
gulp.task("watch",function(){
    gulp.watch("src/index.html",["copyindex"]);
    gulp.watch("src/images/**/*",["copy-img"]);
    gulp.watch(["src/json/*","src/xml/*"],["copy-data"]);

})