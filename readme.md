[Read documents here](https://docs.moj.io/#/document/view/doc_js).




*Code Coverage:*
You need istanbul library for code coverage. Try the following, after you get your mocha tests to pass (and have installed mocha globally):

npm install -g istanbul
istanbul cover _mocha -- -R spec
open coverage/lcov-report/index.html
