// for example, import is working
//import Post from "@modules/post";
//import JsLogo from "@/assets/js-logo";
// const post = new Post("webpack", JsLogo);

// for example, css and preprocessor working
import "./styles/styles.css";
import "./styles/sass.scss";

//dynamic import
import('lodash').then( _ => {
    console.log('lodash', _.random(0, 10, true))
})

