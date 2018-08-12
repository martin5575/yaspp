1. Use ubuntu: `yarn build`
1. Update `index.html` -> make all paths relative, ie. transform `'/...'` to `'./...'`
1. Test deployment, e.g. use `http-server`
   - goto folder `./build`
   - run command `http-server .`
1. Checkin folder `./build`
